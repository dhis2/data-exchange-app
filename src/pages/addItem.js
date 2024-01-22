import i18n from '@dhis2/d2-i18n'
import React from 'react'
import { EXCHANGE_TYPES } from '../components/edit/exchange-update/edit-exchange-form.js'
import { EditExchange } from '../components/edit/exchange-update/index.js'
import { Warning } from '../components/shared/index.js'
import { useUserContext } from '../context/index.js'

const defaultExchange = {
    source: { requests: [] },
    target: { type: EXCHANGE_TYPES.internal },
}

export const AddItem = () => {
    const { canAddExchange } = useUserContext()
    if (!canAddExchange) {
        return (
            <Warning error={true} title={i18n.t('Not available')}>
                <span>
                    {i18n.t(
                        'You do not have the relevant authorities to add a new exchange.'
                    )}
                </span>
            </Warning>
        )
    }
    return <EditExchange exchangeInfo={defaultExchange} addMode={true} />
}
