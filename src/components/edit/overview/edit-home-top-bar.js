import i18n from '@dhis2/d2-i18n'
import { Button, SelectorBar } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import styles from './edit-home-top-bar.module.css'

export const EditHomeTopBar = () => (
    <div>
        <SelectorBar>
            <Link to="/">
                <Button small className={styles.exitConfigurationsButton}>
                    {i18n.t('Exit configuration mode')}
                </Button>
            </Link>
        </SelectorBar>
        <div className={styles.editTopBarContainer}>
            <h2 className={styles.editTitle}>
                {i18n.t('Data exchange configurator')}
            </h2>
            <Button primary>{i18n.t('New exchange configuration')}</Button>
        </div>
    </div>
)
