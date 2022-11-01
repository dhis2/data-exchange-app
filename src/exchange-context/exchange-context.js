import { createContext } from 'react'

const ExchangeContext = createContext({
    exchange: {},
    exchangeData: {},
    refetch: () => {
        console.log('exchange context not initialized')
    },
})

export { ExchangeContext }
