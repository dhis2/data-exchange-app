import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect } from 'react'
import { useExchangeContext } from '../../exchange-context/index.js'
import { Loader, Warning } from '../../shared/index.js'
import { Table } from '../table/index.js'
import styles from './display.module.css'

const query = {
    dataValueSet: {
        resource: 'analytics/dataValueSet.json',
        params: ({ dx, pe, ou, filters }) => ({
            dimension: `dx:${dx.join(';')},pe:${pe.join(';')},ou:${ou.join(
                ';'
            )}`,
            filter: filters
                ? filters
                      .map(
                          (filter) =>
                              `${filter.dimension}:${filter.items.join(';')}`
                      )
                      .join(',')
                : '',
        }),
    },
}

// TBD re: data conversion for formatting

const convertToObjectFormat = (data) => {
    const objectFormat = {}
    for (const row of data) {
        if (!Object.prototype.hasOwnProperty.call(objectFormat, row.orgUnit)) {
            objectFormat[row.orgUnit] = {}
        }
        if (
            !Object.prototype.hasOwnProperty.call(
                objectFormat[row.orgUnit],
                row.dataElement
            )
        ) {
            objectFormat[row.orgUnit][row.dataElement] = {}
        }
        if (
            !Object.prototype.hasOwnProperty.call(
                objectFormat[row.orgUnit][row.dataElement],
                row.period
            )
        ) {
            objectFormat[row.orgUnit][row.dataElement][row.period]
        }
        objectFormat[row.orgUnit][row.dataElement][row.period] = row.value
    }
    return objectFormat
}

const formatData = ({ data, ou, dx, filters }) => {
    const objectFormatData = convertToObjectFormat(data)
    let actualPeriods = [...new Set(data.map((datum) => datum.period))]
    // TBD: natural sort
    actualPeriods = actualPeriods.sort((a, b) =>
        a.localeCompare(b, 'en', { numeric: true })
    )

    const tableFormat = []
    for (const orgUnit of ou) {
        const table = {}

        table.title = !filters
            ? orgUnit
            : `${orgUnit} - ${filters
                  .map((filter) => filter.dimension)
                  .join(',')}`
        table.headers = [
            { name: i18n.t('Data') },
            ...actualPeriods.map((period) => ({ name: period })),
        ]
        const rows = []
        for (const dataElement of dx) {
            const rowData = actualPeriods.map(
                (period) =>
                    objectFormatData?.[orgUnit]?.[dataElement]?.[period] || ''
            )
            rows.push([dataElement, ...rowData])
        }

        table.rows = rows
        tableFormat.push(table)
    }

    return tableFormat
}

const Display = ({ requestName }) => {
    const { exchange } = useExchangeContext()

    const request = exchange.source?.requests?.find(
        (request) => request.name === requestName
    )

    const { dx, pe, ou, filters } = request || {}

    const { loading, error, data, refetch } = useDataQuery(query, {
        lazy: true,
    })

    useEffect(() => {
        if (dx && pe && ou) {
            refetch({ dx, pe, ou, filters })
        }
    }, [exchange, refetch, dx, pe, ou, filters])

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

    if (data && request) {
        const sortedPE = [...pe]
        sortedPE.sort()
        const formattedData = formatData({
            data: data.dataValueSet.dataValues,
            ou,
            dx,
            pe: sortedPE,
            filters,
        })
        return (
            <div className={styles.display}>
                {!request?.visualization && (
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={'https://www.dhis2.org'}
                        className={styles.linkNoDecoration}
                    >
                        <Button className={styles.visualizationButton}>
                            {i18n.t('Open this data in data visualizer')}
                        </Button>
                    </a>
                )}
                {/* {JSON.stringify(formattedData)} */}
                {formattedData.map((table) => (
                    <Table
                        key={table.title}
                        title={table.title}
                        columns={table.headers.map((h) => h.name)}
                        rows={table.rows}
                    />
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
