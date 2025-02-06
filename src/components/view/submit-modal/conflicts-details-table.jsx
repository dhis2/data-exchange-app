import i18n from '@dhis2/d2-i18n'
import {
    Table,
    TableBody,
    TableCell,
    TableCellHead,
    TableHead,
    TableRow,
    TableRowHead,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './conflicts-details-table.module.css'

const ConflictsDetailsTable = ({ conflicts }) => {
    return (
        <>
            <span className={styles.label}>{i18n.t('Conflicts')}</span>
            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead>{i18n.t('Object')}</TableCellHead>
                        <TableCellHead>{i18n.t('Value')}</TableCellHead>
                    </TableRowHead>
                </TableHead>
                <TableBody>
                    {conflicts.map((c, i) => (
                        <TableRow
                            key={`job-summary-conflicts-${c.object}-${i}`}
                        >
                            <TableCell>{c.object}</TableCell>
                            <TableCell>{c.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}

ConflictsDetailsTable.propTypes = {
    conflicts: PropTypes.array,
}

export { ConflictsDetailsTable }
