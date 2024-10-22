import React from 'react'
import {
    AccessWarning,
    ExchangeForm,
    EXCHANGE_TYPES,
} from '../components/index.js'
import { useUserContext } from '../context/index.js'

const defaultExchange = {
    source: { requests: [] },
    target: { type: EXCHANGE_TYPES.internal },
}

export const AddItem = () => {
    const { canAddExchange } = useUserContext()
    if (!canAddExchange) {
        return <AccessWarning />
    }
    return <ExchangeForm exchangeInfo={defaultExchange} addMode={true} />
}
