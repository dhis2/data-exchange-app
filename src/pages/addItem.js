import React from 'react'
import {
    AccessWarning,
    EditExchange,
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
        ;<AccessWarning />
    }
    return <EditExchange exchangeInfo={defaultExchange} addMode={true} />
}
