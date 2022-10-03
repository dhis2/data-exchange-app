import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './warning.module.css'

const Warning = ({ error, title, message }) => {
    return (
        <div className={styles.warningBoxWrapper}>
            <NoticeBox error={error} title={title}>
                {message}
            </NoticeBox>
        </div>
    )
}

Warning.propTypes = {
    error: PropTypes.bool,
    message: PropTypes.string,
    title: PropTypes.string,
}

export { Warning }
