import { OU_LEVEL_PREFIX } from '../shared/index.js'

const dimensionTypes = [
    'CATEGORY',
    'CATEGORY_OPTION_GROUP_SET',
    'ORGANISATION_UNIT_GROUP_SET',
]

const DIMENSIONS_QUERY = {
    dimensions: {
        resource: 'dimensions',
        params: {
            fields: ['id', 'code', 'items[id,code]'],
            filter: `dimensionType:in:[${dimensionTypes.join(',')}]`,
            paging: false,
        },
    },
}

const ORGANISATION_UNIT_LEVELS_QUERY = {
    organisationUnitLevels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: ['id', 'level'],
            paging: false,
        },
    },
}

const getCodeFromPosition = ({ id, request, dx }) => {
    const indexPosition = dx.indexOf(id)
    if (indexPosition === -1) {
        return null
    }
    return request.dx[indexPosition]
}

export const getMetadataWithCode = ({ originalCurrentItems, request, md }) => {
    const codeItems = {}
    Object.keys(originalCurrentItems).forEach((key) => {
        const item = originalCurrentItems[key]
        const currentCode =
            item.code ??
            getCodeFromPosition({
                id: key,
                request,
                dx: md.metadata.metaData.dimensions.dx,
            })
        if (currentCode !== null) {
            codeItems[currentCode] = { id: key, ...item }
        }
    })
    return codeItems
}

export const getFilterCodeMap = async ({ engine }) => {
    const filterCodeMap = new Map()

    const dimensionsResponse = await engine.query(DIMENSIONS_QUERY)
    const dimensionsInfo = dimensionsResponse.dimensions?.dimensions

    for (const dimension of dimensionsInfo) {
        filterCodeMap.set(dimension.code, dimension.id)
        for (const dItem of dimension.items) {
            filterCodeMap.set(dItem.code, dItem.id)
        }
    }
    return filterCodeMap
}

export const getOuLevelMap = async ({ engine, exchange }) => {
    const ouLevelMap = new Map()
    const hasOuLevels = exchange.source.requests.reduce(
        (oneOuLevel, request) => {
            return oneOuLevel
                ? true
                : request.ou.some((ou) => ou.startsWith(OU_LEVEL_PREFIX))
        },
        false
    )
    if (hasOuLevels) {
        const ouLevelResponse = await engine.query(
            ORGANISATION_UNIT_LEVELS_QUERY
        )
        ouLevelResponse.organisationUnitLevels.organisationUnitLevels.map(
            (oul) => {
                ouLevelMap.set(String(oul.level), oul.id)
            }
        )
    }
    return ouLevelMap
}
