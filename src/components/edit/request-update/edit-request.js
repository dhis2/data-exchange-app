import i18n from '@dhis2/d2-i18n'
import { Box, ReactFinalForm } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { EditRequestFooter } from '../shared/index.js'
import styles from './edit-request.module.css'
import {
    getInitialValuesFromRequest,
    getRequestValuesFromForm,
} from './getRequestValues.js'
import { RequestEditForm } from './request-form.js'

const { Form } = ReactFinalForm

export const RequestEdit = ({
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
                    value: getRequestValuesFromForm({ requestValues }),
                    index: request.index,
                }
                requestsDispatch(action)
                setRequestsTouched(true)
            }}
            initialValues={getInitialValuesFromRequest({ request })}
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
