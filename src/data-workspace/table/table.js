import {
    DataTable,
    TableHead,
    DataTableRow,
    DataTableColumnHeader,
    TableBody,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import styles from './table.module.css'

// Needs to have the same width as the table, so can't use the one from
// @dhis2/ui
const DataTableToolbar = ({ children, columns }) => (
    <tr>
        <th className={styles.titleCell} colSpan={columns.toString()}>
            {children}
        </th>
    </tr>
)

DataTableToolbar.propTypes = {
    children: PropTypes.any.isRequired,
    columns: PropTypes.number.isRequired,
}

const Table = ({ title, columns, rows }) => (
    <>
        <DataTable className={styles.dataTable} width="auto">
            <TableHead>
                <DataTableToolbar columns={columns.length}>
                    {title}
                </DataTableToolbar>
                <DataTableRow>
                    <DataTableColumnHeader className={styles.cell}>
                        <span className={styles.labelCellContent}>
                            {columns[0]}
                        </span>
                    </DataTableColumnHeader>

                    {columns.slice(1).map((column) => {
                        return (
                            <DataTableColumnHeader
                                key={column}
                                className={styles.cell}
                            >
                                {column}
                            </DataTableColumnHeader>
                        )
                    })}
                </DataTableRow>
            </TableHead>
            <TableBody>
                {rows.map((row, index) => {
                    const [firstCell, ...cells] = row

                    return (
                        <DataTableRow key={index}>
                            <DataTableCell className={styles.cell}>
                                <span className={styles.labelCellContent}>
                                    {firstCell}
                                </span>
                            </DataTableCell>

                            {cells.map((value, index) => (
                                <DataTableCell
                                    key={index}
                                    className={styles.cell}
                                >
                                    {value}
                                </DataTableCell>
                            ))}
                        </DataTableRow>
                    )
                })}
            </TableBody>
        </DataTable>
    </>
)

Table.propTypes = {
    columns: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
}

export { Table }
