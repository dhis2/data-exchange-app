import i18n from '@dhis2/d2-i18n'
import { Box, ReactFinalForm } from '@dhis2/ui'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { EditExchangeFormContents } from './edit-exchange-form.js'
import styles from './edit-exchange.module.css'
import { EditItemFooter, EditRequestFooter } from './update-footer.js'

const { Form } = ReactFinalForm

const RequestEdit = ({ exitRequestEditMode, request }) => (
    <>
        <Form
            onSubmit={(requestValues, requestForm) => {
                console.log('request submit', { requestValues, requestForm })
            }}
        >
            {({ handleSubmit: handleRequestSubmit }) => (
                <>
                    <div className={styles.editArea}>
                        <div className={styles.editContainer}>
                            <h2 className={styles.editUpdateTitle}>
                                {i18n.t('Edit exchange: Edit request')}
                            </h2>
                            <Box className={styles.editFormArea}>
                                <>
                                    <span>
                                        Here you can edit an individual request
                                    </span>
                                    <pre>
                                        {JSON.stringify(request, null, 4)}
                                    </pre>
                                </>
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
    exitRequestEditMode: PropTypes.func,
    request: PropTypes.object,
}

export const EditExchange = ({ exchangeInfo }) => {
    const [requestEditInfo, setRequestEditInfo] = useState({
        editMode: false,
        request: null,
    })
    const exitRequestEditMode = useCallback(() => {
        setRequestEditInfo({ editMode: false, request: null })
    }, [setRequestEditInfo])
    const setRequestEditMode = useCallback(
        (request) => {
            setRequestEditInfo({ editMode: true, request })
        },
        [setRequestEditInfo]
    )

    return (
        <>
            <Form
                onSubmit={(values, form) => {
                    console.log('onSubmit', { values, form })
                }}
                initialValues={{
                    name: exchangeInfo.name,
                    type: exchangeInfo.target.type,
                    url: exchangeInfo.target.url,
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
                                        {i18n.t('Edit exchange')}
                                    </h2>
                                    <Box className={styles.editFormArea}>
                                        <EditExchangeFormContents
                                            exchangeInfo={exchangeInfo}
                                            setRequestEditMode={
                                                setRequestEditMode
                                            }
                                        />
                                    </Box>
                                </div>
                            </div>
                            <footer className={styles.bottomBar}>
                                <EditItemFooter handleSubmit={handleSubmit} />
                            </footer>
                        </div>
                        <div
                            className={classNames(styles.fullHeight, {
                                [styles.hidden]: !requestEditInfo.editMode,
                            })}
                        >
                            <RequestEdit
                                exitRequestEditMode={exitRequestEditMode}
                                request={requestEditInfo.request}
                            />
                        </div>
                    </>
                )}
            </Form>
        </>
    )
}

EditExchange.propTypes = {
    exchangeInfo: PropTypes.object,
}
