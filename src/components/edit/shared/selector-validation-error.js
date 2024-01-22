import { IconErrorFilled24, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './selector-validation-error.module.css'

export const SelectorValidationError = ({ meta }) => {
    const { error, touched } = meta
    if (!touched || !error) {
        return null
    }
    return (
        <div className={styles.container}>
            <IconErrorFilled24 color={colors.red500} />
            <div className={styles.message}>{error}</div>
        </div>
    )
}

SelectorValidationError.propTypes = {
    meta: PropTypes.object,
}
