import i18n from '@dhis2/d2-i18n'
import {
    Button,
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableColumnHeader,
    DataTableHead,
    DataTableRow,
    IconCheckmarkCircle24,
    IconCopy16,
    Tag,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useExchangeContext } from '../exchange-context/index.js'
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
    let clipboardText = `${i18n.t('Report')}\t${i18n.t('Imported')}\t${i18n.t(
        'Updated'
    )}\t${i18n.t('Ignored')}\t\n`
    clipboardText += importSummaries
        .map(
            (importSummary, index) =>
                `${requests?.[index]?.name}\t${importSummary?.importCount?.imported}\t${importSummary?.importCount?.updated}\t${importSummary?.importCount?.ignored}`
        )
        .join('\n')
    navigator.clipboard.writeText(clipboardText)
}

const SummaryTable = ({ importSummaries }) => {
    const { exchange } = useExchangeContext()

    return (
        <>
            <DataTable>
                <DataTableHead>
                    <DataTableRow>
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
                        >
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
        </>
    )
}

SummaryTable.propTypes = {
    importSummaries: PropTypes.array,
}

const SuccessContent = ({ data }) => {
    const summaryCounts = data?.importSummaries.reduce(
        (totalCounts, importSummary) => {
            for (const countType in importSummary?.importCount) {
                totalCounts[countType] +=
                    importSummary.importCount[countType] || 0
            }
            return totalCounts
        },
        { imported: 0, updated: 0, ignored: 0, deleted: 0 }
    )
    return (
        <>
            <Tag positive icon={<IconCheckmarkCircle24 />}>
                {i18n.t('Data submitted successfully.')}
            </Tag>
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
            <SummaryTable importSummaries={data?.importSummaries} />
        </>
    )
}

SuccessContent.propTypes = {
    data: PropTypes.object,
}

export { SuccessContent }
