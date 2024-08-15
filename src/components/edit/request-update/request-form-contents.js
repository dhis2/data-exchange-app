import i18n from '@dhis2/d2-i18n'
import {
    ReactFinalForm,
    InputFieldFF,
    CheckboxFieldFF,
    hasValue,
} from '@dhis2/ui'
import React from 'react'
import { useFeatureToggleContext } from '../../../context/index.js'
import { Subsection, SchemeSelector } from '../shared/index.js'
import { DataItemSelect } from './data-item-select.js'
import { FilterSelect } from './filterSelect/filter-select.js'
import { OrgUnitSelector } from './org-unit-select.js'
import { PeriodSelector } from './period-select.js'
import styles from './request-form-contents.module.css'
import { useValidators } from './useValidators.js'
import { VisualizationSelect } from './visualization-select.js'

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
    const { outputDataItemIdSchemeAvailable } = useFeatureToggleContext()

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
            <Subsection
                text={i18n.t('Output ID scheme options')}
                description={i18n.t(
                    'Configure the formatting of source data before sending to the target system.'
                )}
            >
                <>
                    <SchemeSelector
                        label={i18n.t('Output general ID scheme')}
                        description={i18n.t(
                            'Used as the default ID scheme for all items. If the chosen scheme is not available for an item, it will fallback to using ID.'
                        )}
                        name="source_outputIdScheme"
                    />
                    {outputDataItemIdSchemeAvailable && (
                        <SchemeSelector
                            label={i18n.t('Output data item ID scheme')}
                            description={i18n.t(
                                'Applies to data elements, indicators, and program indicators.'
                            )}
                            name="source_outputDataItemIdScheme"
                            canBeNone={true}
                            defaultIDSchemeName={i18n.t(
                                'Output general ID scheme'
                            )}
                        />
                    )}
                    <SchemeSelector
                        label={i18n.t('Output data element ID scheme')}
                        description={i18n.t(
                            'Applies to data elements. For data elements, it will override the scheme specified by Output data item ID scheme.'
                        )}
                        name="source_outputDataElementIdScheme"
                        canBeNone={true}
                        defaultIDSchemeName={i18n.t('Output general ID scheme')}
                    />
                    <SchemeSelector
                        label={i18n.t('Output organisation unit ID scheme')}
                        description={i18n.t('Applies to organisation units.')}
                        name="source_outputOrgUnitIdScheme"
                        canBeNone={true}
                        defaultIDSchemeName={i18n.t('Output general ID scheme')}
                    />
                </>
            </Subsection>
        </>
    )
}
