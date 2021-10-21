import { useSaveData } from 'app/hooks'
import { STUDIES } from 'bioflow/constants/collections'
import React, { useState } from 'react'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper } from '@qonsoll/react-design'
import { StudySimpleForm } from 'bioflow/domains/Study/components'
import { useHistory } from 'react-router'

function StudyCreate(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { save } = useSaveData()

  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  // [CLEAN FUNCTIONS]
  const onSubmit = async ({ name }) => {
    setLoading(true)
    await save({ collection: STUDIES, data: { name }, withNotification: true })
    history.goBack()
    setLoading(false)
  }

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
      <StudySimpleForm onSubmit={onSubmit} loading={loading} />
    </PageWrapper>
  )
}

StudyCreate.propTypes = {}

export default StudyCreate
