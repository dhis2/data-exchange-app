import { useDataQuery } from '@dhis2/app-runtime'
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
import React, { useEffect, useMemo } from 'react'
import styles from './requests-overview.module.css'

const ouNames = {
    organisationUnits: {
        resource: 'organisationUnits',
        params: ({ ousToRequest }) => ({
            fields: 'id,displayName',
            filter: `id:in:[${ousToRequest.join(',')}]`,
            paging: false,
        }),
    },
}

export const RequestsOverview = ({
    requestsInfo,
    setRequestEditMode,
    deleteRequest,
}) => {
    const ousToRequest = useMemo(
        () =>
            requestsInfo.reduce((ouSummary, req) => {
                ouSummary.push(req.ou[0])
                return ouSummary
            }, []),
        [requestsInfo]
    )
    const { data: ouInfo, refetch } = useDataQuery(ouNames, { lazy: true })
    const ouIdNameMap = new Map(
        ouInfo
            ? ouInfo.organisationUnits.organisationUnits.map(
                  ({ id, displayName }) => [id, displayName]
              )
            : []
    )

    useEffect(() => {
        refetch({ ousToRequest })
    }, [ousToRequest, refetch])

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
                                {request.ou?.length > 1
                                    ? i18n.t(
                                          '{{firstOuName}} and {{ouLength}} others',
                                          {
                                              firstOuName: ouIdNameMap.get(
                                                  request.ou[0]
                                              ),
                                              ouLength: request.ou.length - 1,
                                          }
                                      )
                                    : ouIdNameMap.get(request.ou[0])}
                            </DataTableCell>
                            <DataTableCell
                                onClick={() => setRequestEditMode(request)}
                            >
                                {request.pe.join(', ')}
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
                            <Button
                                small
                                className={styles.requestActionButton}
                            >
                                {i18n.t('Add request from visualization')}
                            </Button>
                        </DataTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </>
    )
}

RequestsOverview.propTypes = {
    deleteRequest: PropTypes.func,
    requestsInfo: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}
