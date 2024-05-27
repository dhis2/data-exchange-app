import { useContext } from 'react'
import { AttributeContext } from './attribute-context'

export const useAttributeContext = () => useContext(AttributeContext)
