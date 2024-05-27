import { useContext } from 'react'
import { UserContext } from './user-context.js'

export const useUserContext = () => useContext(UserContext)
