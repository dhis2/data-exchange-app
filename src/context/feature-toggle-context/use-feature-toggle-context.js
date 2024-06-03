import { useContext } from 'react'
import { FeatureToggleContext } from './feature-toggle-context.js'

export const useFeatureToggleContext = () => useContext(FeatureToggleContext)
