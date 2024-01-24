import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { Warning } from '../../shared/index.js'
import styles from './access-warning.module.css'

export const AccessWarning = () => (
    <>
        <Warning error={true} title={i18n.t('Not available')}>
            <span>
                {i18n.t(
                    'You do not have the relevant authorities to add a new exchange.'
                )}
            </span>
        </Warning>

        <div className={styles.accessWarningButton}>
            <Link to="/edit/">
                <Button>{i18n.t('Back to configurations page')}</Button>
            </Link>
        </div>
    </>
)
