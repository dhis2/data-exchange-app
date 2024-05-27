import React from 'react'
import {
    AccessWarning,
    ExchangeForm,
    EXCHANGE_TYPES,
} from '../components/index'
import { useUserContext } from '../context/index'

const defaultExchange = {
    source: { requests: [] },
    target: { type: EXCHANGE_TYPES.internal },
}

export const AddItem = () => {
    const { canAddExchange } = useUserContext()
    if (!canAddExchange) {
        ;<AccessWarning />
    }
    return <ExchangeForm exchangeInfo={defaultExchange} addMode={true} />
}
