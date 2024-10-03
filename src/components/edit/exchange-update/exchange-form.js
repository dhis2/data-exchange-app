import i18n from '@dhis2/d2-i18n'
import { Box, NoticeBox, ReactFinalForm } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AttributeProvider,
    useAppContext,
    useFeatureToggleContext,
    useUserContext,
} from '../../../context/index.js'
import { Loader } from '../../common/index.js'
import { RequestForm } from '../request-update/index.js'
import { EditItemFooter, EditTitle } from '../shared/index.js'
import { ExchangeFormContents } from './exchange-form-contents.js'
import styles from './exchange-form.module.css'
import { getInitialValuesFromExchange } from './getExchangeValues.js'
import { useRequests } from './useRequests.js'
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

export const ExchangeForm = ({ exchangeInfo, addMode }) => {
    const {
        requestEditInfo,
        setRequestEditMode,
        exitRequestEditMode,
        requestsState,
        requestsDispatch,
        deleteRequest,
        requestsTouched,
        setRequestsTouched,
    } = useRequests({ exchangeInfo })

    const { skipAuditDryRunImportStrategyAvailable } = useFeatureToggleContext()

    const { hasSkipAuditInfoAuthority } = useUserContext()

    const { refetchExchanges } = useAppContext()
    const navigate = useNavigate()
    const onComplete = useCallback(async () => {
        await refetchExchanges()
        navigate('/edit')
    }, [refetchExchanges, navigate])

    const [saveExchange, { loading: saving, error: error }] = useUpdateExchange(
        { onComplete }
    )

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
                        hasSkipAuditInfoAuthority,
                    })
                }}
                initialValues={getInitialValuesFromExchange({
                    exchangeInfo,
                    skipAuditDryRunImportStrategyAvailable,
                })}
            >
                {({ handleSubmit }) => (
                    <>
                        <div
                            className={classNames(styles.fullHeight, {
                                [styles.hidden]: requestEditInfo?.editMode,
                            })}
                        >
                            <div className={styles.editArea}>
                                <div
                                    className={styles.editContainer}
                                    data-test="add-exchange-title"
                                >
                                    <EditTitle
                                        title={
                                            addMode
                                                ? i18n.t('Add exchange')
                                                : i18n.t('Edit exchange')
                                        }
                                    />

                                    <Box className={styles.editFormArea}>
                                        {saving && (
                                            <span data-test="saving-exchange-loader">
                                                <Loader />
                                            </span>
                                        )}
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
                                            <ExchangeFormContents
                                                requestsState={requestsState}
                                                setRequestEditMode={
                                                    setRequestEditMode
                                                }
                                                deleteRequest={deleteRequest}
                                                skipAuditDryRunImportStrategyAvailable={
                                                    skipAuditDryRunImportStrategyAvailable
                                                }
                                                hasSkipAuditInfoAuthority={
                                                    hasSkipAuditInfoAuthority
                                                }
                                            />
                                        )}
                                    </Box>
                                </div>
                            </div>
                            <footer
                                className={styles.bottomBar}
                                data-test="edit-item-footer"
                            >
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
                                <RequestForm
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

ExchangeForm.propTypes = {
    addMode: PropTypes.bool,
    exchangeInfo: PropTypes.object,
}
