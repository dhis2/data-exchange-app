import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Warning } from '../../common/index.js'
import styles from './external-edit-warning.module.css'

const sectionNameWarning = {
    targetSetup: i18n.t(
        'Editing the target setup will require you to reenter authentication details.'
    ),
    idSchemes: i18n.t(
        'Editing the input ID scheme options will require you to reenter authentication details.'
    ),
    advancedOptions: i18n.t(
        'Editing the advanced options will require you to reenter authentication details.'
    ),
}

const sectionNameEdit = {
    targetSetup: i18n.t('Edit target setup'),
    idSchemes: i18n.t('Edit input ID scheme options'),
    advancedOptions: i18n.t('Edit advanced options'),
}

export const EnableExternalEditWarning = ({
    editTargetSetupDisabled,
    setEditTargetSetupDisabled,
    sectionName,
}) => {
    if (!editTargetSetupDisabled) {
        return null
    }

    return (
        <Warning>
            <div>{sectionNameWarning[sectionName ?? 'targetSetup']}</div>
            <Button
                className={styles.editWarningButton}
                small
                onClick={() => setEditTargetSetupDisabled(false)}
            >
                {sectionNameEdit[sectionName ?? 'targetSetup']}
            </Button>
        </Warning>
    )
}

EnableExternalEditWarning.propTypes = {
    editTargetSetupDisabled: PropTypes.bool,
    sectionName: PropTypes.string,
    setEditTargetSetupDisabled: PropTypes.func,
}
