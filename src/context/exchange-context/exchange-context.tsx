import { createContext } from 'react'
import { ExchangeData } from '../../types'
import { AggregateDataExchange } from '../../types/generated'

type ExchangeContextType = {
    exchange: AggregateDataExchange | null
    exchangeData: ExchangeData
    refetch?: VoidFunction
}
const ExchangeContext = createContext<ExchangeContextType>({
    exchange: null,
    exchangeData: null,
    refetch: () => {
        console.log('exchange context not initialized')
    },
})

export { ExchangeContext }
