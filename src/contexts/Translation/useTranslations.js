import { useContext } from 'react'
import TranslationContext from './TranslationContext'

/**
 * @returns {function(string):string}
 */
const useTranslations = () => useContext(TranslationContext)

export default useTranslations
