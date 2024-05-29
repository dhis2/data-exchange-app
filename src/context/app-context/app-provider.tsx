import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { Loader, Warning } from '../../components/common/index'
import {
    AggregateDataExchange,
    ModelCollectionResponse,
} from '../../types/generated'
import { AppContext } from './app-context'

const query = {
    aggregateDataExchanges: {
        // This is generic enpoint but will only return
        // exchanges a user is allowed to see
        resource: 'aggregateDataExchanges',
        params: {
            paging: false,
            fields: [
                'id',
                'displayName',
                'created',
                'target[type]',
                'source[requests~size]',
                'access[data]',
            ],
            order: 'displayName:iasc',
        },
    },
}

type AggregateDataExchangeResponse = {
    aggregateDataExchanges: ModelCollectionResponse<
        AggregateDataExchange,
        'aggregateDataExchanges'
    >
}

const AppProvider = ({ children }) => {
    const {
        data,
        loading,
        error,
        refetch: refetchExchanges,
    } = useDataQuery<AggregateDataExchangeResponse>(query)

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
            >
                <span>
                    {i18n.t(
                        'There was a problem retrieving aggregate data exchanges. Refresh the page to try again.'
                    )}
                </span>
            </Warning>
        )
    }

    const { aggregateDataExchanges } = data.aggregateDataExchanges

    const providerValue = {
        aggregateDataExchanges,
        refetchExchanges,
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
