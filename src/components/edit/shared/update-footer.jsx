import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
    ReactFinalForm,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DiscardModal = ({ open, onClose, onCancelConfirm, objectName }) => {
    return (
        <Modal
            hide={!open}
            large
            position="middle"
            onClose={onClose}
            dataTest={`${objectName}-discard-modal`}
        >
            <ModalTitle>{i18n.t('Discard unsaved changes')}</ModalTitle>
            <ModalContent>
                <span>
                    {i18n.t(
                        'The {{objectName}} has unsaved changes. Leaving this page will discard these changes. Are you sure?',
                        { objectName }
                    )}
                </span>
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('No, go back')}
                    </Button>
                    <Button destructive onClick={onCancelConfirm}>
                        {i18n.t('Yes, discard changes')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DiscardModal.propTypes = {
    objectName: PropTypes.string,
    open: PropTypes.bool,
    onCancelConfirm: PropTypes.func,
    onClose: PropTypes.func,
}

export const EditItemFooter = ({ handleSubmit, requestsTouched }) => {
    const [discardModalOpen, setDiscardModalOpen] = useState(false)
    const navigate = useNavigate()
    const { useFormState } = ReactFinalForm
    const { dirty } = useFormState()
    const formDirty = dirty || requestsTouched
    const onClose = useCallback(() => {
        setDiscardModalOpen(false)
    }, [setDiscardModalOpen])
    const onCancelConfirm = useCallback(() => {
        navigate('/edit')
    }, [navigate])
    return (
        <>
            <ButtonStrip>
                <Button
                    type="submit"
                    primary
                    onClick={() => {
                        handleSubmit()
                    }}
                >
                    {i18n.t('Save exchange')}
                </Button>
                <Button
                    onClick={() => {
                        !formDirty
                            ? onCancelConfirm()
                            : setDiscardModalOpen(true)
                    }}
                >
                    {i18n.t('Cancel')}
                </Button>
            </ButtonStrip>
            <DiscardModal
                open={discardModalOpen}
                onClose={onClose}
                objectName="exchange"
                onCancelConfirm={onCancelConfirm}
            />
        </>
    )
}

EditItemFooter.propTypes = {
    handleSubmit: PropTypes.func,
    requestsTouched: PropTypes.bool,
}

export const EditRequestFooter = ({
    exitRequestEditMode,
    handleRequestSubmit,
}) => {
    const [discardModalOpen, setDiscardModalOpen] = useState(false)
    const onClose = useCallback(() => {
        setDiscardModalOpen(false)
    }, [setDiscardModalOpen])
    const { useFormState } = ReactFinalForm
    const { dirty, valid } = useFormState()

    return (
        <>
            <ButtonStrip>
                <Button
                    type="submit"
                    primary
                    onClick={() => {
                        handleRequestSubmit()
                        if (valid) {
                            exitRequestEditMode()
                        }
                    }}
                >
                    {i18n.t('Save request')}
                </Button>
                <Button
                    onClick={() => {
                        !dirty
                            ? exitRequestEditMode()
                            : setDiscardModalOpen(true)
                    }}
                >
                    {i18n.t('Cancel')}
                </Button>
            </ButtonStrip>
            <DiscardModal
                open={discardModalOpen}
                onClose={onClose}
                objectName="request"
                onCancelConfirm={exitRequestEditMode}
            />
        </>
    )
}

EditRequestFooter.propTypes = {
    exitRequestEditMode: PropTypes.func,
    handleRequestSubmit: PropTypes.func,
}
