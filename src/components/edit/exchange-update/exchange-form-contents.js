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
import {
    SchemeSelector,
    Subsection,
    AUTHENTICATION_TYPES,
    EXCHANGE_TYPES,
} from '../shared/index.js'
import { AdvancedOptions } from './advanced-options.js'
import styles from './exchange-form-contents.module.css'
import { EnableExternalEditWarning } from './external-edit-warning.js'
import { RequestsOverview } from './requests-overview.js'

const { Field, useField } = ReactFinalForm

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

export const ExchangeFormContents = React.memo(
    ({ requestsState, setRequestEditMode, deleteRequest }) => {
        const { input: typeInput } = useField('type', {
            subscription: { value: true },
        })
        const { value: typeValue } = typeInput

        const { input: authenticationType } = useField('authentication', {
            subscription: { value: true },
        })
        const { value: authenticationValue } = authenticationType

        const [editTargetSetupDisabled, setEditTargetSetupDisabled] = useState(
            () => typeValue === EXCHANGE_TYPES.external
        )

        return (
            <>
                <Subsection text={i18n.t('Basic setup')}>
                    <div
                        className={styles.subsectionField1000}
                        data-test="exchange-name-input"
                    >
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
                    <div
                        className={styles.subsectionField}
                        data-test="exchange-type-input"
                    >
                        <FieldContainer label={i18n.t('Exchange target type')}>
                            <div
                                className={styles.radiosContainer}
                                data-test="exchange-types"
                            >
                                <RadioDecorator
                                    label={i18n.t('External')}
                                    helperText={i18n.t(
                                        'Send data to another DHIS2 instance or data warehouse'
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
                    <Subsection
                        text={i18n.t('Target setup')}
                        dataTest="target-setup"
                    >
                        <div
                            className={styles.subsectionField600}
                            data-test="exchange-url"
                        >
                            <Field
                                name="url"
                                label={i18n.t('Target URL')}
                                helpText={i18n.t(
                                    'The URL of the target instance or data warehouse.'
                                )}
                                component={InputFieldFF}
                                validate={hasValue}
                            />
                        </div>

                        <div>
                            <EnableExternalEditWarning
                                editTargetSetupDisabled={
                                    editTargetSetupDisabled
                                }
                                setEditTargetSetupDisabled={
                                    setEditTargetSetupDisabled
                                }
                            />
                            <FieldContainer
                                label={i18n.t('Authentication method')}
                            >
                                <div
                                    className={styles.radiosContainer}
                                    data-test="exchange-auth-method"
                                >
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
                            <div
                                className={styles.subsectionField600}
                                data-test="exchange-auth-pat"
                            >
                                <Field
                                    name="accessToken"
                                    type="password"
                                    className={styles.fieldItem}
                                    label={i18n.t('Access token')}
                                    helpText={i18n.t(
                                        'The personal access token generated by target instance'
                                    )}
                                    disabled={editTargetSetupDisabled}
                                    component={InputFieldFF}
                                    validate={
                                        !editTargetSetupDisabled
                                            ? hasValue
                                            : null
                                    }
                                />
                            </div>
                        )}
                        {authenticationValue === AUTHENTICATION_TYPES.basic && (
                            <div
                                className={styles.subsectionField600}
                                data-test="exchange-auth-basic"
                            >
                                <Field
                                    name="username"
                                    className={styles.fieldItem}
                                    label={i18n.t('Username')}
                                    helpText={i18n.t(
                                        'The username to log in to the target instance'
                                    )}
                                    disabled={editTargetSetupDisabled}
                                    component={InputFieldFF}
                                    validate={
                                        !editTargetSetupDisabled
                                            ? hasValue
                                            : null
                                    }
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
                                    validate={
                                        !editTargetSetupDisabled
                                            ? hasValue
                                            : null
                                    }
                                />
                            </div>
                        )}
                    </Subsection>
                )}
                <Subsection text={i18n.t('Requests')}>
                    <RequestsOverview
                        requestsInfo={useMemo(
                            () =>
                                requestsState.map((r, index) => ({
                                    ...r,
                                    index,
                                })),
                            [requestsState]
                        )}
                        // redo this logic ^ (move to RequestsOverview to not need memoization)
                        setRequestEditMode={setRequestEditMode}
                        deleteRequest={deleteRequest}
                    />
                </Subsection>
                <Subsection
                    text={i18n.t('Input ID scheme options')}
                    description={i18n.t(
                        'Specify the scheme (ID, code, attribute value) used on the target system to match data coming from the source system.'
                    )}
                    className={styles.idSchemeSection}
                >
                    <>
                        <SchemeSelector
                            label={i18n.t('Input general ID scheme')}
                            description={i18n.t(
                                'Used as the default ID scheme for all items. If the chosen scheme is not available for an item, it will fall back to using ID.'
                            )}
                            name="target_idScheme"
                            dataTest="general-id-scheme-selector"
                        />
                        <SchemeSelector
                            label={i18n.t('Input data element ID scheme')}
                            description={i18n.t('Applies to data elements.')}
                            name="target_dataElementIdScheme"
                            canBeNone={true}
                            defaultIDSchemeName={i18n.t(
                                'Input general ID scheme'
                            )}
                            dataTest="element-id-scheme-selector"
                        />
                        <SchemeSelector
                            label={i18n.t('Input organisation unit ID scheme')}
                            description={i18n.t(
                                'Applies to organisation units.'
                            )}
                            name="target_orgUnitIdScheme"
                            canBeNone={true}
                            defaultIDSchemeName={i18n.t(
                                'Input general ID scheme'
                            )}
                            dataTest="org-unit-id-scheme-selector"
                        />
                        <SchemeSelector
                            label={i18n.t(
                                'Input category option combo ID scheme'
                            )}
                            description={i18n.t(
                                'Applies to category option combos.'
                            )}
                            name="target_categoryOptionComboIdScheme"
                            canBeNone={true}
                            defaultIDSchemeName={i18n.t(
                                'Input general ID scheme'
                            )}
                            dataTest="category-option-combo-scheme-selector"
                        />
                    </>
                </Subsection>
                <AdvancedOptions />
            </>
        )
    }
)

ExchangeFormContents.propTypes = {
    deleteRequest: PropTypes.func,
    requestsState: PropTypes.array,
    setRequestEditMode: PropTypes.func,
}
