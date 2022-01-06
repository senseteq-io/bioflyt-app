import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslations } from '@qonsoll/translation'
import { PageWrapper } from '@qonsoll/react-design'
import { useSaveData } from 'app/hooks'
import { StudySimpleForm } from 'bioflow/domains/Study/components'
import { STUDIES_MODEL_NAME } from 'bioflow/constants/collections'
import { useActivities } from 'bioflow/hooks'
import { useUserContext } from 'app/domains/User/contexts'
import { CREATE_STUDY } from 'bioflow/constants/activitiesTypes'

function StudyCreate() {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  const { save } = useSaveData()
  const { createActivity } = useActivities()
  const { firstName, lastName, email: adminEmail } = useUserContext()

  // [COMPONENT_STATE_HOOKS]
  const [loading, setLoading] = useState(false)
  // [CLEAN FUNCTIONS]
  const onSubmit = async ({ name }) => {
    setLoading(true)
    await save({
      collection: STUDIES_MODEL_NAME,
      data: { name },
      withNotification: true
    })
    createActivity({
      isTriggeredByAdmin: true,
      type: CREATE_STUDY,
      additionalData: {
        adminDisplayName: `${firstName} ${lastName}`,
        adminEmail,
        studyName: name
      }
    })

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
