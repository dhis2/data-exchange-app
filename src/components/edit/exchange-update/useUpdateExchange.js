import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { AUTHENTICATION_TYPES, EXCHANGE_TYPES } from '../shared/constants.js'
import { getExchangeValuesFromForm } from './getExchangeValues.js'

const getChange = ({ field, value }) => ({
    op: 'add',
    path: '/' + field,
    value: value ?? null,
})

const getDelete = ({ field }) => ({
    op: 'remove',
    path: '/' + field,
})

export const getJsonPatch = ({ formattedValues, form, requestsTouched }) => {
    const changes = []
    const modifiedFields = new Set(Object.keys(form.getState().dirtyFields))

    if (modifiedFields.has('name')) {
        changes.push(getChange({ field: 'name', value: formattedValues.name }))
    }

    // check if one field has been modified for target
    const targetIdSchemes = [
        'idScheme',
        'dataElementIdScheme',
        'orgUnitIdScheme',
        'categoryOptionComboIdScheme',
    ]
    const targetIdSchemesFields = targetIdSchemes.reduce((allNames, scheme) => {
        return [...allNames, `target_${scheme}`, `target_${scheme}_attribute`]
    }, [])

    const targetApiFieldsBasic = ['username', 'password']
    const targetApiFieldsPAT = ['accessToken']
    const targetApiFields =
        formattedValues?.target?.api?.authentication ===
        AUTHENTICATION_TYPES.pat
            ? targetApiFieldsPAT
            : targetApiFieldsBasic
    const removeApiFields =
        formattedValues.target.type === EXCHANGE_TYPES.internal
            ? []
            : formattedValues?.target?.api?.authentication ===
              AUTHENTICATION_TYPES.pat
            ? targetApiFieldsBasic
            : targetApiFieldsPAT

    const targetRequestFields = [
        'dryRun',
        'skipAudit',
        'importStrategy',
        ...targetIdSchemesFields,
    ]

    // if target type changes, we need to replace everything on the target
    if (modifiedFields.has('type')) {
        changes.push(
            getChange({
                field: 'target',
                value: formattedValues.target,
            })
        )
    } else {
        if (modifiedFields.has('url')) {
            changes.push(
                getChange({
                    field: 'target/api/url',
                    value: formattedValues.target.api.url,
                })
            )
        }

        targetApiFields.forEach((tf) => {
            if (modifiedFields.has(tf)) {
                changes.push(
                    getChange({
                        field: `target/api/${tf}`,
                        value: formattedValues.target.api[tf],
                    })
                )
            }
        })

        removeApiFields.forEach((tf) => {
            changes.push(
                getDelete({
                    field: `target/api/${tf}`,
                })
            )
        })

        if (targetRequestFields.some((tf) => modifiedFields.has(tf))) {
            changes.push(
                getChange({
                    field: 'target/request',
                    value: formattedValues.target.request,
                })
            )
        }
    }

    if (requestsTouched) {
        changes.push(
            getChange({ field: 'source', value: formattedValues.source })
        )
    }

    return changes
}

export const useUpdateExchange = ({ onComplete }) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const engine = useDataEngine()

    const refetch = useCallback(
        async ({
            id,
            form,
            values,
            requests,
            requestsTouched,
            newExchange,
        }) => {
            // set to loading
            setLoading(true)
            try {
                const formattedValues = getExchangeValuesFromForm({
                    values,
                    requests,
                })
                if (newExchange) {
                    await engine.mutate({
                        resource: 'aggregateDataExchanges',
                        type: 'create',
                        data: formattedValues,
                    })
                } else {
                    const changes = getJsonPatch({
                        formattedValues,
                        form,
                        requestsTouched,
                    })
                    if (changes?.length > 0) {
                        await engine.mutate({
                            resource: `aggregateDataExchanges/${id}`,
                            type: 'json-patch',
                            data: changes,
                        })
                    }
                }
                if (onComplete && typeof onComplete === 'function') {
                    onComplete()
                }
            } catch (e) {
                console.error(e)
                setError(e)
            } finally {
                setLoading(false)
            }
        },
        [engine, onComplete]
    )
    return [refetch, { loading, error }]
}
