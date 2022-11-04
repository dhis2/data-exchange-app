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
import { useExchangeContext } from '../exchange-context/index.js'
import { ConflictsDetailsTable } from './conflicts-details-table.js'
import styles from './success-content.module.css'

const importTypeConfig = {
    imported: {
        style: 'success',
        text: i18n.t('Imported'),
    },
    updated: {
        style: 'success',
        text: i18n.t('Updated'),
    },
    ignored: {
        style: 'ignored',
        text: i18n.t('Ignored'),
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
                    <span>{text.toLowerCase()}</span>
                </div>
            </div>
        </div>
    )
}
SummaryBox.propTypes = {
    importCount: PropTypes.number,
    importType: PropTypes.string,
}

const copyTableToClipboard = ({ importSummaries, requests }) => {
    const headerRowText = [
        i18n.t('Report'),
        i18n.t('Imported'),
        i18n.t('Updated'),
        i18n.t('Ignored'),
    ].join()
    const clipboardText = importSummaries.reduce(
        (fullText, importSummary, index) => {
            let requestName = requests?.[index]?.name ?? ''
            if (requests?.[index]?.name?.includes(',')) {
                requestName = `"${requests?.[index]?.name}"`
            }
            return (
                fullText +
                '\n' +
                [
                    requestName,
                    importSummary?.importCount?.imported,
                    importSummary?.importCount?.updated,
                    importSummary?.importCount?.ignored,
                ].join()
            )
        },
        headerRowText
    )

    navigator.clipboard.writeText(clipboardText)
}

const SummaryTable = ({ importSummaries }) => {
    const { exchange } = useExchangeContext()
    const [expandedRow, setExpandedRow] = useState(null)

    const expandToggle = (rowName) => {
        if (expandedRow === rowName) {
            setExpandedRow(null)
        } else {
            setExpandedRow(rowName)
        }
    }

    return (
        <div data-test="success-counts-table">
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
                        <DataTableColumnHeader />
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
                        <DataTableRow
                            key={exchange?.source?.requests[index]?.name}
                            expanded={
                                exchange?.source?.requests[index]?.name ===
                                expandedRow
                            }
                            onExpandToggle={() =>
                                expandToggle(
                                    exchange?.source?.requests[index]?.name
                                )
                            }
                            expandableContent={
                                importSummary.conflicts?.length > 0 ? (
                                    <ConflictsDetailsTable
                                        conflicts={importSummary.conflicts}
                                    />
                                ) : null
                            }
                        >
                            {!(importSummary.conflicts?.length > 0) && (
                                <DataTableCell></DataTableCell>
                            )}
                            <DataTableCell>
                                {exchange?.source?.requests[index]?.name}
                            </DataTableCell>
                            <DataTableCell>
                                {importSummary?.importCount?.imported}
                            </DataTableCell>
                            <DataTableCell>
                                {importSummary?.importCount?.updated}
                            </DataTableCell>
                            <DataTableCell>
                                {importSummary?.importCount?.ignored}
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
            <div className={styles.copyButton}>
                <Button
                    small
                    icon={<IconCopy16 />}
                    onClick={() => {
                        copyTableToClipboard({
                            importSummaries,
                            requests: exchange?.source?.requests,
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
    importSummaries: PropTypes.array,
}

const SuccessContent = ({ data }) => {
    const { importSummaries } = data

    importSummaries[0].conflicts = [
        {
            object: 'XpikOziyCXbM',
            value: 'Data element not found or not accessible: `XpikOziyCXbM`',
        },
        {
            object: 'O05mAByOgAv',
            value: 'Value must match value type of data element `O05mAByOgAv`: `Data value is not numeric...and then this message continues for a really long and unecessary amount of text`',
        },
    ]
    importSummaries[0].importCount.ignored = 2

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
    console.log(summaryCounts)
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
            <SummaryTable importSummaries={importSummaries} />
        </>
    )
}

SuccessContent.propTypes = {
    data: PropTypes.object,
}

export { SuccessContent }
