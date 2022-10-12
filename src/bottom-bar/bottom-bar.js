import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeContext } from '../exchange-context/index.js'
import { useExchangeId } from '../use-context-selection/index.js'
import styles from './bottom-bar.module.css'

const BottomBar = ({ openSubmitModal, dataSubmitted }) => {
    const [exchangeId] = useExchangeId()
    const { exchangeData } = useExchangeContext()

    const dataCount = exchangeData?.reduce(
        (totalLength, request) => (request?.rows?.length || 0) + totalLength,
        0
    )

    const submitButtonText = i18n.t('Submit data')

    if (!exchangeId) {
        return null
    }

    if (dataCount === 0 || dataSubmitted) {
        return (
            <div className={styles.bottomBar} data-test="bottom-bar">
                <Tooltip
                    content={
                        dataSubmitted
                            ? i18n.t('Data has already been submitted')
                            : i18n.t('There is no data to submit')
                    }
                >
                    {({ ref, onMouseOver, onMouseOut }) => (
                        <span
                            className={styles.tooltipReference}
                            ref={ref}
                            onMouseOver={onMouseOver}
                            onMouseOut={onMouseOut}
                        >
                            <Button primary disabled>
                                {submitButtonText}
                            </Button>
                        </span>
                    )}
                </Tooltip>
            </div>
        )
    }

    return (
        <div className={styles.bottomBar} data-test="bottom-bar">
            <Button primary onClick={openSubmitModal}>
                {submitButtonText}
            </Button>
        </div>
    )
}

BottomBar.propTypes = {
    dataSubmitted: PropTypes.bool,
    openSubmitModal: PropTypes.func,
}
export { BottomBar }
