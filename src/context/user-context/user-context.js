import { createContext } from 'react'

const UserContext = createContext({
    id: '',
    canAddExchange: false,
    canDeleteExchange: false,
    organisationUnits: [],
})

export { UserContext }
