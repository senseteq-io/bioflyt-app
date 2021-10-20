import React from 'react'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper } from '@qonsoll/react-design'
import { StudySimpleForm } from 'bioflow/domains/Study/components'
import { useHistory } from 'react-router'

function StudyCreate(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()

  // [CLEAN FUNCTIONS]
  const onSubmit = ({ name }) => {}

  return (
    <PageWrapper
      onBack={() => history.goBack()}
      alignMiddle
      contentWidth={['100%', '80%', '70%', '50%', '40%']}
      headingProps={{
        title: t('Create new study'),
        titleSize: 2,
        textAlign: 'center',
        marginBottom: 32
      }}>
      <StudySimpleForm onSubmit={onSubmit} />
    </PageWrapper>
  )
}

StudyCreate.propTypes = {}

export default StudyCreate
