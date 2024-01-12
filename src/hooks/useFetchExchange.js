import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { getPeriodDetails } from '../utils/periods.js'

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

export const useFetchExchange = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({ id }) => {
            // set to loading
            try {
                const { exchange } = await engine.query(EXCHANGE_QUERY, {
                    variables: { id },
                })

                // once we have exchange need to populate orgUnit information
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

                exchange.source.requests = exchange.source.requests.map(
                    (request) => ({
                        ...request,
                        peInfo: request.pe.map((id) => getPeriodDetails(id)),
                        ouInfo: request.ou.map((id) => {
                            if (
                                id.startsWith(ouLevelPrefix) ||
                                id.startsWith(ouGroupPrefix)
                            ) {
                                return { id }
                            }
                            return ouMap.get(id)
                        }),
                        filtersInfo: request.filters.map((filter) => ({
                            ...filter,
                            items: filter.items.map((id) => ({ id })),
                        })),
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
