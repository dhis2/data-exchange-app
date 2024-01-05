import { PeriodDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React from 'react'

export const PeriodSelector = ({ input }) => {
    const selectedPeriods = input.value
        ? input.value.map((pe) => ({ id: pe, name: pe }))
        : []

    return (
        <>
            <PeriodDimension
                selectedPeriods={selectedPeriods}
                onSelect={({ items }) => {
                    input.onChange(items.map(({ id }) => id))
                }}
            />
        </>
    )
}

PeriodSelector.propTypes = {
    input: PropTypes.object,
}
