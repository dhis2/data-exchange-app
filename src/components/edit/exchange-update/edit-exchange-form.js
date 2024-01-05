import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Field as FieldContainer,
    IconHome24,
    IconWorld24,
    InputFieldFF,
    RadioFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { RequestsOverview } from '../request-update/requests-overview.js'
import styles from './edit-exchange-form.module.css'
import { Subsection } from './form-subsection.js'

const { Field, useField } = ReactFinalForm

export const EXCHANGE_TYPES = {
    external: 'EXTERNAL',
    internal: 'INTERNAL',
}

const AUTHENTICATION_TYPES = {
    basic: 'BASIC',
    pat: 'PAT',
}

const RadioDecorator = ({
    label,
    helperText,
    icon,
    currentSelected,
    children,
}) => (
    <Box
        className={classnames(styles.radioBox, {
            [styles.radioBoxSelected]: currentSelected,
        })}
    >
        <div>{children}</div>
        <div className={styles.radioBoxIcon}>
            <div>{icon}</div>
        </div>
        <div>
            <span className={styles.radioDecoratorLabel}>{label}</span>
            <span className={styles.radioDecoratorHelper}>{helperText}</span>
        </div>
    </Box>
)

RadioDecorator.propTypes = {
    children: PropTypes.node,
    currentSelected: PropTypes.bool,
    helperText: PropTypes.string,
    icon: PropTypes.node,
    label: PropTypes.string,
}

export const EditExchangeFormContents = ({
    requestsState,
    setRequestEditMode,
    deleteRequest,
}) => {
    const { input: typeInput } = useField('type', {
        subscription: { value: true },
    })
    const { value: typeValue } = typeInput

    const { input: authenticationType } = useField('authentication', {
        subscription: { value: true },
    })
    const { value: authenticationValue } = authenticationType

    return (
        <>
            <Subsection text={i18n.t('Basic setup')}>
                <div className={styles.subsectionField1000}>
                    <Field
                        name="name"
                        label={i18n.t('Exchange name')}
                        helpText={i18n.t(
                            'A unique name helps people find the right data exchange.'
                        )}
                        component={InputFieldFF}
                    />
                </div>
                <div className={styles.subsectionField}>
                    <FieldContainer label={i18n.t('Exchange target type')}>
                        <div className={styles.radiosContainer}>
                            <RadioDecorator
                                icon={<IconWorld24 />}
                                label={i18n.t('External')}
                                helperText={i18n.t(
                                    'Send date to another DHIS2 instance or data warehouse'
                                )}
                                currentSelected={
                                    typeValue === EXCHANGE_TYPES.external
                                }
                            >
                                <Field
                                    name="type"
                                    type="radio"
                                    component={RadioFieldFF}
                                    value={EXCHANGE_TYPES.external}
                                />
                            </RadioDecorator>

                            <RadioDecorator
                                icon={<IconHome24 />}
                                label={i18n.t('Internal')}
                                helperText={i18n.t(
                                    'Manipulate data and transfer it inside this DHIS2 instance'
                                )}
                                currentSelected={
                                    typeValue === EXCHANGE_TYPES.internal
                                }
                            >
                                <Field
                                    name="type"
                                    type="radio"
                                    component={RadioFieldFF}
                                    value={EXCHANGE_TYPES.internal}
                                />
                            </RadioDecorator>
                        </div>
                    </FieldContainer>
                </div>
            </Subsection>
            {typeValue === EXCHANGE_TYPES.external && (
                <Subsection text={i18n.t('Target setup')}>
                    <div className={styles.subsectionField600}>
                        <Field
                            name="url"
                            label={i18n.t('Target URL')}
                            helpText={i18n.t(
                                'The URL of the target instance or data warehouse.'
                            )}
                            component={InputFieldFF}
                        />
                    </div>

                    <div>
                        <FieldContainer label={i18n.t('Authentication method')}>
                            <div className={styles.radiosContainer}>
                                <Field
                                    name="authentication"
                                    type="radio"
                                    component={RadioFieldFF}
                                    label={i18n.t('Basic')}
                                    value={AUTHENTICATION_TYPES.basic}
                                />
                                <Field
                                    name="authentication"
                                    className={styles.radioItem}
                                    type="radio"
                                    component={RadioFieldFF}
                                    label={i18n.t('Personal Access token')}
                                    value={AUTHENTICATION_TYPES.pat}
                                />
                            </div>
                        </FieldContainer>
                    </div>

                    {authenticationValue === AUTHENTICATION_TYPES.pat && (
                        <div className={styles.subsectionField600}>
                            <Field
                                name="accessToken"
                                className={styles.fieldItem}
                                label={i18n.t('Access token')}
                                helpText={i18n.t(
                                    'The personal access token generated by target instance'
                                )}
                                component={InputFieldFF}
                            />
                        </div>
                    )}
                    {authenticationValue === AUTHENTICATION_TYPES.basic && (
                        <div className={styles.subsectionField600}>
                            <Field
                                name="username"
                                className={styles.fieldItem}
                                label={i18n.t('Username')}
                                helpText={i18n.t(
                                    'The username to log in to the target instance'
                                )}
                                component={InputFieldFF}
                            />
                            <Field
                                name="password"
                                className={styles.fieldItem}
                                label={i18n.t('Password')}
                                type="password"
                                helpText={i18n.t(
                                    'The password associated with the username specified above'
                                )}
                                component={InputFieldFF}
                            />
                        </div>
                    )}
                </Subsection>
            )}
            <Subsection text={i18n.t('Requests')}>
                <RequestsOverview
                    requestsInfo={useMemo(
                        () =>
                            requestsState.map((r, index) => ({ ...r, index })),
                        [requestsState]
                    )}
                    // redo this logic ^ (move to RequestsOverview to not need memoization)
                    setRequestEditMode={setRequestEditMode}
                    deleteRequest={deleteRequest}
                />
            </Subsection>
        </>
    )
}

EditExchangeFormContents.propTypes = {
    deleteRequest: PropTypes.func,
    requestsState: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}