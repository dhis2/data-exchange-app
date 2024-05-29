import { OrgUnitDimension } from '@dhis2/analytics'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { useUserContext } from '../../../context/index'
import { SelectorValidationError } from '../shared/index'

export const OrgUnitSelector = ({ input, meta }) => {
    const { value: selectedOrgUnits, onChange } = input
    const { organisationUnits: userOrganisationUnits } = useUserContext()
    const rootOrgUnits = useMemo(
        () =>
            userOrganisationUnits
                ? userOrganisationUnits.map(({ id }) => id)
                : null,
        [userOrganisationUnits]
    )

    if (!rootOrgUnits) {
        return null
    }

    return (
        <>
            <OrgUnitDimension
                roots={rootOrgUnits}
                selected={selectedOrgUnits}
                onSelect={({ items }) => {
                    onChange(items)
                }}
                hideUserOrgUnits={true}
            />
            <SelectorValidationError meta={meta} />
        </>
    )
}

OrgUnitSelector.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
}
