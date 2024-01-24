import { SCHEME_TYPES } from '../shared/index.js'

export const getRequestValuesFromForm = ({ requestValues }) => {
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
        outputIdScheme:
            requestValues.source_outputIdScheme !== SCHEME_TYPES.attribute
                ? requestValues.source_outputIdScheme
                : `ATTRIBUTE:${requestValues.source_outputIdScheme_attribute}`,
        outputOrgUnitIdScheme:
            requestValues.source_outputOrgUnitIdScheme !==
            SCHEME_TYPES.attribute
                ? requestValues.source_outputIdScheme
                : `ATTRIBUTE:${requestValues.source_outputOrgUnitIdScheme_attribute}`,
        outputDataElementIdScheme:
            requestValues.source_outputDataElementIdScheme !==
            SCHEME_TYPES.attribute
                ? requestValues.source_outputIdScheme
                : `ATTRIBUTE:${requestValues.source_outputDataElementIdScheme_attribute}`,
    }
}

export const getInitialValuesFromRequest = ({ request }) => ({
    requestName: request?.name,
    peInfo: request?.peInfo ?? [],
    ouInfo: request?.ouInfo ?? [],
    dxInfo: request?.dxInfo ?? [],
    filtersUsed: request?.filtersInfo?.length > 0,
    filtersInfo: request?.filtersInfo ?? [{ dimension: null }],
    visualizationLinked: Boolean(request.visualization),
    visualizationInfo: request?.visualizationInfo ?? null,
    source_outputIdScheme: request?.outputIdScheme
        ? request.outputIdScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    source_outputIdScheme_attribute:
        request?.outputIdScheme?.split(':')?.[1] ?? null,
    source_outputDataElementIdScheme: request?.outputDataElementIdScheme
        ? request.outputDataElementIdScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    source_outputDataElementIdScheme_attribute:
        request?.outputDataElementIdScheme?.split(':')?.[1] ?? null,
    source_outputOrgUnitIdScheme: request?.outputOrgUnitIdScheme
        ? request?.outputOrgUnitIdScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    source_outputOrgUnitIdScheme_attribute:
        request?.outputOrgUnitIdScheme?.split(':')?.[1] ?? null,
})
