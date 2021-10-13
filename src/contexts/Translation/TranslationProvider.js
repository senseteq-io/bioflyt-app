import PropTypes from 'prop-types'
import TranslationContext from './TranslationContext'

const TranslationProvider = (props) => {
  const { t, ...rest } = props
  const translation = (text) => text
  return <TranslationContext.Provider value={t || translation} {...rest} />
}

TranslationProvider.propTypes = {
  t: PropTypes.func.isRequired
}

export default TranslationProvider
