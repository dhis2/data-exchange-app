import { useDataEngine } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import moment from 'moment'
import { useEffect, useReducer, useState } from 'react'
import type { AggregateDataExchange, Error } from '../../../types/generated'

const getMutation = ({ id }) => ({
    resource: `aggregateDataExchanges/${id}/exchange`,
    type: 'create',
})

const uncalledState = {
    data: null,
    error: null,
    loading: false,
    called: false,
    dataSubmitted: null,
}

const submitReducer = (state, action) => {
    switch (action.type) {
        case 'loading':
            return { ...uncalledState, loading: true }
        case 'success':
            return {
                data: action.payload,
                error: null,
                loading: false,
                called: true,
                dataSubmitted: moment().format(),
            }
        case 'error':
            return {
                data: null,
                error: action.payload,
                loading: false,
                called: false,
                dataSubmitted: null,
            }
        case 'reset':
            return { ...uncalledState }
        default:
            return { ...uncalledState, called: true }
    }
}

type SubmissionStateType = {
    loading: boolean
    data: AggregateDataExchange
    error: Error
    called: boolean
    dataSubmitted: string
}
type UseAggregateDataExchangeMutationType = ({
    id,
}: {
    id: string
}) => [() => void, SubmissionStateType]

export const useAggregateDataExchangeMutation: UseAggregateDataExchangeMutationType =
    ({ id }) => {
        const engine = useDataEngine()

        const [submissionState, dispatch] = useReducer(
            submitReducer,
            uncalledState
        )
        const [fetch, setFetch] = useState(false)

        useEffect(() => {
            const fetchData = async ({ id }) => {
                if (fetch) {
                    dispatch({ type: 'loading' })
                    try {
                        const response = await engine.mutate(
                            getMutation({ id }) as any
                        )
                        const internalResponse = response?.response ?? response
                        if (internalResponse?.status === 'ERROR') {
                            const errorMessage =
                                internalResponse?.importSummaries.find(
                                    ({ status }) => status === 'ERROR'
                                )?.description || i18n.t('Unknown error')
                            throw new Error(errorMessage)
                        }
                        setFetch(false)
                        dispatch({ type: 'success', payload: response })
                    } catch (error) {
                        setFetch(false)
                        dispatch({ type: 'error', payload: error })
                    }
                }
            }
            fetchData({ id })
        }, [id, fetch, engine])

        // clean up if id changes
        useEffect(() => {
            return () => {
                dispatch({ type: 'reset' })
            }
        }, [id])

        const refetch = () => {
            setFetch(true)
        }

        return [refetch, submissionState]
    }
