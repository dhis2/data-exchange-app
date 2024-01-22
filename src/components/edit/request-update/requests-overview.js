import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    Button,
    ButtonStrip,
    Table,
    TableHead,
    TableCellHead,
    TableRowHead,
    TableBody,
    TableRow,
    DataTableCell,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useUserContext } from '../../../context/index.js'
import {
    ouLevelPrefix,
    ouGroupPrefix,
} from '../../../hooks/useFetchExchange.js'
import { OpenFileDialog } from './openVisualization/OpenFileDialog.js'
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
            nsSeparator: '-:-',
        })
    }
    if (orgUnitGroups.length > 0) {
        orgUnitString += i18n.t('; groups: {{groupsCount}}', {
            groupsCount: orgUnitGroups.length,
            nsSeparator: '-:-',
        })
    }
    return orgUnitString
}

const EmptyTableInfo = () => (
    <DataTableCell colspan="6">
        <div className={styles.emptyTableWrapper}>
            <p className={styles.emptyTableHeader}>{i18n.t('No requests')}</p>
            <p className={styles.emptyTableText}>
                {i18n.t(
                    'Click on buttons below to add a new request. Exchanges must contain at least one request.'
                )}
            </p>
        </div>
    </DataTableCell>
)

export const RequestsOverview = ({
    requestsInfo,
    setRequestEditMode,
    deleteRequest,
}) => {
    const [visualizationDialogOpen, setVisualizationDialogOpen] =
        useState(false)
    const { baseUrl } = useConfig()
    const currentUser = useUserContext()

    return (
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
                    {requestsInfo.length === 0 ? (
                        <EmptyTableInfo />
                    ) : (
                        requestsInfo.map((request) => (
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
                                    {request.peInfo
                                        .map(({ name }) => name)
                                        .join(', ')}
                                </DataTableCell>
                                <DataTableCell
                                    onClick={() => setRequestEditMode(request)}
                                >
                                    {request.dx.length}
                                </DataTableCell>
                                <DataTableCell>
                                    {request.visualizationInfo?.id ? (
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={`${baseUrl}/dhis-web-data-visualizer/index.html#/${request.visualizationInfo.id}`}
                                        >
                                            {request.visualizationInfo?.name ??
                                                ''}
                                        </a>
                                    ) : (
                                        <span>
                                            {request.visualizationInfo?.name ??
                                                ''}
                                        </span>
                                    )}
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
                        ))
                    )}
                </TableBody>
            </Table>
            <ButtonStrip className={styles.buttonContainer}>
                <Button small onClick={() => setRequestEditMode({}, true)}>
                    {i18n.t('Add request manually')}
                </Button>
                <Button
                    small
                    className={styles.requestActionButton}
                    onClick={() => setVisualizationDialogOpen(true)}
                >
                    {i18n.t('Add request from visualization [TO DO]')}
                </Button>
            </ButtonStrip>
            <OpenFileDialog
                type="visualization"
                open={visualizationDialogOpen}
                onClose={() => {
                    setVisualizationDialogOpen(false)
                }}
                onNew={() => {
                    console.log('Not supported')
                }} // this prop is not relevant, but required
                onFileSelect={() => {}}
                currentUser={currentUser}
            />
        </>
    )
}

RequestsOverview.propTypes = {
    deleteRequest: PropTypes.func,
    requestsInfo: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}
