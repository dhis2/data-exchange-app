import {
    SCHEME_TYPES,
    EXCHANGE_TYPES,
    AUTHENTICATION_TYPES,
    IMPORT_STRATEGY_TYPES,
} from '../shared/index.js'

// this filters out additional properties that are used by the app UI, but should not be sent to backend
const validProperties = [
    'name',
    'visualization',
    'dx',
    'pe',
    'ou',
    'filters',
    'inputIdScheme',
    'outputDataElementIdScheme',
    'outputOrgUnitIdScheme',
    'outputIdScheme',
    'outputDataItemIdScheme',
]
const copyRequestWithValidProperties = (request) =>
    validProperties.reduce((requestCopy, prop) => {
        if (request[prop]) {
            requestCopy[prop] = request[prop]
        }
        return requestCopy
    }, {})

export const cleanUpRequests = ({ requests }) => {
    const idSchemeProps = [
        'outputDataElementIdScheme',
        'outputDataItemIdScheme',
        'outputOrgUnitIdScheme',
    ]
    return requests.map((request) => {
        const requestCopy = copyRequestWithValidProperties(request)

        // delete any ID Scheme prop with value of NONE
        for (const prop of idSchemeProps) {
            if (requestCopy[prop] === SCHEME_TYPES.none) {
                delete requestCopy[prop]
            }
        }
        return requestCopy
    })
}

const getFormIdSchemeValues = ({ values }) => {
    const idSchemeProps = [
        'idScheme',
        'dataElementIdScheme',
        'orgUnitIdScheme',
        'categoryOptionComboIdScheme',
    ]
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        const attributeProp = `target_${prop}_attribute`
        if (values[`target_${prop}`] !== SCHEME_TYPES.none) {
            idSchemeValues[prop] =
                values[`target_${prop}`] !== SCHEME_TYPES.attribute
                    ? values[`target_${prop}`]
                    : `ATTRIBUTE:${values[attributeProp]}`
        }
        return idSchemeValues
    }, {})
}

const getTargetDetails = ({ values }) => {
    const target = {
        type: values.type,
        request: {
            ...getFormIdSchemeValues({ values }),
        },
    }

    // add advanced fields if they exist (will exist for v41+)
    const advancedFields = ['skipAudit', 'dryRun', 'importStrategy']
    for (const field of advancedFields) {
        if (values[field] || values[field] === false) {
            target.request[field] = values[field]
        }
    }

    if (values.type === EXCHANGE_TYPES.internal) {
        return target
    }
    // upate to include api
    target.api = {
        url: values.url,
        accessToken: values.accessToken,
        username: values.username,
        password: values.password,
        authentication: values.authentication, // this will not actually be sent to backend
    }

    return target
}

export const getExchangeValuesFromForm = ({ values, requests }) => ({
    name: values.name,
    target: getTargetDetails({ values }),
    source: { requests: cleanUpRequests({ requests }) },
})

const getIdSchemeValues = ({ exchangeInfo }) => {
    const defaultSchemeProp = 'idScheme'
    const idSchemeProps = [
        defaultSchemeProp,
        'orgUnitIdScheme',
        'dataElementIdScheme',
        'categoryOptionComboIdScheme',
    ]
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        idSchemeValues[`target_${prop}`] = exchangeInfo.target?.request?.[prop]
            ? exchangeInfo.target.request?.[prop]?.split(':')[0]?.toUpperCase()
            : prop === defaultSchemeProp
            ? SCHEME_TYPES.uid
            : SCHEME_TYPES.none
        idSchemeValues[`target_${prop}_attribute`] =
            exchangeInfo.target?.request?.[prop]?.split(':')[1]
        return idSchemeValues
    }, {})
}

const getAdvancedValuesFromExchange = ({
    exchangeInfo,
    skipAuditDryRunImportStrategyAvailable,
}) => {
    if (!skipAuditDryRunImportStrategyAvailable) {
        return {}
    }
    return {
        importStrategy:
            exchangeInfo?.target?.request?.importStrategy ??
            IMPORT_STRATEGY_TYPES.create_and_update,
        dryRun: exchangeInfo?.target?.request?.dryRun ?? false,
        skipAudit: exchangeInfo?.target?.request?.skipAudit ?? false,
    }
}

export const getInitialValuesFromExchange = ({
    exchangeInfo,
    skipAuditDryRunImportStrategyAvailable,
}) => ({
    name: exchangeInfo.name,
    type: exchangeInfo.target?.type,
    authentication:
        !exchangeInfo?.target?.api || exchangeInfo.target?.api?.username
            ? AUTHENTICATION_TYPES.basic
            : AUTHENTICATION_TYPES.pat,
    url: exchangeInfo.target?.api?.url,
    username: exchangeInfo.target?.api?.username,
    ...getIdSchemeValues({ exchangeInfo }),
    ...getAdvancedValuesFromExchange({
        exchangeInfo,
        skipAuditDryRunImportStrategyAvailable,
    }),
})
