import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { useAppContext } from '../../app-context/index.js'
import { useExchangeId } from '../../use-context-selection/use-context-selections.js'
import { MenuSelect } from '../menu-select/index.js'

const ExchangeSelect = () => {
    const { aggregateDataExchanges } = useAppContext()
    const [exchangeId, setExchangeId] = useExchangeId()
    const [exchangeSelectorOpen, setExchangeSelectorOpen] = useState(false)

    const dataExchangeOptions = aggregateDataExchanges.map((exchange) => ({
        value: exchange.id,
        label: exchange.displayName,
    }))

    return (
        <div data-test="data-exchange-selector">
            <SelectorBarItem
                label={i18n.t('Data exchange')}
                value={
                    dataExchangeOptions.find(
                        (dExchange) => dExchange.value === exchangeId
                    )?.label
                }
                open={exchangeSelectorOpen}
                setOpen={setExchangeSelectorOpen}
                noValueMessage={i18n.t('Choose a data exchange')}
            >
                <div data-test="data-exchange-selector-contents">
                    <MenuSelect
                        values={dataExchangeOptions}
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
