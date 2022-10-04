import { SelectorBar } from '@dhis2/ui'
import React from 'react'
import { useClearEntireSelection } from '../use-context-selection/index.js'
import { ExchangeSelect } from './exchange-select/index.js'

const TopBar = () => {
    const clearSelections = useClearEntireSelection()

    return (
        <SelectorBar onClearSelectionClick={clearSelections}>
            <ExchangeSelect />
        </SelectorBar>
    )
}

export { TopBar }
