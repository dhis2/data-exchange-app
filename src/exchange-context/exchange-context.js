import { createContext } from 'react'

const ExchangeContext = createContext({
    exchange: {},
    refetch: () => {
        console.log('exchange context not initialized')
    },
})

export { ExchangeContext }
