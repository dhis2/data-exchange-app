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
import styles from './exchange-provider.module.css'

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
                <span className={styles.errorWrapperText}>
                    {i18n.t(
                        'It was not possible to retrieve data for the requested exchange. This may be due to either a connection error or a configuration issue. The message below provides additional detail.'
                    )}
                </span>
                <span className={styles.errorMessage}>
                    {error?.message || ''}
                </span>
                <Button onClick={fetchExchange}>{i18n.t('Try again')}</Button>
            </Warning>
        )
    }

    const { exchange, exchangeData } = data || {}

    const providerValue = {
        exchange: called ? exchange : null,
        exchangeData: called ? exchangeData : null,
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
