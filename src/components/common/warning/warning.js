import { NoticeBox } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './warning.module.css'

const Warning = ({ error, warning, title, children }) => {
    return (
        <div className={styles.warningBoxWrapper}>
            <NoticeBox error={error} warning={warning} title={title}>
                {children}
            </NoticeBox>
        </div>
    )
}

Warning.propTypes = {
    children: PropTypes.node,
    error: PropTypes.bool,
    title: PropTypes.string,
    warning: PropTypes.bool,
}

export { Warning }
