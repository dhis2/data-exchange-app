import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeId } from '../../../use-context-selection/index.js'
import { ButtonWithTooltip } from '../../common/button-with-tooltip/index.js'

const BottomBar = ({ openSubmitModal, dataSubmitted }) => {
    const [exchangeId] = useExchangeId()

    const submitButtonText = i18n.t('Submit data')

    if (!exchangeId) {
        return null
    }

    if (dataSubmitted) {
        const tooltipContent = i18n.t('Data has already been submitted')
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
    dataSubmitted: PropTypes.string,
    openSubmitModal: PropTypes.func,
}
export { BottomBar }
