import { DataDimension } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF, CheckboxFieldFF } from '@dhis2/ui'
import React from 'react'
import { Subsection } from '../exchange-update/form-subsection.js'
import { FilterSelect } from './filterSelect/filter-select.js'
import { OrgUnitSelector } from './org-unit-select-analytics.js'
import { PeriodSelector } from './period-select.js'
import styles from './request-form.module.css'

const { Field, useField } = ReactFinalForm

export const RequestEditForm = () => {
    const { input: filtersUsed } = useField('filtersUsed', {
        subscription: { value: true },
    })
    const { value: filtersUsedValue } = filtersUsed

    return (
        <>
            <Subsection
                text={i18n.t('Request setup')}
                className={styles.subsectionBlockEnd}
            >
                <div className={styles.subsectionField1000}>
                    <Field
                        name="requestName"
                        label={i18n.t('Request name')}
                        helpText={i18n.t('Displayed in the Data Exchange app.')}
                        component={InputFieldFF}
                    />
                </div>
                <div>
                    <Field
                        type="checkbox"
                        label={i18n.t('Filter request')}
                        name="filtersUsed"
                        component={CheckboxFieldFF}
                    />
                    {filtersUsedValue && (
                        <Field
                            label={i18n.t('Filter selections')}
                            name="filtersInfo"
                            component={FilterSelect}
                        />
                    )}
                </div>
            </Subsection>
            <Subsection
                text={i18n.t('Data items')}
                className={styles.subsectionBlockEnd}
            >
                <DataDimension
                    onSelect={({ items }) => {
                        console.log(items)
                    }}
                    selectedDimensions={[]}
                    displayNameProp="displayName"
                />
            </Subsection>
            <Subsection
                text={i18n.t('Periods')}
                className={styles.subsectionBlockEnd}
            >
                <Field name="peInfo" component={PeriodSelector} />
            </Subsection>
            <Subsection
                text={i18n.t('Organisation units')}
                className={styles.subsectionBlockEnd}
            >
                <Field name="ouInfo" component={OrgUnitSelector} />
            </Subsection>
        </>
    )
}
