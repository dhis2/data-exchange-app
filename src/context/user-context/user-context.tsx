import { createContext } from 'react'
import { CurrentUser } from '../../types/generated'

type UserContextType = Partial<CurrentUser> & {
    canAddExchange: boolean
    canDeleteExchange: boolean
    keyUiLocale: string
}
const UserContext = createContext<UserContextType>({
    id: '',
    canAddExchange: false,
    canDeleteExchange: false,
    organisationUnits: [],
    keyUiLocale: 'en',
})

export { UserContext }
