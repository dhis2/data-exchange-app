import { useDataEngine } from '@dhis2/app-runtime'
import { useCallback, useState } from 'react'
import { getExchangeValuesFromForm } from './getExchangeValues.js'

const getChange = ({ field, value }) => ({
    op: 'add',
    path: '/' + field,
    value: value ?? null,
})

const getJsonPatch = ({ formattedValues, form, requestsTouched }) => {
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
    const targetFields = [
        'type',
        'authentication',
        'url',
        'username',
        ...targetIdSchemesFields,
    ]
    if (targetFields.some((tf) => modifiedFields.has(tf))) {
        changes.push(
            getChange({ field: 'target', value: formattedValues.target })
        )
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
