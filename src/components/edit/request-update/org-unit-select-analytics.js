import { OrgUnitDimension } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'

// need to get orgUnit info (id, name, path) for initially selected values
// (need to extract and get info for group/level) [TBD]
// implement onChange function
// TBD move to a context?
const userQuery = {
    user: {
        resource: 'me',
        params: {
            fields: ['id', 'organisationUnits'],
        },
    },
}

export const OrgUnitSelector = ({ input }) => {
    const { value: selectedOrgUnits, onChange } = input

    const { data: userInfo } = useDataQuery(userQuery)
    const rootOrgUnits = userInfo?.user?.organisationUnits
        ? userInfo?.user?.organisationUnits.map(({ id }) => id)
        : null

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
        </>
    )
}

OrgUnitSelector.propTypes = {
    input: PropTypes.object,
}
