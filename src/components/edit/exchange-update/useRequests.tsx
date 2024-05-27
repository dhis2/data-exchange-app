import { useCallback, useReducer, useState } from 'react'
import { requestsReducer } from '../request-update/index'

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

    const [requestsTouched, setRequestsTouched] = useState(false)

    const deleteRequest = useCallback((index) => {
        setRequestsTouched(true)
        requestsDispatch({ type: 'DELETE', index })
    }, [])

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
