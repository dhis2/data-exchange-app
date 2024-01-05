import { OrgUnitDimension } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'

// need to get orgUnit info (id, name, path) for initially selected values
// (need to extract and get info for group/level) [TBD]
// implement onChange function

const userQuery = {
    user: {
        resource: 'me',
        params: {
            fields: ['id', 'organisationUnits'],
        },
    },
}

export const OrgUnitSelector = ({ input }) => {
    const { value: selectedOrgUnitsReal } = input
    console.log('real org units selected', selectedOrgUnitsReal)
    const selectedOrgUnits = [
        { name: 'Sierra Leone', path: '/ImspTQPwCqd', id: 'ImspTQPwCqd' },
        { id: 'LEVEL-wjP19dkFeIk', name: 'District' },
    ]
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
                onSelect={(items) => {
                    console.log(items)
                }}
            />
        </>
    )
}

OrgUnitSelector.propTypes = {
    input: PropTypes.object,
}
