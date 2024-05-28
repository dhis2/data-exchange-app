import i18n from '@dhis2/d2-i18n'
import {
    Field as FieldContainer,
    ReactFinalForm,
    RadioFieldFF,
    SingleSelectFieldFF,
    hasValue,
    Checkbox,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { useAttributeContext } from '../../../context/index.js'
import { SCHEME_TYPES } from './constants.js'
import styles from './scheme-selector.module.css'

export const SchemeSelector = ({
    name,
    label,
    description,
    disabled,
    enforceEditCheck,
}) => {
    const { Field, useField, useForm } = ReactFinalForm
    const { input: schemeInput } = useField(name, {
        subscription: { value: true },
    })
    const { value: schemeValue } = schemeInput
    const form = useForm()
    const { attributes } = useAttributeContext()
    const [isInEditMode, setIsInEditMode] = useState(
        enforceEditCheck ? false : true
    )

    useEffect(() => {
        if (!isInEditMode) {
            form.change(name, SCHEME_TYPES.uid)
        }
    }, [isInEditMode])

    return (
        <div className={styles.schemeSelectorContainer}>
            <div className={styles.radioContainerLabel}>{label}</div>
            <div className={styles.radioContainerSubtext}>{description}</div>
            <div className={styles.radioContainerWrapper}>
                <FieldContainer>
                    {enforceEditCheck && (
                        <Checkbox
                            checked={!isInEditMode}
                            className={styles.editCheckboxConfirm}
                            label={i18n.t('Use default value of ID')}
                            onChange={({ checked }) => {
                                setIsInEditMode(!checked)
                            }}
                        />
                    )}

                    <div className={styles.radiosContainer}>
                        <Field
                            name={name}
                            type="radio"
                            checked={true}
                            component={RadioFieldFF}
                            label={i18n.t('ID')}
                            value={SCHEME_TYPES.uid}
                            disabled={disabled || !isInEditMode}
                        />
                        <Field
                            name={name}
                            className={styles.radioItem}
                            type="radio"
                            component={RadioFieldFF}
                            label={i18n.t('Code')}
                            value={SCHEME_TYPES.code}
                            disabled={disabled || !isInEditMode}
                        />
                        <Field
                            name={name}
                            className={styles.radioItem}
                            type="radio"
                            component={RadioFieldFF}
                            label={i18n.t('Attribute')}
                            value={SCHEME_TYPES.attribute}
                            disabled={
                                disabled ||
                                attributes.length === 0 ||
                                !isInEditMode
                            }
                        />
                    </div>
                </FieldContainer>
                {schemeValue === SCHEME_TYPES.attribute && (
                    <div className={styles.attributeSelectionContainer}>
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
        </div>
    )
}

SchemeSelector.propTypes = {
    description: PropTypes.string,
    disabled: PropTypes.bool,
    enforceEditCheck: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
}
