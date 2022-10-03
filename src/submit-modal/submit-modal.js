import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader,
    IconCheckmarkCircle24,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeContext } from '../exchange-context/index.js'
import { Warning } from '../shared/index.js'
import styles from './submit-modal.module.css'

// cannot current pass id to 'create' mutation or interpolate id
export const create_mutation = ({ id }) => ({
    resource: `aggregateDataExchanges/${id}/exchange`,
    type: 'create',
})

const LoadingStateModalContent = () => (
    <>
        <ModalContent>
            <CenteredContent>
                <div className={styles.loadingWrapper}>
                    <CircularLoader small />
                    <span>{i18n.t('Submitting...')}</span>
                </div>
            </CenteredContent>
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
            <Warning
                error={true}
                title={i18n.t('There was a problem submitting data')}
                message={error.message}
            />
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
            <Tag positive icon={<IconCheckmarkCircle24 />}>
                {i18n.t('Data submitted successfully')}
            </Tag>
            {data.importSummaries.map((importSummary) => (
                <p key={importSummary.description}>
                    {JSON.stringify(importSummary.importCount)}
                </p>
            ))}
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

const ConfirmModalContent = ({ exchange, onClose, onSubmit }) => {
    const requests = exchange?.source?.requests

    return (
        <>
            <ModalContent>
                <div className={styles.submitModalSummaryWrapper}>
                    {i18n.t(
                        `This action submits data for the ${requests.length} reports of ${exchange?.displayName}`
                    )}
                    <ul>
                        {requests.map((request) => {
                            return (
                                <li key={request.name}>{`${
                                    request.name
                                } , organisation units: ${
                                    request?.ou?.length
                                } , periods: ${request.pe.join(', ')} `}</li>
                            )
                        })}
                    </ul>
                </div>
                <div>
                    {i18n.t('Are you sure you want to submit this data?')}
                </div>
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
    onClose: PropTypes.func,
    onSubmit: PropTypes.func,
}

const SubmitModal = ({ open, onClose }) => {
    const { exchange } = useExchangeContext()
    const [submitExchange, { called, loading, error, data }] = useDataMutation(
        create_mutation({ id: exchange.id })
    )

    return (
        <Modal
            hide={!open}
            medium
            position="middle"
            onClose={loading ? null : onClose}
        >
            <ModalTitle>{i18n.t('Submitting data')}</ModalTitle>
            {!called && (
                <ConfirmModalContent
                    exchange={exchange}
                    onClose={onClose}
                    onSubmit={submitExchange}
                />
            )}
            {error && (
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
    onClose: PropTypes.func,
}

export { SubmitModal }
