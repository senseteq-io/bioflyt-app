import PropTypes from 'prop-types'
import ServiceContext from './ServiceContext'

const ServiceProvider = (props) => {
  const { collections, ...rest } = props

  return <ServiceContext.Provider value={collections} {...rest} />
}

ServiceProvider.propTypes = {
  collections: PropTypes.object.isRequired
}

export default ServiceProvider
