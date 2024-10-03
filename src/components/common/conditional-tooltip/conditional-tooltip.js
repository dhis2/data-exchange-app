import { Tooltip } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

export const ConditionalTooltip = ({ condition, children, ...rest }) => {
    if (!condition) {
        return <>{children}</>
    }
    return <Tooltip {...rest}>{children}</Tooltip>
}

ConditionalTooltip.propTypes = {
    children: PropTypes.node,
    condition: PropTypes.bool,
}
