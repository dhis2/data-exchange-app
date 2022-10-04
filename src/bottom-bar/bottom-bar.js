import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeId } from '../use-context-selection/index.js'
import styles from './bottom-bar.module.css'

const BottomBar = ({ openSubmitModal }) => {
    const [exchangeId] = useExchangeId()

    return exchangeId ? (
        <div className={styles.bottomBar} data-test="bottom-bar">
            <Button primary onClick={openSubmitModal}>
                {i18n.t('Submit data')}
            </Button>
        </div>
    ) : null
}

BottomBar.propTypes = {
    openSubmitModal: PropTypes.func,
}
export { BottomBar }
