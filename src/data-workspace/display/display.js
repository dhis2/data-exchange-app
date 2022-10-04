import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useExchangeContext } from '../../exchange-context/index.js'
import { Loader, Warning } from '../../shared/index.js'
import styles from './display.module.css'

// cannot pass multiple params of the same value (i.e. dimension cannot be repeated)
export const create_query = ({ dx, pe, ou, filters }) => {
    const formattedFilters =
        filters.length === 0
            ? ''
            : '&' +
              filters.map(
                  (filter) =>
                      `filter=${filter.dimension}:${filter.items.join(';')}`
              )
    return {
        resource: `analytics/dataValueSet.json?dimension=dx:${dx.join(
            ';'
        )}&dimension=pe:${pe.join(';')}&dimension=ou:${ou.join(
            ';'
        )}&includeMetadataDetails:true&includeNumDen:true${formattedFilters}`,
    }
}

const Display = ({ requestName }) => {
    const { exchange } = useExchangeContext()

    // placeholder for actual code (need to resolve approach given repeated parameters)
    const request = exchange.source?.requests?.find(
        (request) => request.name === requestName
    )
    const dx = ['fbfJHSPpUQD', 'cYeuwXTCPkU', 'Jtf34kNZhzP']
    const pe = ['LAST_12_MONTHS', '202201']
    const ou = ['ImspTQPwCqd']
    const filters = [
        { dimension: 'Bpx0589u8y0', items: ['oRVt7g429ZO', 'MAs88nJc9nL'] },
    ]

    const { loading, error, data, refetch } = useDataQuery(
        { dataValueSets: create_query({ dx, pe, ou, filters }) },
        {
            lazy: true,
        }
    )

    useEffect(() => {
        refetch({})
    }, [exchange, refetch, requestName])

    if (loading) {
        return <Loader />
    }

    if (error) {
        return (
            <div className={styles.display}>
                <Warning
                    error={true}
                    title={i18n.t(
                        'There was a problem retrieving data for this report'
                    )}
                    message={error.message}
                />
            </div>
        )
    }

    if (data) {
        return (
            <div className={styles.display}>
                {!request?.visualization && (
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={'https://www.dhis2.org'}
                        style={{ textDecoration: 'none' }}
                    >
                        <Button>
                            {i18n.t('Open this data in data visualizer')}
                        </Button>
                    </a>
                )}
                {data.dataValueSets?.dataValues.map((dv) => (
                    <p key={`${dv.dataElement}-${dv.period}-${dv.orgUnit}`}>
                        {JSON.stringify(dv)}
                    </p>
                ))}
            </div>
        )
    }

    return null
}

Display.propTypes = {
    requestName: PropTypes.string,
}

export { Display }
