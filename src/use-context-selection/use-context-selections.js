import { useCallback } from 'react'
import { StringParam, useQueryParams, useQueryParam } from 'use-query-params'

export const PARAMS_SCHEMA = {
    exchangeId: StringParam,
    requestName: StringParam,
}

export const useExchangeId = () => {
    return useQueryParam('exchangeId', PARAMS_SCHEMA.exchangeId)
}
export const useRequestName = () => {
    return useQueryParam('requestName', PARAMS_SCHEMA.requestName)
}

export const useContextSelection = () => {
    return useQueryParams(PARAMS_SCHEMA)
}

export const useClearEntireSelection = () => {
    const [, setSelectionContext] = useContextSelection()

    return useCallback(() => {
        setSelectionContext({
            exchangeId: undefined,
            requestName: undefined,
        })
    }, [setSelectionContext])
}
