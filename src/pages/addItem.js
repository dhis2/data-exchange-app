import React from 'react'
import { EXCHANGE_TYPES } from '../components/edit/exchange-update/edit-exchange-form.js'
import { EditExchange } from '../components/edit/exchange-update/index.js'

const defaultExchange = {
    source: { requests: [] },
    target: { type: EXCHANGE_TYPES.internal },
}

export const AddItem = () => (
    <EditExchange exchangeInfo={defaultExchange} addMode={true} />
)
