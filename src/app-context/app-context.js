import { createContext } from 'react'

const AppContext = createContext({
    aggregateDataExchanges: [],
    refetchExchanges: () => {
        console.log('Not implemented')
    },
})

export { AppContext }
