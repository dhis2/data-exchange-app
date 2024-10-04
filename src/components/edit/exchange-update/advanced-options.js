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
import {
    useFeatureToggleContext,
    useUserContext,
} from '../../../context/index.js'
import { Warning } from '../../common/index.js'
import {
    EXCHANGE_TYPES,
    IMPORT_STRATEGY_OPTIONS,
    TogglableSubsection,
} from '../shared/index.js'
import styles from './advanced-options.module.css'
import { EnableExternalEditWarning } from './external-edit-warning.js'

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

const SkipAuditWarning = ({
    hasSkipAuditInfoAuthority,
    typeValue,
    skipAuditValue,
}) => {
    if (!skipAuditValue) {
        return null
    }
    if (typeValue === EXCHANGE_TYPES.internal && hasSkipAuditInfoAuthority) {
        return null
    }
    const externalWarning = i18n.t(
        'When selecting to skip audits, the authentication for the external server will need to have the Skip data import audit authority. If the authentication details do not have this authority, the data will be ignored on submit.'
    )
    const internalWarning = i18n.t(
        'You do not have the Skip data import audit authority. In order for the data to not be ignored on submit, the exchange will need to be executed by a user who has this authority.'
    )
    return (
        <div className={styles.skipAuditWarning}>
            <Warning warning>
                {typeValue === EXCHANGE_TYPES.internal
                    ? internalWarning
                    : externalWarning}
            </Warning>
        </div>
    )
}

SkipAuditWarning.propTypes = {
    hasSkipAuditInfoAuthority: PropTypes.bool,
    skipAuditValue: PropTypes.bool,
    typeValue: PropTypes.string,
}

const { Field, useField } = ReactFinalForm

export const AdvancedOptions = ({
    typeValue,
    editTargetSetupDisabled,
    setEditTargetSetupDisabled,
}) => {
    const { skipAuditDryRunImportStrategyAvailable } = useFeatureToggleContext()
    const { hasSkipAuditInfoAuthority } = useUserContext()

    const [advancedOpen, setAdvancedOpen] = useState(false)
    const toggleAdvancedSection = useCallback(() => {
        setAdvancedOpen((prev) => !prev)
    }, [setAdvancedOpen])

    const { input: skipAuditInput } = useField('skipAudit', {
        subscription: { value: true },
    })
    const { value: skipAuditValue } = skipAuditInput

    if (!skipAuditDryRunImportStrategyAvailable) {
        return null
    }

    return (
        <TogglableSubsection
            open={advancedOpen}
            onTextClick={toggleAdvancedSection}
            text={i18n.t('Advanced options')}
        >
            <EnableExternalEditWarning
                editTargetSetupDisabled={editTargetSetupDisabled}
                setEditTargetSetupDisabled={setEditTargetSetupDisabled}
                sectionName="advancedOptions"
            />
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
                    disabled={editTargetSetupDisabled}
                />
                <SkipAuditWarning
                    hasSkipAuditInfoAuthority={hasSkipAuditInfoAuthority}
                    typeValue={typeValue}
                    skipAuditValue={skipAuditValue}
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
                    disabled={editTargetSetupDisabled}
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
                                disabled={editTargetSetupDisabled}
                            />
                        ))}
                    </div>
                </FieldContainer>
            </div>
        </TogglableSubsection>
    )
}

AdvancedOptions.propTypes = {
    editTargetSetupDisabled: PropTypes.bool,
    setEditTargetSetupDisabled: PropTypes.func,
    typeValue: PropTypes.string,
}
