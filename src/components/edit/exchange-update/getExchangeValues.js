import {
    SCHEME_TYPES,
    EXCHANGE_TYPES,
    AUTHENTICATION_TYPES,
} from '../shared/index.js'

export const getExchangeValuesFromForm = ({ values, requests }) => ({
    name: values.name,
    target: getTargetDetails({ values }),
    source: {
        requests,
    },
})

const getTargetDetails = ({ values }) => {
    const target = {
        type: values.type,
        request: {
            idScheme:
                values.target_idScheme !== SCHEME_TYPES.attribute
                    ? values.target_idScheme
                    : `ATTRIBUTE:${values.target_idScheme_attribute}`,
            dataElementIdScheme:
                values.target_dataElementIdScheme !== SCHEME_TYPES.attribute
                    ? values.target_idScheme
                    : `ATTRIBUTE:${values.target_dataElementIdScheme_attribute}`,
            orgUnitIdScheme:
                values.target_orgUnitIdScheme !== SCHEME_TYPES.attribute
                    ? values.target_orgUnitIdScheme
                    : `ATTRIBUTE:${values.target_orgUnitIdScheme_attribute}`,
            categoryOptionComboIdScheme:
                values.target_categoryOptionComboIdScheme !==
                SCHEME_TYPES.attribute
                    ? values.target_orgUnitIdScheme
                    : `ATTRIBUTE:${values.target_categoryOptionComboIdScheme_attribute}`,
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

export const getInitialValuesFromExchange = ({ exchangeInfo }) => ({
    name: exchangeInfo.name,
    type: exchangeInfo.target?.type,
    authentication: exchangeInfo.target?.api?.username
        ? AUTHENTICATION_TYPES.basic
        : AUTHENTICATION_TYPES.pat,
    url: exchangeInfo.target?.api?.url,
    username: exchangeInfo.target?.api?.username,
    target_idScheme: exchangeInfo.target?.request?.idScheme
        ? exchangeInfo.target.request.idScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    target_idScheme_attribute:
        exchangeInfo.target?.request?.idScheme.split(':')[1],
    target_orgUnitIdScheme: exchangeInfo.target?.request?.orgUnitIdScheme
        ? exchangeInfo.target.request.orgUnitIdScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    target_orgUnitIdScheme_attribute:
        exchangeInfo.target?.request?.orgUnitIdScheme?.split(':')[1],
    target_dataElementIdScheme: exchangeInfo.target?.request
        ?.dataElementIdScheme
        ? exchangeInfo.target.request.dataElementIdScheme.split(':')[0]
        : SCHEME_TYPES.uid,
    target_dataElementIdScheme_attribute:
        exchangeInfo.target?.request?.dataElementIdScheme?.split(':')[1],
    target_categoryOptionComboIdScheme: exchangeInfo.target?.request
        ?.categoryOptionComboIdScheme
        ? exchangeInfo.target?.request?.categoryOptionComboIdScheme.split(
              ':'
          )[0]
        : SCHEME_TYPES.uid,
    target_categoryOptionComboIdScheme_attribute:
        exchangeInfo.target?.request?.categoryOptionComboIdScheme?.split(
            ':'
        )[1],
})
