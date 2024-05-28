import { useConfig } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { FeatureToggleContext } from './feature-toggle-context.js'

const FeatureToggleProvider = ({ children }) => {
    const { apiVersion } = useConfig()

    const providerValue = {
        outputDataItemIdSchemeAvailable: apiVersion >= 41,
    }

    return (
        <FeatureToggleContext.Provider value={providerValue}>
            {children}
        </FeatureToggleContext.Provider>
    )
}

FeatureToggleProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

export { FeatureToggleProvider }
