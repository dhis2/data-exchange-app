import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Loader } from '../components/common/index.js'
import {
    EditExchange,
    useFetchExchange,
} from '../components/edit/exchange-update/index.js'
import { AccessWarning } from '../components/edit/shared/index.js'
import { useUserContext } from '../context/index.js'

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
        return <EditExchange exchangeInfo={data} />
    }

    return null
}
