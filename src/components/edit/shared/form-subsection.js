import { IconChevronUp24, IconChevronDown24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './form-subsection.module.css'

export const TogglableSubsection = ({
    text,
    children,
    open,
    onTextClick,
    className = '',
}) => (
    <div className={className}>
        <div className={styles.subtitleContainer} onClick={onTextClick}>
            <span className={styles.subtitleContainerItems}>
                {open ? <IconChevronUp24 /> : <IconChevronDown24 />}
                <span className={styles.subtitle}>{text}</span>
            </span>
        </div>
        {open && <div className={styles.subsectionContent}>{children}</div>}
    </div>
)

TogglableSubsection.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    open: PropTypes.bool,
    text: PropTypes.string,
    onTextClick: PropTypes.func,
}

export const Subsection = ({
    text,
    description,
    children,
    className = '',
    dataTest,
}) => (
    <div className={className} data-test={dataTest || 'subsection'}>
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
    dataTest: PropTypes.string,
    description: PropTypes.string,
    text: PropTypes.string,
}
