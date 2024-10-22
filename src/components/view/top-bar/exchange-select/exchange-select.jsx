import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { useAppContext } from '../../../../context/app-context/index.js'
import { useExchangeId } from '../../../../use-context-selection/use-context-selections.js'
import { MenuSelect } from '../menu-select/index.js'

const ExchangeSelect = () => {
    const { readableExchangeOptions } = useAppContext()
    const [exchangeId, setExchangeId] = useExchangeId()
    const [exchangeSelectorOpen, setExchangeSelectorOpen] = useState(false)

    return (
        <div data-test="data-exchange-selector">
            <SelectorBarItem
                label={i18n.t('Data exchange')}
                value={
                    readableExchangeOptions.find(
                        (dExchange) => dExchange.value === exchangeId
                    )?.label
                }
                open={exchangeSelectorOpen}
                setOpen={setExchangeSelectorOpen}
                noValueMessage={i18n.t('Choose a data exchange')}
            >
                <div data-test="data-exchange-selector-contents">
                    <MenuSelect
                        values={readableExchangeOptions}
                        selected={exchangeId}
                        dataTest="exchange-selector-menu"
                        onChange={({ selected }) => {
                            setExchangeId(selected)
                            setExchangeSelectorOpen(false)
                        }}
                    />
                </div>
            </SelectorBarItem>
        </div>
    )
}

export { ExchangeSelect }
