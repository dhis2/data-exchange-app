import { IconChevronUp24, IconChevronDown24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-subsection.module.css'

export const AdvancedSubsection = ({
    text,
    children,
    open,
    onTextClick,
    className = '',
}) => (
    <div className={className}>
        <div className={styles.subtitleContainer} onClick={onTextClick}>
            <>
                {open ? <IconChevronUp24 /> : <IconChevronDown24 />}
                <span className={styles.subtitle}>{text}</span>
            </>
        </div>
        <div className={styles.subsectionContent}>{children}</div>
    </div>
)

AdvancedSubsection.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    open: PropTypes.bool,
    text: PropTypes.string,
    onTextClick: PropTypes.func,
}

export const Subsection = ({ text, children, className = '' }) => (
    <div className={className}>
        <div className={styles.subtitle}>{text}</div>
        <div className={styles.subsectionContent}>{children}</div>
    </div>
)

Subsection.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    text: PropTypes.string,
}
