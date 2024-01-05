import { useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Box, ReactFinalForm } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../../app-context/use-app-context.js'
import { RequestEditForm } from '../request-update/request-form.js'
import { requestsReducer } from '../request-update/requests-reducer.js'
import { EditExchangeFormContents } from './edit-exchange-form.js'
import styles from './edit-exchange.module.css'
import { getExchangeValuesFromForm } from './getExchangeValues.js'
import { EditItemFooter, EditRequestFooter } from './update-footer.js'

const { Form } = ReactFinalForm

const RequestEdit = ({
    exitRequestEditMode,
    request,
    requestsDispatch,
    addModeRequest,
}) => (
    <>
        <Form
            onSubmit={(requestValues) => {
                const action = {
                    type: addModeRequest ? 'ADD' : 'UPDATE',
                    value: {
                        name: requestValues.requestName,
                        ...requestValues,
                    },
                    index: request.index,
                }
                requestsDispatch(action)
            }}
            initialValues={{
                requestName: request?.name,
                pe: request?.pe ?? [],
                ou: request?.ou ?? ['O6uvpzGd5pu'],
                dx: request?.dx ?? ['fbfJHSPpUQD'],
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
}

// -------------------------

const createExchange = {
    resource: 'aggregateDataExchanges',
    type: 'create',
    data: (exchange) => exchange,
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

    const [addExchange, { loading: saving }] = useDataMutation(createExchange, {
        onComplete: async () => {
            console.log('saved exchange')
            await refetchExchanges()
            navigate('/edit')
        },
    })

    return (
        <>
            <Form
                onSubmit={(values, form) => {
                    console.log('onSubmit', { values, form })
                    if (addMode) {
                        addExchange(
                            getExchangeValuesFromForm({
                                values,
                                requests: requestsState,
                            })
                        )
                    }
                }}
                initialValues={{
                    name: exchangeInfo.name,
                    type: exchangeInfo.target?.type,
                    url: exchangeInfo.target?.url,
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
                                        {saving && <p>saving...</p>}
                                        <EditExchangeFormContents
                                            requestsState={requestsState}
                                            setRequestEditMode={
                                                setRequestEditMode
                                            }
                                            deleteRequest={deleteRequest}
                                        />
                                    </Box>
                                </div>
                            </div>
                            <footer className={styles.bottomBar}>
                                <EditItemFooter handleSubmit={handleSubmit} />
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
                                />
                            </div>
                        )}
                    </>
                )}
            </Form>
        </>
    )
}

EditExchange.propTypes = {
    addMode: PropTypes.bool,
    exchangeInfo: PropTypes.object,
}
