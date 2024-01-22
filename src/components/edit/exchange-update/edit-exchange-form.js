import i18n from '@dhis2/d2-i18n'
import {
    Box,
    Field as FieldContainer,
    InputFieldFF,
    RadioFieldFF,
    ReactFinalForm,
    hasValue,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { useMemo, useState } from 'react'
import { RequestsOverview } from '../request-update/requests-overview.js'
import { SchemeSelector } from '../shared/scheme-selector.js'
import styles from './edit-exchange-form.module.css'
import { Subsection, AdvancedSubsection } from './form-subsection.js'

const { Field, useField } = ReactFinalForm

export const EXCHANGE_TYPES = {
    external: 'EXTERNAL',
    internal: 'INTERNAL',
}

export const AUTHENTICATION_TYPES = {
    basic: 'BASIC',
    pat: 'PAT',
}

const RadioDecorator = ({ label, helperText, currentSelected, children }) => (
    <Box
        className={classnames(styles.radioBox, {
            [styles.radioBoxSelected]: currentSelected,
        })}
    >
        <div>{children}</div>
        <div className={styles.radioBoxText}>
            <span className={styles.radioDecoratorLabel}>{label}</span>
            <span className={styles.radioDecoratorHelper}>{helperText}</span>
        </div>
    </Box>
)

RadioDecorator.propTypes = {
    children: PropTypes.node,
    currentSelected: PropTypes.bool,
    helperText: PropTypes.string,
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
    const [showAdvanced, setShowAdvanced] = useState(false)

    const editTargetSetupDisabled = false

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
                        validate={hasValue}
                    />
                </div>
                <div className={styles.subsectionField}>
                    <FieldContainer label={i18n.t('Exchange target type')}>
                        <div className={styles.radiosContainer}>
                            <RadioDecorator
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
                            disabled={editTargetSetupDisabled}
                            component={InputFieldFF}
                            validate={hasValue}
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
                                    disabled={editTargetSetupDisabled}
                                />
                                <Field
                                    name="authentication"
                                    className={styles.radioItem}
                                    type="radio"
                                    component={RadioFieldFF}
                                    label={i18n.t('Personal Access token')}
                                    value={AUTHENTICATION_TYPES.pat}
                                    disabled={editTargetSetupDisabled}
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
                                disabled={editTargetSetupDisabled}
                                component={InputFieldFF}
                                validate={hasValue}
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
                                disabled={editTargetSetupDisabled}
                                component={InputFieldFF}
                                validate={hasValue}
                            />
                            <Field
                                name="password"
                                className={styles.fieldItem}
                                label={i18n.t('Password')}
                                type="password"
                                helpText={i18n.t(
                                    'The password associated with the username specified above'
                                )}
                                disabled={editTargetSetupDisabled}
                                component={InputFieldFF}
                                validate={hasValue}
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
            <AdvancedSubsection
                text={i18n.t('Advanced options')}
                className={styles.advancedSection}
                onTextClick={() => {
                    setShowAdvanced((prevShown) => !prevShown)
                }}
                open={showAdvanced}
            >
                {showAdvanced && (
                    <>
                        <SchemeSelector
                            label={i18n.t('Input general ID Scheme')}
                            name="target_idScheme"
                        />
                        <SchemeSelector
                            label={i18n.t('Input data element ID Scheme')}
                            name="target_dataElementIdScheme"
                        />
                        <SchemeSelector
                            label={i18n.t('Input organisation unit ID Scheme')}
                            name="target_orgUnitIdScheme"
                        />
                        <SchemeSelector
                            label={i18n.t(
                                'Input category option combo ID Scheme'
                            )}
                            name="target_categoryOptionComboIdScheme"
                        />
                    </>
                )}
            </AdvancedSubsection>
        </>
    )
}

EditExchangeFormContents.propTypes = {
    deleteRequest: PropTypes.func,
    requestsState: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}
