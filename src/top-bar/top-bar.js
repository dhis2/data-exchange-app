import { SelectorBar } from '@dhis2/ui'
import React from 'react'
import { ExchangeSelect } from './exchange-select/index.js'

const TopBar = () => (
    <SelectorBar>
        <ExchangeSelect />
    </SelectorBar>
)

export { TopBar }
