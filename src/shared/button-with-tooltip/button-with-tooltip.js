import { Button, Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './button-with-tooltip.module.css'

export const ButtonWithTooltip = ({ buttonText, tooltipContent }) => (
    <div data-test="bottom-bar">
        <Tooltip content={tooltipContent}>
            {({ ref, onMouseOver, onMouseOut }) => (
                <span
                    className={styles.tooltipReference}
                    ref={ref}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                >
                    <Button primary disabled>
                        {buttonText}
                    </Button>
                </span>
            )}
        </Tooltip>
    </div>
)

ButtonWithTooltip.propTypes = {
    buttonText: PropTypes.string,
    tooltipContent: PropTypes.string,
}
