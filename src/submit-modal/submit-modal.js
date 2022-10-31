import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useExchangeContext } from '../exchange-context/index.js'
import { Warning } from '../shared/index.js'
import styles from './submit-modal.module.css'
import { SuccessContent } from './success-content.js'
import { useAggregateDataExchangeMutation } from './use-aggregate-data-exchange-mutation.js'

const LoadingStateModalContent = () => (
    <>
        <ModalContent>
            <ModalContentWrapper>
                <CenteredContent>
                    <div className={styles.loadingWrapper}>
                        <CircularLoader small />
                        <span>{i18n.t('Submitting...')}</span>
                    </div>
                </CenteredContent>
            </ModalContentWrapper>
        </ModalContent>

        <ModalActions>
            <ButtonStrip end>
                <Button disabled>{i18n.t('No, cancel')}</Button>
                <Button primary disabled>
                    {i18n.t('Yes, submit')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </>
)

const ErrorModalContent = ({ error, onRetry, onClose }) => (
    <>
        <ModalContent>
            <ModalContentWrapper>
                <Warning
                    error={true}
                    title={i18n.t('There was a problem submitting data')}
                >
                    <span>{error.message}</span>
                </Warning>
            </ModalContentWrapper>
        </ModalContent>

        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onClose}>{i18n.t('Close')}</Button>
                <Button primary onClick={onRetry}>
                    {i18n.t('Try again')}
                </Button>
            </ButtonStrip>
        </ModalActions>
    </>
)

ErrorModalContent.propTypes = {
    error: PropTypes.object,
    onClose: PropTypes.func,
    onRetry: PropTypes.func,
}

const SuccessModalContent = ({ onClose, data }) => (
    <>
        <ModalContent>
            <ModalContentWrapper>
                <SuccessContent data={data} />
            </ModalContentWrapper>
        </ModalContent>

        <ModalActions>
            <ButtonStrip end>
                <Button onClick={onClose}>{i18n.t('Close')}</Button>
            </ButtonStrip>
        </ModalActions>
    </>
)

SuccessModalContent.propTypes = {
    data: PropTypes.object,
    onClose: PropTypes.func,
}

const getReportText = (request) => {
    const { name, orgUnits, periods } = request
    const orgUnitText =
        orgUnits.length === 1
            ? i18n.t('{{orgUnitCount}} organisation unit', {
                  orgUnitCount: orgUnits.length,
              })
            : i18n.t('{{orgUnitCount}} organisation units', {
                  orgUnitCount: orgUnits.length,
              })
    let periodsText = ''
    if (periods.length === 1) {
        periodsText = i18n.t('{{periodsCount}} period: {{periods}}', {
            periodsCount: periods.length,
            periods: periods[0],
            nsSeparator: '-:-',
        })
    }
    if (periods.length > 1 && periods.length <= 3) {
        periodsText = i18n.t('{{periodsCount}} periods: {{periods}}', {
            periodsCount: periods.length,
            periods: periods.join(', '),
            nsSeparator: '-:-',
        })
    }
    if (periods.length > 3) {
        periodsText = i18n.t(
            '3+ periods: {{periods}}, and {{periodsCountLessThree}} more',
            {
                periodsCount: periods.length,
                periods: periods.slice(0, 3).join(', '),
                periodsCountLessThree: periods.length - 3,
                nsSeparator: '-:-',
            }
        )
    }
    return `${name}, ${orgUnitText}, ${periodsText}`
}

const ConfirmModalContent = ({ exchange, requests, onClose, onSubmit }) => {
    // this is very wordy, but did not have luck with i18nextscanner picking up from more compact versions...
    let reportTranslationsString
    const { baseUrl } = useConfig()
    const reportCount = requests.length
    const exchangeName = exchange?.displayName
    const exchangeURL =
        exchange?.target?.type === 'INTERNAL'
            ? baseUrl
            : exchange?.target?.api?.url
    const exchangeHostName = exchangeURL?.split('//')[1] // remove protocol

    if (exchange?.target?.type === 'INTERNAL') {
        if (requests.length > 1) {
            reportTranslationsString = i18n.t(
                '{{reportCount}} reports to {{-exchangeName}} internally at {{-exchangeHostName}}',
                {
                    reportCount,
                    exchangeName,
                    exchangeHostName,
                }
            )
        } else {
            reportTranslationsString = i18n.t(
                '{{reportCount}} report to {{-exchangeName}} internally at {{-exchangeHostName}}',
                {
                    reportCount,
                    exchangeName,
                    exchangeHostName,
                }
            )
        }
    } else {
        if (requests.length > 1) {
            reportTranslationsString = i18n.t(
                '{{reportCount}} reports to {{-exchangeName}} at {{-exchangeHostName}}',
                {
                    reportCount,
                    exchangeName,
                    exchangeHostName,
                }
            )
        } else {
            reportTranslationsString = i18n.t(
                '{{reportCount}} report to {{-exchangeName}} at {{-exchangeHostName}}',
                {
                    reportCount,
                    exchangeName,
                    exchangeHostName,
                }
            )
        }
    }

    return (
        <>
            <ModalContent>
                <ModalContentWrapper>
                    <div className={styles.submitModalSummaryWrapper}>
                        {reportTranslationsString}
                        <ul>
                            {requests.map((request) => {
                                return (
                                    <li key={request.name}>
                                        {getReportText(request)}
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <div>
                        {i18n.t('Are you sure you want to submit this data?')}
                    </div>
                </ModalContentWrapper>
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button onClick={onClose}>{i18n.t('No, cancel')}</Button>
                    <Button primary onClick={onSubmit}>
                        {i18n.t('Yes, submit')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </>
    )
}

ConfirmModalContent.propTypes = {
    exchange: PropTypes.object,
    requests: PropTypes.array,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
}

const ModalContentWrapper = ({ children }) => (
    <div className={styles.contentStyling}>{children}</div>
)

ModalContentWrapper.propTypes = {
    children: PropTypes.node,
}

const SubmitModal = ({ open, onClose, setDataSubmitted }) => {
    const { exchange, exchangeData } = useExchangeContext()
    const [submitsAttempted, setSubmitsAttempted] = useState(false)

    const requests = exchangeData?.map((request, index) => ({
        name: exchange.source?.requests?.[index]?.name,
        orgUnits: request.metaData?.dimensions?.ou,
        periods: request.metaData?.dimensions?.pe.map(
            (period) => request.metaData?.items[period]?.name
        ),
    }))

    const [submitExchange, { called, data, error, loading, dataSubmitted }] =
        useAggregateDataExchangeMutation({ id: exchange?.id })

    // clean up whenever modal is closed
    useEffect(() => {
        if (!open) {
            setSubmitsAttempted(false)
        }
    }, [open])

    // update data submission status when there is a change
    useEffect(() => {
        setDataSubmitted(dataSubmitted)
    }, [dataSubmitted, setDataSubmitted])

    return !exchange ? null : (
        <Modal
            hide={!open}
            large
            position="middle"
            onClose={loading ? null : onClose}
        >
            <ModalTitle>{i18n.t('Submitting data')}</ModalTitle>
            {!called && !loading && !submitsAttempted && (
                <ConfirmModalContent
                    exchange={exchange}
                    requests={requests}
                    onClose={onClose}
                    onSubmit={() => {
                        setSubmitsAttempted(true)
                        submitExchange()
                    }}
                />
            )}
            {error && submitsAttempted && (
                <ErrorModalContent
                    error={error}
                    onRetry={submitExchange}
                    onClose={onClose}
                />
            )}
            {data && <SuccessModalContent data={data} onClose={onClose} />}
            {loading && <LoadingStateModalContent />}
        </Modal>
    )
}

SubmitModal.propTypes = {
    open: PropTypes.bool,
    setDataSubmitted: PropTypes.func,
    onClose: PropTypes.func,
}

export { SubmitModal }
