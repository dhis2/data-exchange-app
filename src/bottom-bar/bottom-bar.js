import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeContext } from '../exchange-context/index.js'
import { ButtonWithTooltip } from '../shared/button-with-tooltip/index.js'
import { useExchangeId } from '../use-context-selection/index.js'

const BottomBar = ({ openSubmitModal, dataSubmitted }) => {
    const [exchangeId] = useExchangeId()
    const { exchangeData } = useExchangeContext()

    const dataCount = exchangeData?.reduce(
        (totalLength, request) => (request?.rows?.length || 0) + totalLength,
        0
    )

    const submitButtonText = i18n.t('Submit data')

    if (!exchangeId || !exchangeData) {
        return null
    }

    if (dataCount === 0 || dataSubmitted) {
        const tooltipContent = dataSubmitted
            ? i18n.t('Data has already been submitted')
            : i18n.t('There is no data to submit')
        return (
            <ButtonWithTooltip
                buttonText={submitButtonText}
                tooltipContent={tooltipContent}
            />
        )
    }

    return (
        <div data-test="bottom-bar">
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
