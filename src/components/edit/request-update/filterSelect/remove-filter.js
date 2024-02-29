import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './remove-filter.module.css'

// Remove filter button used for both thematic and event filters
const RemoveFilter = ({ onClick }) => (
    <div className={styles.removeButtonContainer}>
        <Button onClick={onClick} small destructive secondary>
            {i18n.t('Remove')}
        </Button>
    </div>
)

RemoveFilter.propTypes = {
    onClick: PropTypes.func.isRequired,
}

export default RemoveFilter
