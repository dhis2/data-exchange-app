import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-subsection.module.css'

export const Subsection = ({ text, children }) => (
    <div>
        <div className={styles.subtitle}>{text}</div>
        <div className={styles.subsectionContent}>{children}</div>
    </div>
)

Subsection.propTypes = {
    children: PropTypes.node,
    text: PropTypes.string,
}
