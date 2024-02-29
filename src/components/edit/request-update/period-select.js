import { PeriodDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'
import { SelectorValidationError } from '../shared/index.js'

export const PeriodSelector = ({ input, meta }) => {
    const { value: selectedPeriods } = input

    return (
        <>
            <PeriodDimension
                selectedPeriods={selectedPeriods}
                onSelect={({ items }) => {
                    input.onChange(items)
                }}
            />
            <SelectorValidationError meta={meta} />
        </>
    )
}

PeriodSelector.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
}
