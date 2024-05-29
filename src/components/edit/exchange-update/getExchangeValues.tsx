import {
    SCHEME_TYPES,
    EXCHANGE_TYPES,
    AUTHENTICATION_TYPES,
} from '../shared/index'

export const getExchangeValuesFromForm = ({ values, requests }) => ({
    name: values.name,
    target: getTargetDetails({ values }),
    source: {
        requests,
    },
})

const getFormIdSchemeValues = ({ values }) => {
    const idSchemeProps = [
        'idScheme',
        'dataElementIdScheme',
        'orgUnitIdScheme',
        'categoryOptionComboIdScheme',
    ]
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        const attributeProp = `target_${prop}_attribute`
        idSchemeValues[prop] =
            values[`target_${prop}`] !== SCHEME_TYPES.attribute
                ? values[`target_${prop}`]
                : `ATTRIBUTE:${values[attributeProp]}`
        return idSchemeValues
    }, {})
}

type SchemesType =
    | 'idScheme'
    | 'dataElementIdScheme'
    | 'orgUnitIdScheme'
    | 'categoryOptionComboIdScheme'
type TargetDetailType = {
    type: string
    request: Partial<{
        [key in SchemesType]: any
    }>
    api?: {
        url: string
    }
}

const getTargetDetails = ({ values }) => {
    const target: TargetDetailType = {
        type: values.type,
        request: {
            ...getFormIdSchemeValues({ values }),
        },
    }
    if (values.type === EXCHANGE_TYPES.internal) {
        return target
    }
    // upate to include api
    target.api = {
        url: values.url,
    }

    if (values.authentication === AUTHENTICATION_TYPES.pat) {
        return {
            ...target,
            api: {
                ...target.api,
                accessToken: values.accessToken,
            },
        }
    }
    return {
        ...target,
        api: {
            ...target.api,
            username: values.username,
            password: values.password,
        },
    }
}

const getIdSchemeValues = ({ exchangeInfo }) => {
    const idSchemeProps = [
        'idScheme',
        'orgUnitIdScheme',
        'dataElementIdScheme',
        'categoryOptionComboIdScheme',
    ]
    return idSchemeProps.reduce((idSchemeValues, prop) => {
        idSchemeValues[`target_${prop}`] = exchangeInfo.target?.request?.[prop]
            ? exchangeInfo.target.request?.[prop]?.split(':')[0]?.toUpperCase()
            : SCHEME_TYPES.uid
        idSchemeValues[`target_${prop}_attribute`] =
            exchangeInfo.target?.request?.[prop]?.split(':')[1]
        return idSchemeValues
    }, {})
}

export const getInitialValuesFromExchange = ({ exchangeInfo }) => ({
    name: exchangeInfo.name,
    type: exchangeInfo.target?.type,
    authentication: exchangeInfo.target?.api?.username
        ? AUTHENTICATION_TYPES.basic
        : AUTHENTICATION_TYPES.pat,
    url: exchangeInfo.target?.api?.url,
    username: exchangeInfo.target?.api?.username,
    ...getIdSchemeValues({ exchangeInfo }),
})
