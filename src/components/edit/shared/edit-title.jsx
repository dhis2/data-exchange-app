import PropTypes from 'prop-types'
import React from 'react'
import styles from './edit-title.module.css'

export const EditTitle = ({ title }) => (
    <h2 className={styles.editTitle}>{title}</h2>
)

EditTitle.propTypes = {
    title: PropTypes.string,
}
