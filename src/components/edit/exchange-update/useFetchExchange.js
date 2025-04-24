import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import {
    SCHEME_TYPES,
    OU_GROUP_PREFIX,
    OU_LEVEL_PREFIX,
} from '../shared/index.js'
import {
    getMetadataWithCode,
    getFilterCodeMap,
    getOuLevelMap,
} from './codeDetailsHelpers.js'

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
        params: ({ ou, dx, pe, inputIdScheme }) => ({
            dimension: `dx:${dx.join(';')},ou:${ou.join(';')},pe:${pe.join(
                ';'
            )}`,
            skipMeta: false,
            skipData: true,
            includeMetadataDetails: true,
            inputIdScheme,
        }),
    },
}

const CHUNK_SIZE = 50

const getChunkedAnalyticsQueries = ({ engine, variables, index }) => {
    const { ou, dx, pe } = variables

    const chunks = []
    for (const variableType of ['ou', 'dx', 'pe']) {
        for (let i = 0; i < variables[variableType].length; i += CHUNK_SIZE) {
            chunks.push({
                dx: [dx[0]],
                ou: [ou[0]],
                pe: [pe[0]],
                [variableType]: variables[variableType].slice(
                    i,
                    i + CHUNK_SIZE
                ),
            })
        }
    }

    return chunks.map((chunk) => ({
        request: engine.query(ANALYTICS_QUERY, {
            variables: chunk,
        }),
        index,
    }))
}

const getMetadataByRequest = ({ engine, variables, index }) => {
    if (
        variables.ou.length + variables.pe.length + variables.dx.length >
        CHUNK_SIZE
    ) {
        return getChunkedAnalyticsQueries({ engine, variables, index })
    }
    return [
        {
            request: engine.query(ANALYTICS_QUERY, {
                variables,
            }),
            index,
        },
    ]
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
                const metadataRequests = exchange.source.requests
                    .map(({ ou, dx, pe, inputIdScheme = 'UID' }, index) => {
                        return getMetadataByRequest({
                            engine,
                            variables: { ou, dx, pe, inputIdScheme },
                            index,
                        })
                    })
                    .flat()

                const metadataResponses = await Promise.all(
                    metadataRequests.map(({ request }) => request)
                )
                const metadata = metadataResponses.reduce(
                    (allItems, md, index) => {
                        // if the inputIdScheme is 'code', we need to remap the items from id to code
                        const originalIndex = metadataRequests[index].index
                        const inputIdScheme =
                            exchange.source.requests[originalIndex]
                                ?.inputIdScheme ?? SCHEME_TYPES.uid
                        let currentItems = {}
                        if (inputIdScheme === SCHEME_TYPES.code) {
                            currentItems = getMetadataWithCode({
                                originalCurrentItems:
                                    md.metadata.metaData.items,
                                request:
                                    exchange.source.requests[originalIndex],
                                md,
                            })
                        } else {
                            currentItems = md.metadata.metaData.items
                            // uid for data sets and event data items does not correspond to the format required for dx item, so add these back from key
                            // this is handled (slightly differently) in getMetadataWithCode
                            for (const cKey in currentItems) {
                                currentItems[cKey].id = cKey
                            }
                        }
                        return { ...allItems, ...currentItems }
                    },
                    {}
                )

                // OrgUnit tree requires path, which is missing in analytics response
                const ousToLookUp = exchange.source.requests.reduce(
                    (ouSet, { ou: ouDimension }) => {
                        for (const orgUnit of ouDimension) {
                            if (
                                !orgUnit.startsWith(OU_LEVEL_PREFIX) &&
                                !orgUnit.startsWith(OU_GROUP_PREFIX)
                            ) {
                                // we get uid from metadata in case inputIdScheme:code
                                ouSet.add(metadata[orgUnit].uid)
                            }
                        }
                        return ouSet
                    },
                    new Set()
                )

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

                // if there are any requests with inputIdScheme:code,
                // lock up filter codes and ou levels
                const hasCodeIdScheme = exchange.source.requests
                    .map(({ inputIdScheme }) => inputIdScheme)
                    .includes('CODE')
                const filterCodeMap = hasCodeIdScheme
                    ? await getFilterCodeMap({ engine })
                    : new Map()
                const ouLevelMap = hasCodeIdScheme
                    ? await getOuLevelMap({ engine, exchange })
                    : new Map()

                exchange.source.requests = exchange.source.requests.map(
                    (request) => {
                        const { inputIdScheme = SCHEME_TYPES.uid } = request
                        return {
                            ...request,
                            dxInfo: request.dx.map((identifier) => ({
                                id: metadata[identifier]?.id ?? identifier,
                                ...metadata[identifier],
                            })),
                            peInfo: request.pe.map((id) => ({
                                id: metadata[id].uid ?? id,
                                ...metadata[id],
                            })),
                            ouInfo: request.ou.map((identifier) => {
                                if (inputIdScheme === SCHEME_TYPES.code) {
                                    if (
                                        identifier.startsWith(OU_LEVEL_PREFIX)
                                    ) {
                                        return {
                                            id: `${OU_LEVEL_PREFIX}${ouLevelMap.get(
                                                identifier.split(
                                                    OU_LEVEL_PREFIX
                                                )[1]
                                            )}`,
                                        }
                                    }
                                    if (
                                        identifier.startsWith(OU_GROUP_PREFIX)
                                    ) {
                                        return {
                                            id: `${OU_GROUP_PREFIX}${
                                                metadata[
                                                    identifier.split(
                                                        OU_GROUP_PREFIX
                                                    )[1]
                                                ]?.uid
                                            }`,
                                        }
                                    }
                                }
                                return {
                                    id: metadata[identifier]?.uid ?? identifier,
                                    ...metadata[identifier],
                                    ...ouMap.get(metadata[identifier]?.uid),
                                }
                            }),
                            filtersInfo: request.filters.map((filter) => ({
                                dimension:
                                    inputIdScheme === SCHEME_TYPES.code
                                        ? filterCodeMap.get(filter.dimension)
                                        : filter.dimension,
                                items: filter.items.map((identifier) => ({
                                    id:
                                        inputIdScheme === SCHEME_TYPES.code
                                            ? filterCodeMap.get(identifier)
                                            : identifier,
                                })),
                            })),
                            visualizationInfo: request.visualization
                                ? visualizationsMap.get(request.visualization)
                                : null,
                        }
                    }
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
