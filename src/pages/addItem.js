import React from 'react'
import { EditExchange } from '../components/edit/exchange-update/index.js'
import {
    EXCHANGE_TYPES,
    AccessWarning,
} from '../components/edit/shared/index.js'
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
