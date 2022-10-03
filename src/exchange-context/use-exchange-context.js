import { useContext } from 'react'
import { ExchangeContext } from './exchange-context.js'

export const useExchangeContext = () => useContext(ExchangeContext)
