import { SCHEME_TYPES } from '../shared/scheme-selector.js'
import { EXCHANGE_TYPES, AUTHENTICATION_TYPES } from './edit-exchange-form.js'

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
        console.log(target)
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
