import i18n from '@dhis2/d2-i18n'
import { Button, SelectorBar } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { useClearEntireSelection } from '../../use-context-selection/index.js'
import { ExchangeSelect } from './exchange-select/index.js'
import styles from './top-bar.module.css'

const LinKToEditMode = () => (
    <div className={styles.additionalContentContainer}>
        <Link to="/edit">
            <Button small>{i18n.t('Configurations')}</Button>
        </Link>
    </div>
)

const TopBar = () => {
    const clearSelections = useClearEntireSelection()

    return (
        <SelectorBar
            onClearSelectionClick={clearSelections}
            additionalContent={<LinKToEditMode />}
        >
            <ExchangeSelect />
        </SelectorBar>
    )
}

export { TopBar }
