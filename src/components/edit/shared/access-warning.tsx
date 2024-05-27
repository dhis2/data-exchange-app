import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import { Warning } from '../../common/index.js'
import styles from './access-warning.module.css'

export const AccessWarning = ({ editMode }) => (
    <>
        <Warning error={true} title={i18n.t('Not available')}>
            <span>
                {editMode
                    ? i18n.t(
                          'The requested exchange does not exist, or you do not have the relevant authorities to edit it.'
                      )
                    : i18n.t(
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

AccessWarning.propTypes = {
    editMode: PropTypes.bool,
}
