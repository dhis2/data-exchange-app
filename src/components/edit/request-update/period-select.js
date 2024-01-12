import { PeriodDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'

export const PeriodSelector = ({ input }) => {
    const { value: selectedPeriods } = input

    return (
        <>
            <PeriodDimension
                selectedPeriods={selectedPeriods}
                onSelect={({ items }) => {
                    input.onChange(items)
                }}
            />
        </>
    )
}

PeriodSelector.propTypes = {
    input: PropTypes.object,
}
