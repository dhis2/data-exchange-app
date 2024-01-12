import i18n from '@dhis2/d2-i18n'
import { NoticeBox } from '@dhis2/ui'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditExchange } from '../components/edit/exchange-update/index.js'
import { useFetchExchange } from '../hooks/useFetchExchange.js'

export const EditItem = () => {
    const { exchangeID } = useParams()
    const { data, error, loading, refetch } = useFetchExchange()
    useEffect(() => {
        refetch({ id: exchangeID })
    }, [exchangeID, refetch])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return (
            <NoticeBox error>
                {i18n.t(
                    'The exchange you requested does not exist or you do not have access to it'
                )}
            </NoticeBox>
        )
    }

    if (data) {
        return <EditExchange exchangeInfo={data} />
    }

    return null
}
