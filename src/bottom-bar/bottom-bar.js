import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './bottom-bar.module.css'

const BottomBar = ({ openSubmitModal }) => {
    return (
        <div className={styles.bottomBar} data-test="bottom-bar">
            <Button primary onClick={openSubmitModal}>
                Submit
            </Button>
        </div>
    )
}

BottomBar.propTypes = {
    openSubmitModal: PropTypes.func,
}
export { BottomBar }
