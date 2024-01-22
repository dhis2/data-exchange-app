import { DataDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { SelectorValidationError } from '../shared/selector-validation-error.js'

export const DataItemSelect = ({ input, meta }) => {
    const { value: selectedDimensions, onChange } = input
    console.log('data item select input', input, meta)

    return (
        <>
            <DataDimension
                onSelect={({ items }) => {
                    console.log(items)
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
