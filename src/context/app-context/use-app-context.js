import { useContext } from 'react'
import { AppContext } from './app-context.js'

export const useAppContext = () => useContext(AppContext)
