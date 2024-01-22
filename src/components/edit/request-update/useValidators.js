import i18n from '@dhis2/d2-i18n'
import { useCallback } from 'react'

export const useValidators = () => {
    const dataItemSelectValidator = useCallback(
        (val) =>
            val.length === 0
                ? i18n.t('Select at least one data item')
                : undefined,
        []
    )
    const periodSelectValidator = useCallback(
        (val) =>
            val.length === 0 ? i18n.t('Select at least one period') : undefined,
        []
    )
    const orgUnitSelectValidator = useCallback(
        (val) =>
            val.length === 0
                ? i18n.t('Select at least one organisation unit')
                : undefined,
        []
    )
    return {
        dataItemSelectValidator,
        periodSelectValidator,
        orgUnitSelectValidator,
    }
}
