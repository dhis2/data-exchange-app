import i18n from '@dhis2/d2-i18n'
import { Button, SelectorBar } from '@dhis2/ui'
import React from 'react'
import { Link } from 'react-router-dom'
import { EditTitle } from '../shared/index'
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
            <EditTitle title={i18n.t('Data Exchange Configurations')} />
            <Link to="/add">
                <Button primary>{i18n.t('New exchange configuration')}</Button>
            </Link>
        </div>
    </div>
)
