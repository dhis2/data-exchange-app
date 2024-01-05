import { createContext } from 'react'

const AppContext = createContext({
    aggregateDataExchanges: [],
    refetchExchanges: () => {
        console.log('NOT IMPLEMNTED')
    },
})

export { AppContext }
