import React from 'react'
import { Container } from '@qonsoll/react-design'
import { StudyList } from 'bioflow/domains/Study/components'

function StudiesAll(props) {
  // [ADDITIONAL HOOKS]
  // const { t } = useTranslation('translation')
  // const { currentLanguage } = t

  // [COMPONENT STATE HOOKS]
  // const [state, setState] = useState({})

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]

  return (
    <Container mt={4}>
      <StudyList />
    </Container>
  )
}

StudiesAll.propTypes = {}

export default StudiesAll
