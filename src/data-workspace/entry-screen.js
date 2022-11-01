import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './entry-screen.module.css'

const EmptyStateIcon = () => (
    <svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g clipPath="url(#clip0_229_2099)">
            <path
                d="M12 20L22.3923 26V38L12 44L1.6077 38V26L12 20Z"
                fill="#FBFCFD"
                stroke="#404B5A"
                strokeWidth="2"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.0001 31.4338V20H13.0001V31.4338L22.5146 37.1425L21.4856 38.8575L12.0001 33.1662L2.51459 38.8575L1.4856 37.1425L11.0001 31.4338Z"
                fill="#404B5A"
            />
            <path
                d="M52 20L62.3923 26V38L52 44L41.6077 38V26L52 20Z"
                fill="#FBFCFD"
                stroke="#404B5A"
                strokeWidth="2"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51.0001 31.4338V20H53.0001V31.4338L62.5146 37.1425L61.4856 38.8575L52.0001 33.1662L42.5146 38.8575L41.4856 37.1425L51.0001 31.4338Z"
                fill="#404B5A"
            />
            <path d="M24 44H34" stroke="#6C7787" strokeWidth="2" />
            <path d="M29 49L34 44L29 39" stroke="#6C7787" strokeWidth="2" />
            <path d="M22 44H20" stroke="#6C7787" strokeWidth="2" />
            <path d="M40 44H37" stroke="#6C7787" strokeWidth="2" />
            <path d="M44 44H42" stroke="#6C7787" strokeWidth="2" />
            <path d="M30 20L40 20" stroke="#6C7787" strokeWidth="2" />
            <path d="M35 25L40 20L35 15" stroke="#6C7787" strokeWidth="2" />
            <path d="M28 20H24" stroke="#6C7787" strokeWidth="2" />
            <path d="M45 20H43" stroke="#6C7787" strokeWidth="2" />
            <path d="M34 32H38" stroke="#6C7787" strokeWidth="2" />
            <path d="M29 32H32" stroke="#6C7787" strokeWidth="2" />
            <path d="M25 32H27" stroke="#6C7787" strokeWidth="2" />
            <path d="M10 56L21 56" stroke="#6C7787" strokeWidth="2" />
            <path d="M4 56L8 56" stroke="#6C7787" strokeWidth="2" />
            <path d="M16 61L21 56L16 51" stroke="#6C7787" strokeWidth="2" />
            <path d="M26 56L32 56" stroke="#6C7787" strokeWidth="2" />
            <path d="M35 56L38 56" stroke="#6C7787" strokeWidth="2" />
            <path d="M40 56L42 56" stroke="#6C7787" strokeWidth="2" />
            <path d="M21 8L31 8" stroke="#6C7787" strokeWidth="2" />
            <path d="M13 8L17 8" stroke="#6C7787" strokeWidth="2" />
            <path d="M8 8L10 8" stroke="#6C7787" strokeWidth="2" />
            <path d="M26 13L31 8L26 3" stroke="#6C7787" strokeWidth="2" />
            <path d="M6 8L3 8" stroke="#6C7787" strokeWidth="2" />
            <path d="M37 8L35 8" stroke="#6C7787" strokeWidth="2" />
            <path d="M41 8L39 8" stroke="#6C7787" strokeWidth="2" />
        </g>
        <defs>
            <clipPath id="clip0_229_2099">
                <rect width="64" height="64" fill="white" />
            </clipPath>
        </defs>
    </svg>
)

const documentationLink =
    'https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/data-exchange.html#data-exchange'

export const EntryScreen = () => (
    <div className={styles.wrapperDiv}>
        <div className={styles.innerDiv}>
            <div className={styles.svgWrapper}>
                <EmptyStateIcon />
            </div>
            <span className={styles.headingText}>
                {i18n.t('Choose a data exchange to get started')}
            </span>
            <span className={styles.instructionsText}>
                {i18n.t(
                    'Review your data before submitting it to a data exchange.'
                )}
            </span>
            <span className={styles.instructionsText}>
                {i18n.t('Choose a data exchange from the top menu.')}
            </span>
            <a
                className={styles.linkText}
                target="_blank"
                rel="noreferrer noopener"
                href={documentationLink}
            >
                {i18n.t('Learn more about data exchange')}
            </a>
        </div>
    </div>
)
