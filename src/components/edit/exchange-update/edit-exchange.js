import i18n from '@dhis2/d2-i18n'
import { Box, NoticeBox, ReactFinalForm } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AttributeProvider, useAppContext } from '../../../context/index.js'
import { Loader } from '../../shared/index.js'
import { RequestEditForm } from '../request-update/request-form.js'
import { requestsReducer } from '../request-update/requests-reducer.js'
import { SCHEME_TYPES } from '../shared/scheme-selector.js'
import {
    AUTHENTICATION_TYPES,
    EditExchangeFormContents,
} from './edit-exchange-form.js'
import styles from './edit-exchange.module.css'
import { EditItemFooter, EditRequestFooter } from './update-footer.js'
import { useUpdateExchange } from './useUpdateExchange.js'

const { Form } = ReactFinalForm

const formatError = (error) => {
    if (error.details?.response?.errorReports?.length > 0) {
        return error.details.response.errorReports.reduce(
            (stringified, rep) => {
                if (rep.message) {
                    return stringified + `\n${rep.message}`
                }
                return stringified
            },
            ''
        )
    }
    return error?.message
}

const RequestEdit = ({
    exitRequestEditMode,
    request,
    requestsDispatch,
    addModeRequest,
    setRequestsTouched,
}) => (
    <>
        <Form
            onSubmit={(requestValues) => {
                const action = {
                    type: addModeRequest ? 'ADD' : 'UPDATE',
                    value: {
                        ...requestValues,
                        name: requestValues.requestName,
                        dx: requestValues?.dxInfo.map(({ id }) => id),
                        pe: requestValues?.peInfo.map(({ id }) => id),
                        ou: requestValues?.ouInfo.map(({ id }) => id),
                        visualization: requestValues.visualizationLinked
                            ? requestValues?.visualizationInfo?.id
                            : null,
                        filters: !requestValues.filtersUsed
                            ? []
                            : requestValues?.filtersInfo.map((filter) => ({
                                  ...filter,
                                  items: filter.items.map(({ id }) => id),
                              })),
                        filtersInfo: !requestValues.filtersUsed
                            ? null
                            : requestValues.filtersInfo,
                        visualizationInfo: !requestValues.visualizationLinked
                            ? null
                            : requestValues.visualizationInfo,
                        outputIdScheme:
                            requestValues.source_outputIdScheme !==
                            SCHEME_TYPES.attribute
                                ? requestValues.source_outputIdScheme
                                : `ATTRIBUTE:${requestValues.source_outputIdScheme_attribute}`,
                        outputOrgUnitIdScheme:
                            requestValues.source_outputOrgUnitIdScheme !==
                            SCHEME_TYPES.attribute
                                ? requestValues.source_outputIdScheme
                                : `ATTRIBUTE:${requestValues.source_outputOrgUnitIdScheme_attribute}`,
                        outputDataElementIdScheme:
                            requestValues.source_outputDataElementIdScheme !==
                            SCHEME_TYPES.attribute
                                ? requestValues.source_outputIdScheme
                                : `ATTRIBUTE:${requestValues.source_outputDataElementIdScheme_attribute}`,
                    },
                    index: request.index,
                }
                requestsDispatch(action)
                setRequestsTouched(true)
            }}
            initialValues={{
                requestName: request?.name,
                peInfo: request?.peInfo ?? [],
                ouInfo: request?.ouInfo ?? [],
                dxInfo: request?.dxInfo ?? [],
                filtersUsed: request?.filtersInfo?.length > 0,
                filtersInfo: request?.filtersInfo ?? [{ dimension: null }],
                visualizationLinked: Boolean(request.visualization),
                visualizationInfo: request?.visualizationInfo ?? null,
                source_outputIdScheme: request?.outputIdScheme
                    ? request.outputIdScheme.split(':')[0]
                    : SCHEME_TYPES.uid,
                source_outputIdScheme_attribute:
                    request?.outputIdScheme?.split(':')?.[1] ?? null,
                source_outputDataElementIdScheme:
                    request?.outputDataElementIdScheme
                        ? request.outputDataElementIdScheme.split(':')[0]
                        : SCHEME_TYPES.uid,
                source_outputDataElementIdScheme_attribute:
                    request?.outputDataElementIdScheme?.split(':')?.[1] ?? null,
                source_outputOrgUnitIdScheme: request?.outputOrgUnitIdScheme
                    ? request?.outputOrgUnitIdScheme.split(':')[0]
                    : SCHEME_TYPES.uid,
                source_outputOrgUnitIdScheme_attribute:
                    request?.outputOrgUnitIdScheme?.split(':')?.[1] ?? null,
            }}
        >
            {({ handleSubmit: handleRequestSubmit }) => (
                <>
                    <div className={styles.editArea}>
                        <div className={styles.editContainer}>
                            <h2 className={styles.editUpdateTitle}>
                                {addModeRequest
                                    ? i18n.t('Edit exchange: Add request', {
                                          nsSeparator: '-:-',
                                      })
                                    : i18n.t('Edit exchange: Edit request', {
                                          nsSeparator: '-:-',
                                      })}
                            </h2>
                            <Box className={styles.editFormArea}>
                                <RequestEditForm />
                            </Box>
                        </div>
                    </div>
                    <footer className={styles.bottomBar}>
                        <EditRequestFooter
                            handleRequestSubmit={handleRequestSubmit}
                            exitRequestEditMode={exitRequestEditMode}
                        />
                    </footer>
                </>
            )}
        </Form>
    </>
)

RequestEdit.propTypes = {
    addModeRequest: PropTypes.bool,
    exitRequestEditMode: PropTypes.func,
    request: PropTypes.object,
    requestsDispatch: PropTypes.func,
    setRequestsTouched: PropTypes.func,
}

export const EditExchange = ({ exchangeInfo, addMode }) => {
    const { refetchExchanges } = useAppContext()
    const navigate = useNavigate()
    const [requestEditInfo, setRequestEditInfo] = useState({
        editMode: false,
        request: null,
    })
    const exitRequestEditMode = useCallback(() => {
        setRequestEditInfo({ editMode: false, request: null })
    }, [setRequestEditInfo])
    const setRequestEditMode = useCallback(
        (request, addModeRequest = false) => {
            setRequestEditInfo({ editMode: true, request, addModeRequest })
        },
        [setRequestEditInfo]
    )
    const [requestsState, requestsDispatch] = useReducer(
        requestsReducer,
        exchangeInfo?.source?.requests ?? []
    )
    const deleteRequest = useCallback((index) => {
        requestsDispatch({ type: 'DELETE', index })
    }, [])

    const onComplete = useCallback(async () => {
        await refetchExchanges()
        navigate('/edit')
    }, [refetchExchanges, navigate])

    const [saveExchange, { loading: saving, error: error }] = useUpdateExchange(
        { onComplete }
    )
    const [requestsTouched, setRequestsTouched] = useState(false)

    return (
        <AttributeProvider>
            <Form
                onSubmit={(values, form) => {
                    saveExchange({
                        values,
                        form,
                        id: exchangeInfo?.id,
                        requests: requestsState,
                        requestsTouched,
                        newExchange: addMode,
                    })
                }}
                initialValues={{
                    name: exchangeInfo.name,
                    type: exchangeInfo.target?.type,
                    authentication: exchangeInfo.target?.api?.username
                        ? AUTHENTICATION_TYPES.basic
                        : AUTHENTICATION_TYPES.pat,
                    url: exchangeInfo.target?.api?.url,
                    username: exchangeInfo.target?.api?.username,
                    target_idScheme: exchangeInfo.target?.request?.idScheme
                        ? exchangeInfo.target.request.idScheme.split(':')[0]
                        : SCHEME_TYPES.uid,
                    target_idScheme_attribute:
                        exchangeInfo.target?.request?.idScheme.split(':')[1],
                    target_orgUnitIdScheme: exchangeInfo.target?.request
                        ?.orgUnitIdScheme
                        ? exchangeInfo.target.request.orgUnitIdScheme.split(
                              ':'
                          )[0]
                        : SCHEME_TYPES.uid,
                    target_orgUnitIdScheme_attribute:
                        exchangeInfo.target?.request?.orgUnitIdScheme?.split(
                            ':'
                        )[1],
                    target_dataElementIdScheme: exchangeInfo.target?.request
                        ?.dataElementIdScheme
                        ? exchangeInfo.target.request.dataElementIdScheme.split(
                              ':'
                          )[0]
                        : SCHEME_TYPES.uid,
                    target_dataElementIdScheme_attribute:
                        exchangeInfo.target?.request?.dataElementIdScheme?.split(
                            ':'
                        )[1],
                    target_categoryOptionComboIdScheme: exchangeInfo.target
                        ?.request?.categoryOptionComboIdScheme
                        ? exchangeInfo.target?.request?.categoryOptionComboIdScheme.split(
                              ':'
                          )[0]
                        : SCHEME_TYPES.uid,
                    target_categoryOptionComboIdScheme_attribute:
                        exchangeInfo.target?.request?.categoryOptionComboIdScheme?.split(
                            ':'
                        )[1],
                }}
            >
                {({ handleSubmit }) => (
                    <>
                        <div
                            className={classNames(styles.fullHeight, {
                                [styles.hidden]: requestEditInfo?.editMode,
                            })}
                        >
                            <div className={styles.editArea}>
                                <div className={styles.editContainer}>
                                    <h2 className={styles.editUpdateTitle}>
                                        {addMode
                                            ? i18n.t('Add exchange')
                                            : i18n.t('Edit exchange')}
                                    </h2>
                                    <Box className={styles.editFormArea}>
                                        {saving && <Loader />}
                                        {error && (
                                            <NoticeBox
                                                error
                                                title={i18n.t('Could not save')}
                                                className={
                                                    styles.errorBoxContainer
                                                }
                                            >
                                                {formatError(error)}
                                            </NoticeBox>
                                        )}
                                        {!saving && (
                                            <EditExchangeFormContents
                                                requestsState={requestsState}
                                                setRequestEditMode={
                                                    setRequestEditMode
                                                }
                                                deleteRequest={deleteRequest}
                                            />
                                        )}
                                    </Box>
                                </div>
                            </div>
                            <footer className={styles.bottomBar}>
                                <EditItemFooter
                                    handleSubmit={handleSubmit}
                                    requestsTouched={requestsTouched}
                                />
                            </footer>
                        </div>
                        {!requestEditInfo.editMode ? null : (
                            <div
                                className={classNames(styles.fullHeight, {
                                    [styles.hidden]: !requestEditInfo.editMode,
                                })}
                            >
                                <RequestEdit
                                    exitRequestEditMode={exitRequestEditMode}
                                    request={requestEditInfo.request}
                                    requestsDispatch={requestsDispatch}
                                    addModeRequest={
                                        requestEditInfo.addModeRequest
                                    }
                                    setRequestsTouched={setRequestsTouched}
                                />
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AttributeProvider>
    )
}

EditExchange.propTypes = {
    addMode: PropTypes.bool,
    exchangeInfo: PropTypes.object,
}
