import i18n from '@dhis2/d2-i18n'
import {
    Field as FieldContainer,
    RadioFieldFF,
    CheckboxFieldFF,
    ReactFinalForm,
} from '@dhis2/ui'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { useFeatureToggleContext } from '../../../context/index.js'
import {
    IMPORT_STRATEGY_OPTIONS,
    TogglableSubsection,
} from '../shared/index.js'
import styles from './advanced-options.module.css'

const Label = ({ label, prefix, type }) => {
    if (!prefix) {
        return label
    }

    return (
        <span>
            <span
                className={classnames(styles.prefix, {
                    [styles.prefixCritical]: type === 'critical',
                })}
            >
                {prefix}
            </span>
            {label}
        </span>
    )
}

Label.propTypes = {
    label: PropTypes.string.isRequired,
    prefix: PropTypes.string,
    type: PropTypes.oneOf(['critical']),
}

const { Field } = ReactFinalForm

export const AdvancedOptions = () => {
    const { skipAuditDryRunImportStrategyAvailable } = useFeatureToggleContext()

    const [advancedOpen, setAdvancedOpen] = useState(false)
    const toggleAdvancedSection = useCallback(() => {
        setAdvancedOpen((prev) => !prev)
    }, [setAdvancedOpen])

    if (!skipAuditDryRunImportStrategyAvailable) {
        return null
    }

    return (
        <TogglableSubsection
            open={advancedOpen}
            onTextClick={toggleAdvancedSection}
            text={i18n.t('Advanced options')}
        >
            <div className={styles.subsectionField1000}>
                <Field
                    name="skipAudit"
                    type="checkbox"
                    label={i18n.t(
                        'Skip audit, meaning audit values will not be generated'
                    )}
                    helpText={i18n.t(
                        'Improves performance at the cost of ability to audit changes.'
                    )}
                    component={CheckboxFieldFF}
                    // disabled={editTargetSetupDisabled}
                />
            </div>
            <div className={styles.subsectionField1000}>
                <Field
                    name="dryRun"
                    type="checkbox"
                    label={i18n.t('Dry run')}
                    helpText={i18n.t(
                        'A dry run tests the import settings without importing any data.'
                    )}
                    component={CheckboxFieldFF}
                />
            </div>
            <div className={styles.subsectionField1000}>
                <FieldContainer label={i18n.t('Import strategy')}>
                    <div className={styles.radiosContainerVertical}>
                        {IMPORT_STRATEGY_OPTIONS.map((iso) => (
                            <Field
                                key={`importStrategy_${
                                    iso.prefix ?? iso.label
                                }`}
                                name="importStrategy"
                                type="radio"
                                component={RadioFieldFF}
                                label={
                                    <Label
                                        prefix={iso.prefix}
                                        label={iso.label}
                                        type={iso.type}
                                    />
                                }
                                value={iso.value}
                            />
                        ))}
                    </div>
                </FieldContainer>
            </div>
        </TogglableSubsection>
    )
}
