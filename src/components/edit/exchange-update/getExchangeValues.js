export const getExchangeValuesFromForm = ({ values, requests }) => ({
    name: values.name,
    target: {
        type: values.type,
        url: values.url,
    },
    source: {
        requests,
    },
})
