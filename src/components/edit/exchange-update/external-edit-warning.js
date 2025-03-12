import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Warning } from '../../common/index.js'
import styles from './external-edit-warning.module.css'

export const EnableExternalEditWarning = ({
    editTargetSetupDisabled,
    setEditTargetSetupDisabled,
}) => {
    if (!editTargetSetupDisabled) {
        return null
    }

    return (
        <Warning>
            <div>
                {i18n.t(
                    'You will need to reenter authentication details (password, api token) if you edit this information'
                )}
            </div>
            <Button
                className={styles.editWarningButton}
                small
                onClick={() => setEditTargetSetupDisabled(false)}
            >
                {i18n.t('Edit authentication details')}
            </Button>
        </Warning>
    )
}

EnableExternalEditWarning.propTypes = {
    editTargetSetupDisabled: PropTypes.bool,
    setEditTargetSetupDisabled: PropTypes.func,
}
