import { useContext } from 'react'
import { ExchangeContext } from './exchange-context'

export const useExchangeContext = () => useContext(ExchangeContext)
