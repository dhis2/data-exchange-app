import i18n from '@dhis2/d2-i18n'
import { Button, ButtonStrip, SelectorBar } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { useUserContext } from '../../../context/index.js'
import {
    useClearEntireSelection,
    useExchangeId,
} from '../../../use-context-selection/index.js'
import { ExchangeSelect } from './exchange-select/index.js'
import styles from './top-bar.module.css'

const LinKToEditMode = ({ setShowPreview }) => {
    const { canAddExchange, canDeleteExchange } = useUserContext()
    const [exchangeId] = useExchangeId()

    if (!canAddExchange && !canDeleteExchange) {
        return null
    }

    return (
        <div className={styles.additionalContentContainer}>
            <ButtonStrip>
                <Button
                    small
                    primary
                    disabled={!exchangeId}
                    onClick={() => setShowPreview(true)}
                >
                    {i18n.t('Preview')}
                </Button>
                <Link to="/edit">
                    <Button small>{i18n.t('Configurations')}</Button>
                </Link>
            </ButtonStrip>
        </div>
    )
}

LinKToEditMode.propTypes = {
    setShowPreview: PropTypes.func.isRequired,
}

const TopBar = ({ setShowPreview }) => {
    const clearExchangeId = useClearEntireSelection()

    const clearSelection = () => {
        clearExchangeId()
        setShowPreview(false)
    }

    return (
        <SelectorBar
            onClearSelectionClick={clearSelection}
            additionalContent={
                <LinKToEditMode setShowPreview={setShowPreview} />
            }
        >
            <ExchangeSelect setShowPreview={setShowPreview} />
        </SelectorBar>
    )
}

TopBar.propTypes = {
    setShowPreview: PropTypes.func.isRequired,
}

export { TopBar }
