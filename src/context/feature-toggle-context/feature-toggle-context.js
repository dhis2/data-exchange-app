import { createContext } from 'react'

const FeatureToggleContext = createContext({
    outputDataItemIdSchemeAvailable: false,
    skipAuditDryRunImportStrategyAvailable: false,
})

export { FeatureToggleContext }
