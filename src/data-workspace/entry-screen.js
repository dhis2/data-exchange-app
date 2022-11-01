import i18n from '@dhis2/d2-i18n'
import React from 'react'
import styles from './entry-screen.module.css'

// to be replaced with actual icon
const EmptyStateIcon = () => <></>
// (
//     <svg
//         width="64"
//         height="64"
//         viewBox="0 0 64 64"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//     >
//         <path d="M3 17V3H61V17" stroke="#6C7787" strokeWidth="2" />
//         <path d="M61 47L61 61L3 61L3 47" stroke="#6C7787" strokeWidth="2" />
//         <rect
//             x="3"
//             y="20"
//             width="58"
//             height="24"
//             fill="#FBFCFD"
//             stroke="#404B5A"
//             strokeWidth="2"
//         />
//         <path d="M8 32L22 32" stroke="#404B5A" strokeWidth="2" />
//         <path d="M16 38L22 32L16 26" stroke="#404B5A" strokeWidth="2" />
//         <path d="M28 26L56 26" stroke="#404B5A" strokeWidth="2" />
//         <path d="M8 9L56 9" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M8 49L35 49" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M37 49L47 49" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M49 49L53 49" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M8 15L20 15" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M22 15L30 15" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M8 55H28" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M30 55L34 55" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M36 55L38 55" stroke="#A0ADBA" strokeWidth="2" />
//         <path d="M28 38L56 38" stroke="#404B5A" strokeWidth="2" />
//         <path d="M32 32L56 32" stroke="#404B5A" strokeWidth="2" />
//     </svg>
// )

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
