import { DataTableRow, DataTableCell, colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { DateField } from './DateField.jsx'
import { VisTypeIcon } from './VTI.jsx'

export const FileList = ({ data, onSelect, showVisTypeColumn }) => (
    <>
        {data.map((visualization) => (
            <DataTableRow key={visualization.id}>
                <DataTableCell
                    onClick={() =>
                        onSelect({
                            id: visualization.id,
                            name: visualization.displayName,
                            href: visualization.href,
                        })
                    }
                >
                    {visualization.displayName}
                </DataTableCell>
                {showVisTypeColumn && (
                    <DataTableCell align="center">
                        <VisTypeIcon
                            type={visualization.type}
                            useSmall
                            color={colors.grey600}
                        />
                    </DataTableCell>
                )}
                <DataTableCell>
                    <DateField date={visualization.created} />
                </DataTableCell>
                <DataTableCell>
                    <DateField date={visualization.lastUpdated} />
                </DataTableCell>
            </DataTableRow>
        ))}
    </>
)

FileList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            created: PropTypes.string.isRequired,
            displayName: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            lastUpdated: PropTypes.string.isRequired,
            type: PropTypes.string,
        })
    ).isRequired,
    onSelect: PropTypes.func.isRequired,
    showVisTypeColumn: PropTypes.bool,
}

export default FileList
