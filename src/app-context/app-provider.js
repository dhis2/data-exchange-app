import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader, Warning } from '../shared/index.js'
import { AppContext } from './app-context.js'

const query = {
    aggregateDataExchanges: {
        // This is generic enpoint but will only return
        // workflows a user is allowed to see
        resource: 'aggregateDataExchanges',
        params: {
            paging: false,
            fields: ['id', 'displayName'],
        },
    },
}

const AppProvider = ({ children }) => {
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
                title={i18n.t(
                    'Aggregate data exchange information is not accessible'
                )}
                message={i18n.t(
                    'There was a problem retrieving aggregate data exchanges. Refresh the page to try again.'
                )}
            />
        )
    }

    const { aggregateDataExchanges } = data.aggregateDataExchanges

    const providerValue = {
        aggregateDataExchanges,
    }

    return (
        <AppContext.Provider value={providerValue}>
            {children}
        </AppContext.Provider>
    )
}

AppProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { AppProvider }
