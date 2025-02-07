import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Modal,
    ModalActions,
    ModalContent,
    ModalTitle,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const DeleteConfirmation = ({ open, onClose, onDelete }) => {
    return (
        <Modal hide={!open} large position="middle" onClose={onClose}>
            <ModalTitle>{i18n.t('Delete exchange')}</ModalTitle>
            <ModalContent>
                <span>
                    {i18n.t(
                        'Deleting this exchange will remove it for all users on this instance. This action cannot be undone. Are you sure?'
                    )}
                </span>
            </ModalContent>

            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        {i18n.t('No, cancel')}
                    </Button>
                    <Button destructive onClick={onDelete}>
                        {i18n.t('Yes, delete')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}

DeleteConfirmation.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onDelete: PropTypes.func,
}
