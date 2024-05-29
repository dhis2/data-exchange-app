export const requestsReducer = (state, action) => {
    switch (action.type) {
        case 'ADD': {
            return [...state, action.value]
        }
        case 'UPDATE': {
            const targetIndex = action.index // maybe look up by old name?
            const modifiedRequest = { ...state[targetIndex], ...action.value }
            return [
                ...state.slice(0, targetIndex),
                modifiedRequest,
                ...state.slice(targetIndex + 1),
            ]
        }
        case 'DELETE': {
            const targetIndex = action.index // maybe look up by old name?
            return [
                ...state.slice(0, targetIndex),
                ...state.slice(targetIndex + 1),
            ]
        }
    }
    throw Error('Unknown action: ' + action.type)
}
