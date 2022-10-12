import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import { Loader, Warning } from '../shared/index.js'
import {
    useExchangeId,
    useRequestIndex,
} from '../use-context-selection/index.js'
import { ExchangeContext } from './exchange-context.js'

const query = {
    exchange: {
        resource: 'aggregateDataExchanges',
        id: ({ id }) => id,
        params: {
            paging: false,
            fields: ['source, target', 'id', 'displayName'],
        },
    },
    exchangeData: {
        resource: 'aggregateDataExchanges',
        id: ({ id }) => `${id}/sourceData`,
        params: {
            paging: false,
        },
    },
}

const ExchangeProvider = ({ children }) => {
    const { loading, error, data, called, refetch } = useDataQuery(query, {
        lazy: true,
    })
    const [exchangeId] = useExchangeId()
    const [, setRequestIndex] = useRequestIndex()
    const fetchExchange = useCallback(
        () => refetch({ id: exchangeId }),
        [refetch, exchangeId]
    )

    useEffect(() => {
        setRequestIndex(0)
        if (exchangeId) {
            fetchExchange()
        }
    }, [exchangeId, fetchExchange, setRequestIndex])

    if (loading) {
        return <Loader />
    }

    if (error) {
        /**
         * error boundary
         */
        return (
            <Warning
                error={true}
                title={i18n.t('Exchange content not accessible')}
            >
                <Button onClick={fetchExchange}>
                    {i18n.t('Click to refresh')}
                </Button>
            </Warning>
        )
    }

    const { exchange, exchangeData } = data || {}

    const providerValue = {
        exchange,
        exchangeData,
    }

    if (!called) {
        return (
            <ExchangeContext.Provider
                value={{ exchange: null, exchangeData: null }}
            >
                {children}
            </ExchangeContext.Provider>
        )
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
