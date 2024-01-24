import { useCallback, useReducer, useState } from 'react'
import { requestsReducer } from '../request-update/index.js'

export const useRequests = ({ exchangeInfo }) => {
    const [requestEditInfo, setRequestEditInfo] = useState({
        editMode: false,
        request: null,
    })

    const setRequestEditMode = useCallback(
        (request, addModeRequest = false) => {
            setRequestEditInfo({ editMode: true, request, addModeRequest })
        },
        [setRequestEditInfo]
    )
    const exitRequestEditMode = useCallback(() => {
        setRequestEditInfo({ editMode: false, request: null })
    }, [setRequestEditInfo])

    const [requestsState, requestsDispatch] = useReducer(
        requestsReducer,
        exchangeInfo?.source?.requests ?? []
    )
    const deleteRequest = useCallback((index) => {
        requestsDispatch({ type: 'DELETE', index })
    }, [])

    const [requestsTouched, setRequestsTouched] = useState(false)

    return {
        requestEditInfo,
        setRequestEditMode,
        exitRequestEditMode,
        requestsState,
        requestsDispatch,
        deleteRequest,
        requestsTouched,
        setRequestsTouched,
    }
}
