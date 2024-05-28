import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useCallback, useEffect } from 'react'
import { Loader, Warning } from '../../components/common/index.js'
import {
    useExchangeId,
    useRequestIndex,
} from '../../use-context-selection/index.js'
import { ExchangeContext } from './exchange-context.js'
import styles from './exchange-provider.module.css'

const exchangeQuery = {
    exchange: {
        resource: 'aggregateDataExchanges',
        id: ({ id }) => id,
        params: {
            paging: false,
            fields: ['source, target', 'id', 'displayName'],
        },
    },
}

const exchangeDataQuery = {
    exchangeData: {
        resource: 'aggregateDataExchanges',
        id: ({ id }) => `${id}/sourceData`,
        params: {
            paging: false,
            outputIdScheme: 'UID',
        },
    },
}

const ExchangeProvider = ({ children, showPreview }) => {
    const {
        loading: exchangeLoading,
        error: exchangeError,
        data: exchange,
        called: exchangeCalled,
        refetch: exchangeRefetch,
    } = useDataQuery(exchangeQuery, {
        lazy: true,
    })
    const {
        loading: exchangeDataLoading,
        error: exchangeDataError,
        data: exchangeData,
        called: exchangeDataCalled,
        refetch: exchangeDataRefetch,
    } = useDataQuery(exchangeDataQuery, {
        lazy: true,
    })
    const [exchangeId] = useExchangeId()
    const [, setRequestIndex] = useRequestIndex()

    const fetchExchange = useCallback(
        () => exchangeRefetch({ id: exchangeId }),
        [exchangeRefetch, exchangeId]
    )

    const fetchExchangeData = useCallback(
        () => exchangeDataRefetch({ id: exchangeId }),
        [exchangeDataRefetch, exchangeId]
    )

    useEffect(() => {
        setRequestIndex(0)
        if (exchangeId) {
            fetchExchange()
        }
        if (exchangeId && showPreview) {
            fetchExchangeData()
        }
    }, [
        exchangeId,
        showPreview,
        fetchExchange,
        fetchExchangeData,
        setRequestIndex,
    ])

    if (exchangeLoading || exchangeDataLoading) {
        return <Loader />
    }

    if (exchangeError) {
        /**
         * error boundary
         */
        return (
            <Warning error={true} title={i18n.t('Exchange not accessible')}>
                <span className={styles.errorWrapperText}>
                    {i18n.t(
                        'It was not possible to retrieve the requested exchange. This may be due to either a connection error or a configuration issue. The message below provides additional detail.'
                    )}
                </span>
                <span className={styles.errorMessage}>
                    {exchangeError?.message || ''}
                </span>
                <Button onClick={fetchExchange}>{i18n.t('Try again')}</Button>
            </Warning>
        )
    }

    if (exchangeDataError) {
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
                    {exchangeDataError?.message || ''}
                </span>
                <Button onClick={fetchExchangeData}>
                    {i18n.t('Try again')}
                </Button>
            </Warning>
        )
    }

    const providerValue = {
        exchange: exchangeCalled ? exchange.exchange : null,
        exchangeData:
            exchangeDataCalled && showPreview
                ? exchangeData.exchangeData
                : null,
    }

    return (
        <ExchangeContext.Provider value={providerValue}>
            {children}
        </ExchangeContext.Provider>
    )
}

ExchangeProvider.propTypes = {
    children: PropTypes.node.isRequired,
    showPreview: PropTypes.bool.isRequired,
}

export { ExchangeProvider }
