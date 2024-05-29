import i18n from '@dhis2/d2-i18n'
import { Center } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useAppContext, useExchangeContext } from '../../../context/index'
import {
    useExchangeId,
    useRequestIndex,
} from '../../../use-context-selection/index'
import { Warning } from '../../common/index'
import { EntryScreen } from './entry-screen'
import { RequestsDisplay } from './requests-display/index'
import { RequestsNavigation } from './requests-navigation/index'
import { TitleBar } from './title-bar/title-bar'

const DataWorkspace = () => {
    const { aggregateDataExchanges } = useAppContext()
    const { exchange } = useExchangeContext()
    const [exchangeId] = useExchangeId()
    // memoize for stable reference?
    const requests = exchange?.source?.requests.map((request) => ({
        name: request.name,
    }))

    const [selectedRequest, setSelectedRequest] = useRequestIndex(undefined)

    // auto select the first report if none is specified
    useEffect(() => {
        if (!exchangeId || !requests) {
            setSelectedRequest(undefined)
        }
        if (exchangeId && !selectedRequest && requests) {
            setSelectedRequest(0)
        }
    }, [exchangeId, requests, selectedRequest, setSelectedRequest])

    if (aggregateDataExchanges.length === 0) {
        return (
            <Center>
                <span>{i18n.t('There are no exchanges available to you')}</span>
            </Center>
        )
    }

    if (exchange && exchangeId) {
        return (
            <>
                <TitleBar />
                {!requests && (
                    <div>
                        <Warning
                            error={true}
                            title={i18n.t('No data in this exchange')}
                        >
                            <span>
                                {i18n.t(
                                    'There is not any data to show in this exchange, or you might not have access to the data.'
                                )}
                            </span>
                        </Warning>
                    </div>
                )}
                {!isNaN(selectedRequest) && (
                    <>
                        <RequestsNavigation
                            requests={requests}
                            selected={selectedRequest}
                            onChange={setSelectedRequest}
                        />
                        <RequestsDisplay requestIndex={selectedRequest} />
                    </>
                )}
            </>
        )
    }

    return <EntryScreen />
}

export { DataWorkspace }
