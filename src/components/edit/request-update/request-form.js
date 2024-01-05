import { DataDimension } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { ReactFinalForm, InputFieldFF } from '@dhis2/ui'
import React from 'react'
import { Subsection } from '../exchange-update/form-subsection.js'
import { OrgUnitSelector } from './org-unit-select-analytics.js'
import { PeriodSelector } from './period-select.js'
import styles from './request-form.module.css'

const { Field } = ReactFinalForm

export const RequestEditForm = () => {
    return (
        <>
            <Subsection text={i18n.t('Request setup')}>
                <div className={styles.subsectionField1000}>
                    <Field
                        name="requestName"
                        label={i18n.t('Request name')}
                        helpText={i18n.t('Displayed in the Data Exchange app.')}
                        component={InputFieldFF}
                    />
                </div>
            </Subsection>
            <Subsection text={i18n.t('Data items')}>
                <DataDimension
                    onSelect={({ items }) => {
                        console.log(items)
                    }}
                    selectedDimensions={[]}
                    displayNameProp="displayName"
                />
            </Subsection>
            <Subsection text={i18n.t('Periods')}>
                <Field name="pe" component={PeriodSelector} />
            </Subsection>
            <Subsection text={i18n.t('Organisation units')}>
                <Field name="ou" component={OrgUnitSelector} />
            </Subsection>
        </>
    )
}
