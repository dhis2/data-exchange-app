import { useDataQuery } from '@dhis2/app-runtime'
import { OrganisationUnitTree } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

// get user root org unit(s)
// look up paths for org units

const userQuery = {
    user: {
        resource: 'me',
        params: {
            fields: ['id', 'organisationUnits'],
        },
    },
}

const orgUnitQuery = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ initialOrgUnits }) => ({
            fields: ['id', 'path'],
            paging: false,
            filter: `id:in:[${initialOrgUnits.join(',')}]`,
        }),
    },
}

export const OrgUnitSelector = ({ input }) => {
    const { value, onChange } = input
    const { data: userInfo } = useDataQuery(userQuery)
    const { data: orgUnitsInfo, refetch: refetchOrgUnits } =
        useDataQuery(orgUnitQuery)
    const rootOrgUnits = userInfo?.user?.organisationUnits
        ? userInfo?.user?.organisationUnits.map(({ id }) => id)
        : null
    const [selectedPaths, setSelectedPaths] = useState([])
    const initiallyExpanded = selectedPaths
        .map((path) => path.substring(0, path.lastIndexOf('/')))
        .filter((p) => p !== '')

    useEffect(() => {
        if (orgUnitsInfo?.orgUnits?.organisationUnits) {
            setSelectedPaths(
                orgUnitsInfo.orgUnits.organisationUnits.map(({ path }) => path)
            )
        }
    }, [setSelectedPaths, orgUnitsInfo])

    useEffect(() => {
        if (!orgUnitsInfo && refetchOrgUnits && value) {
            refetchOrgUnits({ initialOrgUnits: value })
        }
    }, [refetchOrgUnits, value, orgUnitsInfo])

    useEffect(() => {
        const selectedIDs = selectedPaths.map((path) =>
            path.substring(path.lastIndexOf('/') + 1)
        )
        onChange(selectedIDs)
    }, [selectedPaths, onChange])

    if (!rootOrgUnits || !initiallyExpanded) {
        return null
    }

    return (
        <OrganisationUnitTree
            name="Org Unit"
            roots={rootOrgUnits}
            initiallyExpanded={initiallyExpanded}
            selected={selectedPaths}
            onChange={({ selected }) => {
                setSelectedPaths(selected)
            }}
        />
    )
}

OrgUnitSelector.propTypes = {
    input: PropTypes.object,
}
