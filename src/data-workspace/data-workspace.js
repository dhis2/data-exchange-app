import { CenteredContent } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useAppContext } from '../app-context/index.js'
import { useExchangeContext } from '../exchange-context/index.js'
import {
    useExchangeId,
    useRequestName,
} from '../use-context-selection/index.js'
import { Display } from './display/index.js'
import { RequestsNavigation } from './requests-navigation/index.js'
import { TitleBar } from './title-bar/title-bar.js'

const DataWorkspace = () => {
    const { aggregateDataExchanges } = useAppContext()
    const { exchange } = useExchangeContext()
    const [exchangeId] = useExchangeId()

    // to replace with appropriate hook for parameters
    const [selectedRequest, setSelectedRequest] = useRequestName()

    useEffect(() => {
        // auto select the first?
        if (!selectedRequest) {
            setSelectedRequest(exchange?.source?.requests?.[0]?.name)
        }
    }, [exchange, selectedRequest, setSelectedRequest])

    if (aggregateDataExchanges.length === 0) {
        return (
            <CenteredContent>
                <span>There are no exchanges available to you</span>
            </CenteredContent>
        )
    }

    if (exchange && exchangeId) {
        return (
            <>
                <TitleBar />
                <RequestsNavigation
                    requests={exchange?.source?.requests.map((request) => ({
                        name: request.name,
                    }))}
                    selected={selectedRequest}
                    onChange={setSelectedRequest}
                />
                <Display requestName={selectedRequest} />
            </>
        )
    }

    return (
        <CenteredContent>
            <span>Choose an exchange to get started</span>
        </CenteredContent>
    )
}

export { DataWorkspace }
