import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    AccessWarning,
    ExchangeForm,
    Loader,
    useFetchExchange,
} from '../components/index'
import { useUserContext } from '../context/index'

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
        return <AccessWarning editMode={true} />
    }

    if (data) {
        return <ExchangeForm exchangeInfo={data} />
    }

    return null
}
