import i18n from '@dhis2/d2-i18n'
import {
    Button,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    IconCheckmarkCircle16,
    IconError16,
    IconCopy16,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useExchangeContext } from '../../../context/index'
import { ConflictsDetailsTable } from './conflicts-details-table'
import styles from './success-content.module.css'

const importTypeConfig = {
    imported: {
        style: 'success',
        text: i18n.t('imported'),
    },
    updated: {
        style: 'success',
        text: i18n.t('updated'),
    },
    ignored: {
        style: 'ignored',
        text: i18n.t('ignored'),
    },
}

const SummaryBox = ({ importType, importCount }) => {
    const { text, style: styleName } = importTypeConfig[importType]
    const boxStyle = styles[styleName]

    return (
        <div className={styles.summaryBox}>
            <div className={boxStyle}>
                <div className={styles.count}>{importCount}</div>
                <div className={styles.label}>
                    <span>{i18n.t(text)}</span>
                </div>
            </div>
        </div>
    )
}
SummaryBox.propTypes = {
    importCount: PropTypes.number,
    importType: PropTypes.string,
}

const getConflictLines = (conflicts) => {
    if (!conflicts) {
        return ''
    }
    return conflicts
        .map((conflict) => `${conflict.object}: ${conflict.value}`)
        .join('\n')
}

const copyTableToClipboard = ({
    exchangeName,
    exchangeURL,
    importSummaries,
    summaryCounts,
    requests,
    dataSubmitted,
}) => {
    let text = ''
    const exchangeNameLine = i18n.t('Exchange: {{- exchangeName}}', {
        exchangeName,
        nsSeparator: '-:-',
    })
    const targetURLLine = i18n.t('Target URL: {{- exchangeURL}}', {
        exchangeURL: decodeURI(exchangeURL),
        nsSeparator: '-:-',
    })
    const runDateLine = i18n.t('Run date: {{- runDate}}', {
        runDate: dataSubmitted,
        nsSeparator: '-:-',
    })

    if (exchangeURL) {
        text += `${exchangeNameLine}\n${targetURLLine}`
    } else {
        text += exchangeNameLine
    }
    text += '\n' + runDateLine + '\n\n\n' + i18n.t('SUMMARY') + '\n'

    const summaryLine = i18n.t(
        'Imported: {{importedCount}}, Updated: {{updatedCount}}, Ignored: {{ignoredCount}}',
        {
            importedCount: summaryCounts.imported,
            updatedCount: summaryCounts.updated,
            ignoredCount: summaryCounts.ignored,
            nsSeparator: '-:-',
        }
    )
    text += summaryLine + '\n\n\n' + i18n.t('DETAILS')

    const detailsText = importSummaries.reduce(
        (fullText, importSummary, index) => {
            let requestName = requests?.[index]?.name ?? ''
            if (requests?.[index]?.name?.includes(',')) {
                requestName = `"${requests?.[index]?.name}"`
            }
            const requestNameLine = i18n.t('Report: {{- requestName}}', {
                requestName,
                nsSeparator: '-:-',
            })
            const importedCount = importSummary.importCount?.imported
            const ignoredCount = importSummary.importCount?.ignored
            const updatedCount = importSummary.importCount?.updated
            const summaryCountLine = i18n.t(
                'Imported: {{importedCount}}, Updated: {{updatedCount}}, Ignored: {{ignoredCount}}',
                {
                    importedCount,
                    updatedCount,
                    ignoredCount,
                    nsSeparator: '-:-',
                }
            )
            const conflictLines = getConflictLines(importSummary.conflicts)
            return (
                fullText +
                '\n\n' +
                requestNameLine +
                '\n' +
                summaryCountLine +
                '\n' +
                conflictLines
            )
        },
        ''
    )

    text += detailsText

    navigator.clipboard.writeText(text)
}

const SummaryRow = ({
    importSummary,
    exchangeName,
    expandedRows,
    expandToggle,
    hasConflicts,
}) => {
    const rowHasConflicts = importSummary.conflicts?.length > 0
    const showPaddingCell = hasConflicts && !rowHasConflicts

    return (
        <DataTableRow
            expanded={expandedRows.includes(exchangeName)}
            onExpandToggle={
                rowHasConflicts ? () => expandToggle(exchangeName) : undefined
            }
            expandableContent={
                rowHasConflicts ? (
                    <ConflictsDetailsTable
                        conflicts={importSummary.conflicts}
                    />
                ) : undefined
            }
        >
            {showPaddingCell && <DataTableCell></DataTableCell>}
            <DataTableCell>{exchangeName}</DataTableCell>
            <DataTableCell>{importSummary.importCount?.imported}</DataTableCell>
            <DataTableCell>{importSummary.importCount?.updated}</DataTableCell>
            <DataTableCell>{importSummary.importCount?.ignored}</DataTableCell>
        </DataTableRow>
    )
}

SummaryRow.propTypes = {
    exchangeName: PropTypes.string,
    expandToggle: PropTypes.func,
    expandedRows: PropTypes.array,
    hasConflicts: PropTypes.bool,
    importSummary: PropTypes.object,
}

const SummaryTable = ({
    importSummaries,
    summaryCounts,
    hasConflicts,
    dataSubmitted,
}) => {
    const { exchange } = useExchangeContext()
    const [expandedRows, setExpandedRows] = useState([])

    const expandToggle = (rowName) => {
        if (expandedRows.includes(rowName)) {
            setExpandedRows(expandedRows.filter((row) => row !== rowName))
        } else {
            setExpandedRows([...expandedRows, rowName])
        }
    }

    return (
        <div data-test="success-counts-table">
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        {hasConflicts && <DataTableColumnHeader />}
                        <DataTableColumnHeader>
                            {i18n.t('Report')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Imported')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Updated')}
                        </DataTableColumnHeader>
                        <DataTableColumnHeader>
                            {i18n.t('Ignored')}
                        </DataTableColumnHeader>
                    </DataTableRow>
                </DataTableHead>
                <DataTableBody>
                    {importSummaries.map((importSummary, index) => (
                        <SummaryRow
                            key={`${exchange?.source?.requests[index]?.name}-summary`}
                            importSummary={importSummary}
                            exchangeName={
                                exchange?.source?.requests[index]?.name
                            }
                            expandedRows={expandedRows}
                            expandToggle={expandToggle}
                            hasConflicts={hasConflicts}
                        />
                    ))}
                </DataTableBody>
            </DataTable>
            <div className={styles.copyButton}>
                <Button
                    small
                    icon={<IconCopy16 />}
                    onClick={() => {
                        copyTableToClipboard({
                            exchangeName: exchange.displayName,
                            exchangeURL: exchange.target?.api?.url,
                            importSummaries,
                            summaryCounts,
                            requests: exchange?.source?.requests,
                            dataSubmitted,
                        })
                    }}
                >
                    {i18n.t('Copy summary to clipboard')}
                </Button>
            </div>
        </div>
    )
}

SummaryTable.propTypes = {
    dataSubmitted: PropTypes.string,
    hasConflicts: PropTypes.bool,
    importSummaries: PropTypes.array,
    summaryCounts: PropTypes.object,
}

const SuccessContent = ({ data, dataSubmitted }) => {
    const importSummaries =
        data?.importSummaries ?? data?.response?.importSummaries

    const summaryCounts = importSummaries.reduce(
        (totalCounts, importSummary) => {
            for (const countType in importSummary?.importCount) {
                totalCounts[countType] +=
                    importSummary.importCount?.[countType] || 0
            }
            totalCounts.conflicts += importSummary.conflicts?.length || 0
            return totalCounts
        },
        { imported: 0, updated: 0, ignored: 0, deleted: 0, conflicts: 0 }
    )

    return (
        <>
            <Tag positive icon={<IconCheckmarkCircle16 />}>
                {i18n.t('Data submitted successfully.')}
            </Tag>
            {summaryCounts.conflicts > 0 && (
                <span className={styles.tagWrapper}>
                    <Tag negative icon={<IconError16 />}>
                        {i18n.t('Conflicts')}
                    </Tag>
                </span>
            )}

            <div className={styles.summaryBoxTitle}>{i18n.t('Summary')}</div>

            <div className={styles.summaryBoxWrapper}>
                <SummaryBox
                    importType="imported"
                    importCount={summaryCounts.imported}
                />
                <SummaryBox
                    importType="updated"
                    importCount={summaryCounts.updated}
                />
                <SummaryBox
                    importType="ignored"
                    importCount={summaryCounts.ignored}
                />
            </div>
            <SummaryTable
                importSummaries={importSummaries}
                summaryCounts={summaryCounts}
                hasConflicts={summaryCounts.conflicts > 0}
                dataSubmitted={dataSubmitted}
            />
        </>
    )
}

SuccessContent.propTypes = {
    data: PropTypes.object,
    dataSubmitted: PropTypes.bool,
}

export { SuccessContent }
