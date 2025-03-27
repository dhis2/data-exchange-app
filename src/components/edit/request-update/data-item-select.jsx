import {
    DataDimension,
    dataTypeMap,
    DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM,
} from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { SelectorValidationError } from '../shared/index.js'

export const DataItemSelect = ({ input, meta }) => {
    const { value: selectedDimensions, onChange } = input
    const enabledDataTypes = Object.values(dataTypeMap).filter(
        ({ id }) => id !== DIMENSION_TYPE_EXPRESSION_DIMENSION_ITEM
    )

    return (
        <>
            <DataDimension
                enabledDataTypes={enabledDataTypes}
                onSelect={({ items }) => {
                    onChange(items)
                }}
                selectedDimensions={selectedDimensions ?? []}
                displayNameProp="displayName"
            />
            <SelectorValidationError meta={meta} />
        </>
    )
}

DataItemSelect.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
}
