import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Table,
    TableHead,
    TableCellHead,
    TableRowHead,
    TableBody,
    TableRow,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import {
    ouLevelPrefix,
    ouGroupPrefix,
} from '../../../hooks/useFetchExchange.js'
import styles from './requests-overview.module.css'

const getOuText = ({ ouInfo }) => {
    const orgUnits = ouInfo.filter(
        ({ id }) =>
            !id.startsWith(ouLevelPrefix) && !id.startsWith(ouGroupPrefix)
    )
    const orgUnitLevels = ouInfo.filter(({ id }) =>
        id.startsWith(ouLevelPrefix)
    )
    const orgUnitGroups = ouInfo.filter(({ id }) =>
        id.startsWith(ouGroupPrefix)
    )
    let orgUnitString = ''
    if (orgUnits.length === 1) {
        orgUnitString += orgUnits[0].name
    }
    if (orgUnits.length > 1) {
        orgUnitString += i18n.t('{{firstOuName}} and {{ouLength}} others', {
            firstOuName: ouInfo[0].name,
            ouLength: ouInfo.length - 1,
        })
    }
    if (orgUnitLevels.length > 0) {
        orgUnitString += i18n.t('; levels: {{levelCount}}', {
            levelCount: orgUnitLevels.length,
        })
    }
    if (orgUnitGroups.length > 0) {
        orgUnitString += i18n.t('; groups: {{groupsCount}}', {
            groupsCount: orgUnitGroups.length,
        })
    }
    return orgUnitString
}

export const RequestsOverview = ({
    requestsInfo,
    setRequestEditMode,
    deleteRequest,
}) => (
    <>
        <Table suppressZebraStriping>
            <TableHead>
                <TableRowHead>
                    <TableCellHead>{i18n.t('Name')}</TableCellHead>
                    <TableCellHead>{i18n.t('Org. units')}</TableCellHead>
                    <TableCellHead>{i18n.t('Periods')}</TableCellHead>
                    <TableCellHead>{i18n.t('Data items')}</TableCellHead>
                    <TableCellHead>{i18n.t('Visualization')}</TableCellHead>
                    <TableCellHead></TableCellHead>
                </TableRowHead>
            </TableHead>
            <TableBody>
                {requestsInfo.map((request) => (
                    <TableRow key={request.name}>
                        <DataTableCell
                            onClick={() => setRequestEditMode(request)}
                        >
                            {request.name}
                        </DataTableCell>
                        <DataTableCell
                            onClick={() => setRequestEditMode(request)}
                        >
                            {getOuText({ ouInfo: request.ouInfo })}
                        </DataTableCell>
                        <DataTableCell
                            onClick={() => setRequestEditMode(request)}
                        >
                            {request.peInfo.map(({ name }) => name).join(', ')}
                        </DataTableCell>
                        <DataTableCell
                            onClick={() => setRequestEditMode(request)}
                        >
                            {request.dx.length}
                        </DataTableCell>
                        <DataTableCell>
                            {request.visualization ?? ''}
                        </DataTableCell>
                        <DataTableCell>
                            <Button
                                small
                                secondary
                                destructive
                                onClick={() => {
                                    deleteRequest(request.index)
                                }}
                            >
                                Delete
                            </Button>
                        </DataTableCell>
                    </TableRow>
                ))}
                <TableRow>
                    <DataTableCell>
                        <Button
                            small
                            onClick={() => setRequestEditMode({}, true)}
                        >
                            {i18n.t('Add request manually')}
                        </Button>
                        <Button small className={styles.requestActionButton}>
                            {i18n.t('Add request from visualization')}
                        </Button>
                    </DataTableCell>
                </TableRow>
            </TableBody>
        </Table>
    </>
)

RequestsOverview.propTypes = {
    deleteRequest: PropTypes.func,
    requestsInfo: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}
