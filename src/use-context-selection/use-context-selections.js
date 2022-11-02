import { useCallback } from 'react'
import {
    StringParam,
    NumberParam,
    useQueryParams,
    useQueryParam,
} from 'use-query-params'

export const PARAMS_SCHEMA = {
    exchangeId: StringParam,
    requestIndex: NumberParam,
}

export const useExchangeId = () => {
    return useQueryParam('exchangeId', PARAMS_SCHEMA.exchangeId)
}
export const useRequestIndex = () => {
    return useQueryParam('requestIndex', PARAMS_SCHEMA.requestIndex)
}

export const useContextSelection = () => {
    return useQueryParams(PARAMS_SCHEMA)
}

export const useClearEntireSelection = () => {
    const [, setSelectionContext] = useContextSelection()

    return useCallback(() => {
        setSelectionContext({
            exchangeId: undefined,
            requestIndex: undefined,
        })
    }, [setSelectionContext])
}
