import { DataDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { SelectorValidationError } from '../shared/index.js'

export const DataItemSelect = ({ input, meta }) => {
    const { value: selectedDimensions, onChange } = input

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
