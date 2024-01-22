import i18n from '@dhis2/d2-i18n'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { EditExchange } from '../components/edit/exchange-update/index.js'
import { Loader, Warning } from '../components/shared/index.js'
import { useUserContext } from '../context/index.js'
import { useFetchExchange } from '../hooks/useFetchExchange.js'

export const EditItem = () => {
    const { exchangeID } = useParams()
    const { data, error, loading, refetch } = useFetchExchange()
    const { canAddExchange } = useUserContext()
    useEffect(() => {
        refetch({ id: exchangeID })
    }, [exchangeID, refetch])

    if (loading) {
        return <Loader />
    }

    if (!canAddExchange || error) {
        return (
            <Warning error={true} title={i18n.t('Not available')}>
                <span>
                    {i18n.t(
                        'The exchange you requested does not exist or you cannot edit it.'
                    )}
                </span>
            </Warning>
        )
    }

    if (data) {
        return <EditExchange exchangeInfo={data} />
    }

    return null
}
