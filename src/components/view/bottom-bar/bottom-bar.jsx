import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useAppContext, useExchangeContext } from '../../../context/index.js'
import { useExchangeId } from '../../../use-context-selection/index.js'
import { ButtonWithTooltip } from '../../common/button-with-tooltip/index.js'

const BottomBar = ({ openSubmitModal, dataSubmitted }) => {
    const [exchangeId] = useExchangeId()
    const { aggregateDataExchanges } = useAppContext()
    const { exchangeData } = useExchangeContext()
    const disableSubmit =
        aggregateDataExchanges.find((ade) => ade?.id === exchangeId)?.access
            ?.data?.write === false

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
            <Button primary onClick={openSubmitModal} disabled={disableSubmit}>
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
