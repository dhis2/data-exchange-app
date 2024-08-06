import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-subsection.module.css'

export const Subsection = ({ text, description, children, className = '' }) => (
    <div className={className}>
        <div className={styles.subtitleContainer}>
            <div className={styles.subtitle}>{text}</div>
            {description && (
                <div className={styles.description}>{description}</div>
            )}
        </div>
        <div className={styles.subsectionContent}>{children}</div>
    </div>
)

Subsection.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.string,
}
