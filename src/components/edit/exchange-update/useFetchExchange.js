import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'

export const ouGroupPrefix = 'OU_GROUP-'
export const ouLevelPrefix = 'LEVEL-'

const EXCHANGE_QUERY = {
    exchange: {
        resource: 'aggregateDataExchanges',
        id: ({ id }) => id,
        params: {
            paging: false,
        },
    },
}

const ORG_UNITS_QUERY = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: ({ ids }) => ({
            paging: false,
            fields: ['id', 'displayName~rename(name)', 'path'],
            filter: `id:in:[${ids.join()}]`,
        }),
    },
}

const VISUALIZATIONS_QUERY = {
    visualizations: {
        resource: 'visualizations',
        params: ({ ids }) => ({
            paging: false,
            fields: ['id', 'displayName~rename(name)', 'href'],
            filter: `id:in:[${ids.join()}]`,
        }),
    },
}

const ANALYTICS_QUERY = {
    metadata: {
        resource: 'analytics',
        params: ({ ou, dx, pe }) => ({
            dimension: `dx:${dx.join(';')},ou:${ou.join(';')},pe:${pe.join(
                ';'
            )}`,
            skipMeta: false,
            skipData: true,
            includeMetadataDetails: true,
        }),
    },
}

const getMetadataByRequest = async ({ engine, variables }) => {
    return await engine.query(ANALYTICS_QUERY, {
        variables,
    })
}

export const useFetchExchange = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ id }) => {
            // set to loading
            setLoading(true)
            try {
                const { exchange } = await engine.query(EXCHANGE_QUERY, {
                    variables: { id },
                })

                // get metadata information for dx, pe
                const metadataRequests = exchange.source.requests.map(
                    ({ ou, dx, pe }) => {
                        return getMetadataByRequest({
                            engine,
                            variables: { ou, dx, pe },
                        })
                    }
                )

                const metadataResponses = await Promise.all(metadataRequests)
                const metadata = metadataResponses.reduce((allItems, md) => {
                    return { ...allItems, ...md.metadata.metaData.items }
                }, {})

                // OrgUnit tree requires path, which is missing in analytics response
                const ousToLookUp = exchange.source.requests.reduce(
                    (ouSet, { ou: ouDimension }) => {
                        for (const orgUnit of ouDimension) {
                            if (
                                !orgUnit.startsWith(ouLevelPrefix) &&
                                !orgUnit.startsWith(ouGroupPrefix)
                            ) {
                                ouSet.add(orgUnit)
                            }
                        }
                        return ouSet
                    },
                    new Set()
                )

                // also add additional information for periods to avoid looking up later
                const { organisationUnits: orgUnitDetails } =
                    await engine.query(ORG_UNITS_QUERY, {
                        variables: { ids: [...ousToLookUp] },
                    })

                const ouMap = orgUnitDetails.organisationUnits.reduce(
                    (orgUnitsMap, orgUnit) => {
                        orgUnitsMap.set(orgUnit.id, orgUnit)
                        return orgUnitsMap
                    },
                    new Map()
                )

                // get visualizations information

                const visualizationsToLookUp = new Set(
                    exchange.source.requests.map(
                        ({ visualization }) => visualization
                    )
                )
                const { visualizations: visualizationsDetails } =
                    await engine.query(VISUALIZATIONS_QUERY, {
                        variables: { ids: [...visualizationsToLookUp] },
                    })
                const visualizationsMap =
                    visualizationsDetails.visualizations.reduce(
                        (visMap, visualization) => {
                            visMap.set(visualization.id, visualization)
                            return visMap
                        },
                        new Map()
                    )

                exchange.source.requests = exchange.source.requests.map(
                    (request) => ({
                        ...request,
                        dxInfo: request.dx.map((id) => ({
                            id,
                            ...metadata[id],
                        })),
                        peInfo: request.pe.map((id) => ({
                            id,
                            ...metadata[id],
                        })),
                        ouInfo: request.ou.map((id) => ({
                            id,
                            ...metadata[id],
                            ...ouMap.get(id),
                        })),
                        filtersInfo: request.filters.map((filter) => ({
                            ...filter,
                            items: filter.items.map((id) => ({ id })),
                        })),
                        visualizationInfo: request.visualization
                            ? visualizationsMap.get(request.visualization)
                            : null,
                    })
                )

                setData(exchange)
            } catch (e) {
                console.error(e)
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [engine]
    )
    return { loading, data, error, refetch }
}
