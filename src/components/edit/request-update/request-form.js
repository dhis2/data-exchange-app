import i18n from '@dhis2/d2-i18n'
import { Box, ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useFeatureToggleContext } from '../../../context/index.js'
import { Warning } from '../../common/index.js'
import { EditRequestFooter, EditTitle } from '../shared/index.js'
import {
    getInitialValuesFromRequest,
    getRequestValuesFromForm,
} from './getRequestValues.js'
import { RequestFormContents } from './request-form-contents.js'
import styles from './request-form.module.css'

const { Form } = ReactFinalForm

const RequestFormInner = React.memo(() => {
    return <RequestFormContents />
})

export const RequestForm = ({
    exitRequestEditMode,
    request,
    requestsDispatch,
    addModeRequest,
    setRequestsTouched,
}) => {
    const { outputDataItemIdSchemeAvailable } = useFeatureToggleContext()
    return (
        <>
            <Form
                onSubmit={(requestValues) => {
                    const action = {
                        type: addModeRequest ? 'ADD' : 'UPDATE',
                        value: getRequestValuesFromForm({
                            requestValues,
                            outputDataItemIdSchemeAvailable,
                        }),
                        index: request.index,
                    }
                    requestsDispatch(action)
                    setRequestsTouched(true)
                }}
                initialValues={getInitialValuesFromRequest({
                    request,
                    outputDataItemIdSchemeAvailable,
                })}
            >
                {({ handleSubmit: handleRequestSubmit }) => (
                    <>
                        <div className={styles.editArea}>
                            <div className={styles.editContainer}>
                                <EditTitle
                                    title={
                                        addModeRequest
                                            ? i18n.t(
                                                  'Edit exchange: Add request',
                                                  {
                                                      nsSeparator: '-:-',
                                                  }
                                              )
                                            : i18n.t(
                                                  'Edit exchange: Edit request',
                                                  {
                                                      nsSeparator: '-:-',
                                                  }
                                              )
                                    }
                                />

                                <Box className={styles.editFormArea}>
                                    {request.inputIdScheme === 'CODE' && (
                                        <Warning
                                            warning
                                            title={'inputIdScheme:code'}
                                        >
                                            <p>
                                                {i18n.t(
                                                    'This request currently uses inputIdScheme:code. The Data Exchange app does not support saving requests with inputIdScheme:code. If you save this request, it will be converted to inputIdScheme:uid.',
                                                    { nsSeparator: '-:-' }
                                                )}
                                            </p>
                                            <p>
                                                {i18n.t(
                                                    'Changing the inputIdScheme will change the internal representation of the request, but will not change the items in the request.'
                                                )}
                                            </p>
                                        </Warning>
                                    )}
                                    <RequestFormInner />
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
}

RequestForm.propTypes = {
    addModeRequest: PropTypes.bool,
    exitRequestEditMode: PropTypes.func,
    request: PropTypes.object,
    requestsDispatch: PropTypes.func,
    setRequestsTouched: PropTypes.func,
}
