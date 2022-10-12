import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, IconLaunch16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeContext } from '../../exchange-context/index.js'
import { Warning } from '../../shared/index.js'
import { Table } from '../table/index.js'
import styles from './display.module.css'

// TBD re: data conversion for formatting

const convertToObjectFormat = ({
    data,
    dx_index,
    ou_index,
    pe_index,
    value_index,
}) => {
    const objectFormat = {}

    for (const row of data?.rows) {
        if (
            !Object.prototype.hasOwnProperty.call(objectFormat, row[ou_index])
        ) {
            objectFormat[row[ou_index]] = {}
        }
        if (
            !Object.prototype.hasOwnProperty.call(
                objectFormat[row[ou_index]],
                row[dx_index]
            )
        ) {
            objectFormat[row[ou_index]][row[dx_index]] = {}
        }
        if (
            !Object.prototype.hasOwnProperty.call(
                objectFormat[row[ou_index]][row[dx_index]],
                row[pe_index]
            )
        ) {
            objectFormat[row[ou_index]][row[dx_index]][row[pe_index]] = {}
        }
        objectFormat[row[ou_index]][row[dx_index]][row[pe_index]] =
            row[value_index]
    }
    return objectFormat
}

const formatData = (data) => {
    const constantDimensions = ['dx', 'pe', 'ou', 'co']
    const dx_index = data?.headers.findIndex((header) => header.name === 'dx')
    const ou_index = data?.headers.findIndex((header) => header.name === 'ou')
    const pe_index = data?.headers.findIndex((header) => header.name === 'pe')
    const value_index = data?.headers.findIndex(
        (header) => header.name === 'value'
    )
    const filters = Object.keys(data?.metaData?.dimensions).filter(
        (key) => !constantDimensions.includes(key)
    )

    const objectFormatData = convertToObjectFormat({
        data,
        dx_index,
        ou_index,
        pe_index,
        value_index,
    })

    const orgUnits = data.metaData?.dimensions?.ou.map((orgUnit) => ({
        id: orgUnit,
        name: data.metaData?.items[orgUnit]?.name,
    }))

    orgUnits.sort((a, b) => a.name.localeCompare(b.name))

    const dataElements = data.metaData?.dimensions?.dx.map((dataElement) => ({
        id: dataElement,
        name: data.metaData?.items[dataElement]?.name,
    }))

    dataElements.sort((a, b) => a.name.localeCompare(b.name))

    // TBD: natural sort? Is this necessary or is it sorted by backend?
    let periods = data.metaData?.dimensions?.pe.map((period) => ({
        id: period,
        name: data.metaData?.items[period]?.name,
    }))
    periods = periods.sort((a, b) =>
        a.id.localeCompare(b.id, 'en', { numeric: true })
    )

    const tableFormat = []
    for (const orgUnit of orgUnits) {
        const table = {}

        table.title =
            filters?.length > 0
                ? `${orgUnit.name} - ${filters
                      .map((filter) => data?.metaData?.items?.[filter]?.name)
                      .join(',')}`
                : orgUnit.name
        table.headers = [
            { name: i18n.t('Data') },
            ...periods.map(({ name }) => ({ name })),
        ]
        const rows = []
        for (const dataElement of dataElements) {
            const rowData = periods.map(
                (period) =>
                    objectFormatData?.[orgUnit.id]?.[dataElement.id]?.[
                        period.id
                    ] || ''
            )
            rows.push([dataElement.name, ...rowData])
        }

        table.rows = rows
        tableFormat.push(table)
    }

    return tableFormat
}

const Display = ({ requestIndex }) => {
    const { exchange, exchangeData } = useExchangeContext()
    const request = exchange.source?.requests?.[requestIndex]

    const formattedData = formatData(exchangeData?.[requestIndex])

    const { baseUrl } = useConfig()

    if (exchangeData?.rows?.length === 0) {
        return (
            <div className={styles.display}>
                <Warning title={i18n.t('No data')}>
                    <span>{i18n.t('There is no data for this report')}</span>
                </Warning>
            </div>
        )
    }

    if (exchangeData) {
        return (
            <div className={styles.display}>
                {request?.visualization && (
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={`${baseUrl}/dhis-web-data-visualizer/#/${request.visualization}`}
                        className={styles.linkNoDecoration}
                    >
                        <Button
                            icon={<IconLaunch16 />}
                            className={styles.visualizationButton}
                        >
                            {i18n.t('Open in data visualizer')}
                        </Button>
                    </a>
                )}
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

    // if exchangeData is missing, return null
    return null
}

Display.propTypes = {
    requestIndex: PropTypes.number,
}

export { Display }
