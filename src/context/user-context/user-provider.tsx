import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader, Warning } from '../../components/common/index'
import { UserContext } from './user-context'

const EXCHANGE_AUTHORITIES_ADD = [
    'F_AGGREGATE_DATA_EXCHANGE_PRIVATE_ADD',
    'F_AGGREGATE_DATA_EXCHANGE_PUBLIC_ADD',
]
const EXCHANGE_AUTHORITIES_DELETE = ['F_AGGREGATE_DATA_EXCHANGE_DELETE']
const ALL_AUTHORITY = ['ALL']

const query = {
    user: {
        // This is generic enpoint but will only return
        // exchanges a user is allowed to see
        resource: 'me',
        params: {
            paging: false,
            fields: ['id', 'authorities', 'organisationUnits', 'settings'],
        },
    },
}

const UserProvider = ({ children }) => {
    const { data, loading, error } = useDataQuery(query)

    if (loading) {
        return <Loader />
    }

    if (error) {
        /**
         * general error boundary
         */
        return (
            <Warning
                error={true}
                title={i18n.t('User information is not available')}
            >
                <span>
                    {i18n.t(
                        'There was a problem retrieving user information. Refresh the page to try again.'
                    )}
                </span>
            </Warning>
        )
    }

    const { id, authorities, organisationUnits, settings } = data.user

    const canAddExchange = [...ALL_AUTHORITY, ...EXCHANGE_AUTHORITIES_ADD].some(
        (auth) => authorities.includes(auth)
    )
    const canDeleteExchange = [
        ...ALL_AUTHORITY,
        ...EXCHANGE_AUTHORITIES_DELETE,
    ].some((auth) => authorities.includes(auth))

    const providerValue = {
        id,
        canAddExchange,
        canDeleteExchange,
        organisationUnits,
        keyUiLocale: settings.keyUiLocale,
    }

    return (
        <UserContext.Provider value={providerValue}>
            {children}
        </UserContext.Provider>
    )
}

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { UserProvider }
