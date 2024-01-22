import {
    Field as FieldContainer,
    ReactFinalForm,
    RadioFieldFF,
    SingleSelectFieldFF,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { useAttributeContext } from '../../../context/index.js'
import styles from './scheme-selector.module.css'

export const SCHEME_TYPES = {
    uid: 'UID',
    code: 'CODE',
    attribute: 'ATTRIBUTE',
}

export const SchemeSelector = ({ name, label }) => {
    const { Field, useField } = ReactFinalForm
    const { input: schemeInput } = useField(name, {
        subscription: { value: true },
    })
    const { value: schemeValue } = schemeInput
    const { attributes } = useAttributeContext()

    return (
        <div className={styles.schemeSelectorContainer}>
            <FieldContainer>
                <div className={styles.radioContainerLabel}>{label}</div>
                <div className={styles.radiosContainer}>
                    <Field
                        name={name}
                        type="radio"
                        component={RadioFieldFF}
                        label="ID"
                        value={SCHEME_TYPES.uid}
                    />
                    <Field
                        name={name}
                        className={styles.radioItem}
                        type="radio"
                        component={RadioFieldFF}
                        label="Code"
                        value={SCHEME_TYPES.code}
                    />
                    <Field
                        name={name}
                        className={styles.radioItem}
                        type="radio"
                        component={RadioFieldFF}
                        label="Attribute"
                        value={SCHEME_TYPES.attribute}
                        disabled={attributes.length === 0}
                    />
                </div>
            </FieldContainer>
            {schemeValue === SCHEME_TYPES.attribute && (
                <div className={styles.attributeSelectionContainer}>
                    <Field
                        name={`${name}_attribute`}
                        component={SingleSelectFieldFF}
                        options={[
                            ...attributes,
                            { id: 'ATTRIBUTE', displayName: 'ATTRIBUTE' },
                            { id: 'undefined', displayeName: 'undefined' },
                        ].map(({ id, displayName }) => ({
                            value: id,
                            label: displayName,
                        }))}
                    />
                </div>
            )}
        </div>
    )
}

SchemeSelector.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
}
