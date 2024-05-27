import { useContext } from 'react'
import { AttributeContext } from './attribute-context.js'

export const useAttributeContext = () => useContext(AttributeContext)
