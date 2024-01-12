import { EXCHANGE_TYPES, AUTHENTICATION_TYPES } from './edit-exchange-form.js'

export const getExchangeValuesFromForm = ({ values, requests }) => ({
    name: values.name,
    target: getAuthDetails({ values }),
    source: {
        requests,
    },
})

const getAuthDetails = ({ values }) => {
    if (values.type === EXCHANGE_TYPES.internal) {
        return { type: EXCHANGE_TYPES.internal }
    }
    const target = {
        type: EXCHANGE_TYPES.external,
        api: {
            url: values.url,
        },
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
