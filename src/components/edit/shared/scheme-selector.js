import i18n from '@dhis2/d2-i18n'
import {
    Field as FieldContainer,
    ReactFinalForm,
    RadioFieldFF,
    SingleSelectFieldFF,
    hasValue,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useAttributeContext } from '../../../context/index.js'
import { SCHEME_TYPES } from './constants.js'
import styles from './scheme-selector.module.css'

export const SchemeSelector = ({ name, label, disabled, dataTest }) => {
    const { Field, useField } = ReactFinalForm
    const { input: schemeInput } = useField(name, {
        subscription: { value: true },
    })
    const { value: schemeValue } = schemeInput
    const { attributes } = useAttributeContext()

    return (
        <div className={styles.schemeSelectorContainer} data-test={dataTest}>
            <FieldContainer>
                <div className={styles.radioContainerLabel}>{label}</div>
                <div className={styles.radiosContainer}>
                    <Field
                        name={name}
                        type="radio"
                        component={RadioFieldFF}
                        label={i18n.t('ID')}
                        value={SCHEME_TYPES.uid}
                        disabled={disabled}
                    />
                    <Field
                        name={name}
                        className={styles.radioItem}
                        type="radio"
                        component={RadioFieldFF}
                        label={i18n.t('Code')}
                        value={SCHEME_TYPES.code}
                        disabled={disabled}
                    />
                    <Field
                        name={name}
                        className={styles.radioItem}
                        type="radio"
                        component={RadioFieldFF}
                        label={i18n.t('Attribute')}
                        value={SCHEME_TYPES.attribute}
                        disabled={disabled || attributes.length === 0}
                    />
                </div>
            </FieldContainer>
            {schemeValue === SCHEME_TYPES.attribute && (
                <div className={styles.attributeSelectionContainer} data-test={`${dataTest}-attributes`} >
                    <Field
                        name={`${name}_attribute`}
                        component={SingleSelectFieldFF}
                        options={attributes.map(({ id, displayName }) => ({
                            value: id,
                            label: displayName,
                        }))}
                        validate={hasValue}
                    />
                </div>
            )}
        </div>
    )
}

SchemeSelector.propTypes = {
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
    dataTest: PropTypes.string
}
