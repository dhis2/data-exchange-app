import i18n from '@dhis2/d2-i18n'
import { SelectorBarItem } from '@dhis2/ui'
import React, { useState } from 'react'
import { useAppContext } from '../../app-context/index.js'
import { MenuSelect } from '../menu-select/index.js'

const ExchangeSelect = () => {
    const { aggregateDataExchanges } = useAppContext()
    const [exchangeSelectorOpen, setExchangeSelectorOpen] = useState(false)
    const dataExchangeOptions = aggregateDataExchanges.map((exchange) => ({
        value: exchange.id,
        label: exchange.displayName,
    }))

    return (
        <div data-test="data-set-selector">
            <SelectorBarItem
                label={i18n.t('Exchange')}
                value={undefined}
                open={exchangeSelectorOpen}
                setOpen={setExchangeSelectorOpen}
                noValueMessage={i18n.t('Choose a data exchange')}
            >
                <div data-test="data-exchange-selector-contents">
                    <MenuSelect
                        values={dataExchangeOptions}
                        selected={null}
                        dataTest="exchange-selector-menu"
                        onChange={(selected) => {
                            console.log(selected)
                        }}
                    />
                </div>
            </SelectorBarItem>
        </div>
    )
}

export { ExchangeSelect }
