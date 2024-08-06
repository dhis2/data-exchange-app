import { SCHEME_TYPES } from '../shared/index.js'

const getFormIdSchemeValues = ({
    requestValues,
    outputDataItemIdSchemeAvailable,
}) => {
    const baseIdSchemeProps = [
        'outputIdScheme',
        'outputDataElementIdScheme',
        'outputOrgUnitIdScheme',
    ]
    const idSchemeProps = outputDataItemIdSchemeAvailable
        ? [...baseIdSchemeProps, 'outputDataItemIdScheme']
        : baseIdSchemeProps
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        const attributeProp = `source_${prop}_attribute`

        idSchemeValues[prop] =
            requestValues[`source_${prop}`] !== SCHEME_TYPES.attribute
                ? requestValues[`source_${prop}`]
                : `ATTRIBUTE:${requestValues[attributeProp]}`

        return idSchemeValues
    }, {})
}

export const getRequestValuesFromForm = ({
    requestValues,
    outputDataItemIdSchemeAvailable,
}) => {
    const validFilters = !requestValues.filtersUsed
        ? []
        : requestValues?.filtersInfo
              .filter((f) => f.items?.length > 0)
              .map((filter) => ({
                  ...filter,
                  items: filter.items.map(({ id }) => id),
              }))

    const filtersActuallyUsed =
        requestValues.filtersUsed && validFilters.length > 0

    return {
        ...requestValues,
        name: requestValues.requestName,
        dx: requestValues?.dxInfo.map(({ id }) => id),
        pe: requestValues?.peInfo.map(({ id }) => id),
        ou: requestValues?.ouInfo.map(({ id }) => id),
        visualization: requestValues.visualizationLinked
            ? requestValues?.visualizationInfo?.id
            : null,
        filters: !filtersActuallyUsed ? [] : validFilters,
        filtersInfo: !filtersActuallyUsed ? null : requestValues.filtersInfo,
        visualizationInfo: !requestValues.visualizationLinked
            ? null
            : requestValues.visualizationInfo,
        inputIdScheme: SCHEME_TYPES.uid,
        ...getFormIdSchemeValues({
            requestValues,
            outputDataItemIdSchemeAvailable,
        }),
    }
}

const getIdSchemeValues = ({ request, outputDataItemIdSchemeAvailable }) => {
    const defaultSchemeProp = 'outputIdScheme'
    const baseIdSchemeProps = [
        defaultSchemeProp,
        'outputDataElementIdScheme',
        'outputOrgUnitIdScheme',
    ]
    const idSchemeProps = outputDataItemIdSchemeAvailable
        ? [...baseIdSchemeProps, 'outputDataItemIdScheme']
        : baseIdSchemeProps
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        idSchemeValues[`source_${prop}`] = request?.[prop]
            ? request?.[prop]?.split(':')[0]?.toUpperCase()
            : prop === defaultSchemeProp
            ? SCHEME_TYPES.uid
            : SCHEME_TYPES.none
        idSchemeValues[`source_${prop}_attribute`] =
            request?.[prop]?.split(':')[1]
        return idSchemeValues
    }, {})
}

export const getInitialValuesFromRequest = ({
    request,
    outputDataItemIdSchemeAvailable,
}) => ({
    requestName: request?.name,
    peInfo: request?.peInfo ?? [],
    ouInfo: request?.ouInfo ?? [],
    dxInfo: request?.dxInfo ?? [],
    filtersUsed: request?.filtersInfo?.length > 0,
    filtersInfo: request?.filtersInfo ?? [{ dimension: null }],
    visualizationLinked: Boolean(request.visualization),
    visualizationInfo: request?.visualizationInfo ?? null,
    ...getIdSchemeValues({ request, outputDataItemIdSchemeAvailable }),
})
