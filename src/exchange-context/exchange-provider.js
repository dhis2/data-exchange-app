import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { Loader, Warning } from '../shared/index.js'
import { ExchangeContext } from './exchange-context.js'

const query = {
    exchange: {
        // This is generic enpoint but will only return
        // workflows a user is allowed to see
        resource: 'aggregateDataExchanges',
        id: ({ id }) => id,
        params: {
            paging: false,
            fields: ['source, target', 'id', 'displayName'],
        },
    },
}

const ExchangeProvider = ({ children }) => {
    const { fetching, error, data, called, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const fetchExchange = () => refetch({ id: 'ioHMBgeK50L' })

    useEffect(() => {
        fetchExchange()
    }, [])

    if (fetching || !called) {
        return <Loader />
    }

    if (error) {
        /**
         * general error boundary
         */
        return (
            <Warning
                error={true}
                title={i18n.t('Exchange content not accessible')}
                message={
                    <Button onClick={fetchExchange}>Click to refresh</Button>
                }
            />
        )
    }

    const { exchange } = data

    const providerValue = {
        exchange,
    }

    return (
        <ExchangeContext.Provider value={providerValue}>
            {children}
        </ExchangeContext.Provider>
    )
}

ExchangeProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { ExchangeProvider }
