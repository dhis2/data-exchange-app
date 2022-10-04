import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import {
    useClearEntireSelection,
    useExchangeId,
} from '../../use-context-selection/index.js'
import classes from './clear-all-button.module.css'

const ClearAllButton = () => {
    const [exchangeId] = useExchangeId()
    const clearAll = useClearEntireSelection()

    return exchangeId ? (
        <Button small className={classes.button} secondary onClick={clearAll}>
            {i18n.t('Clear selection')}
        </Button>
    ) : null
}

export { ClearAllButton }
