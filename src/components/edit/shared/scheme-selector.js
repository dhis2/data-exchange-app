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

export const SchemeSelector = ({
    name,
    label,
    description,
    disabled,
    canBeNone,
    defaultIDSchemeName,
}) => {
    const { Field, useField } = ReactFinalForm
    const { input: schemeInput } = useField(name, {
        subscription: { value: true },
    })
    const { value: schemeValue } = schemeInput
    const { attributes } = useAttributeContext()

    return (
        <div className={styles.schemeSelectorContainer}>
            <div className={styles.radioContainerLabel}>{label}</div>
            <div className={styles.radioContainerSubtext}>{description}</div>
            <div className={styles.radioContainerWrapper}>
                <FieldContainer>
                    <div className={styles.radiosContainer}>
                        {canBeNone && (
                            <Field
                                name={name}
                                type="radio"
                                checked={true}
                                component={RadioFieldFF}
                                label={i18n.t(
                                    'None (follows {{defaultIDSchemeName}})',
                                    { defaultIDSchemeName }
                                )}
                                value={SCHEME_TYPES.none}
                                disabled={disabled}
                            />
                        )}
                        <Field
                            name={name}
                            className={canBeNone ? styles.radioItem : null}
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
    canBeNone: PropTypes.bool,
    defaultIDSchemeName: PropTypes.string,
    description: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.string,
    name: PropTypes.string,
}
