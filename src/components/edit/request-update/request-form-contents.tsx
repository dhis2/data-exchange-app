import i18n from '@dhis2/d2-i18n'
import {
    ReactFinalForm,
    InputFieldFF,
    CheckboxFieldFF,
    hasValue,
} from '@dhis2/ui'
import React, { useState } from 'react'
import { Subsection, AdvancedSubsection, SchemeSelector } from '../shared/index'
import { DataItemSelect } from './data-item-select'
import { FilterSelect } from './filterSelect/filter-select'
import { OrgUnitSelector } from './org-unit-select'
import { PeriodSelector } from './period-select'
import styles from './request-form-contents.module.css'
import { useValidators } from './useValidators'
import { VisualizationSelect } from './visualization-select'

const { Field, useField } = ReactFinalForm

export const RequestFormContents = () => {
    const { input: filtersUsed } = useField('filtersUsed', {
        subscription: { value: true },
    })
    const { value: filtersUsedValue } = filtersUsed
    const { input: visualizationLinked } = useField('visualizationLinked', {
        subscription: { value: true },
    })
    const { value: visualizationLinkedValue } = visualizationLinked
    const [showAdvanced, setShowAdvanced] = useState(false)

    const {
        dataItemSelectValidator,
        periodSelectValidator,
        orgUnitSelectValidator,
    } = useValidators()

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
                        validate={hasValue}
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
                <div className={styles.checkContainer}>
                    <Field
                        type="checkbox"
                        label={i18n.t('Link request to a visualization')}
                        name="visualizationLinked"
                        component={CheckboxFieldFF}
                    />
                    <div className={styles.visualizationSubtext}>
                        {i18n.t(
                            'Request visualizations are shown when submitting exchanges.'
                        )}
                    </div>
                    {visualizationLinkedValue && (
                        <Field
                            label={i18n.t('Filter selections')}
                            name="visualizationInfo"
                            component={VisualizationSelect}
                        />
                    )}
                </div>
            </Subsection>
            <Subsection
                text={i18n.t('Data items')}
                className={styles.subsectionBlockEnd}
            >
                <Field
                    label={i18n.t('Data item select')}
                    name="dxInfo"
                    component={DataItemSelect}
                    validate={dataItemSelectValidator}
                />
            </Subsection>
            <Subsection
                text={i18n.t('Periods')}
                className={styles.subsectionBlockEnd}
            >
                <Field
                    name="peInfo"
                    component={PeriodSelector}
                    validate={periodSelectValidator}
                />
            </Subsection>
            <Subsection
                text={i18n.t('Organisation units')}
                className={styles.subsectionBlockEnd}
            >
                <div className={styles.subsectionField600}>
                    <Field
                        name="ouInfo"
                        component={OrgUnitSelector}
                        validate={orgUnitSelectValidator}
                    />
                </div>
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
                            label={i18n.t('Output general ID scheme')}
                            name="source_outputIdScheme"
                        />
                        <SchemeSelector
                            label={i18n.t('Output data element ID scheme')}
                            name="source_outputDataElementIdScheme"
                        />
                        <SchemeSelector
                            label={i18n.t('Output organisation unit ID scheme')}
                            name="source_outputOrgUnitIdScheme"
                        />
                    </>
                )}
            </AdvancedSubsection>
        </>
    )
}
