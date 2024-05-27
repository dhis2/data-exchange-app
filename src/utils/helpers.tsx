export const getNaturalCapitalization = (input) => {
    if (typeof input !== 'string') {
        return null
    }
    return input.slice(0, 1)?.toUpperCase() + input.slice(1).toLowerCase()
}
