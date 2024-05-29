import { useContext } from 'react'
import { UserContext } from './user-context'

export const useUserContext = () => useContext(UserContext)
