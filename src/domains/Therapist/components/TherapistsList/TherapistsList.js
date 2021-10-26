import React, { Fragment } from 'react'
import { useHistory } from 'react-router'
import { useTranslations } from '@qonsoll/translation'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { ListWithCreate } from 'app/components'
import { TherapistSimpleView } from '..'
import { BIOFLOW_ADMIN_THERAPIST_INVITE_PATH } from 'bioflow/constants/paths'
import { BIOFLOW_THERAPIST_ROLE } from 'app/constants/userRoles'
import { INVITATIONS_MODEL_NAME, USERS_MODEL_NAME } from 'app/constants/models'
import { BIOFLOW_THERAPIST_INVITATION_TYPE } from 'app/constants/invitationTypes'
import firebase from 'firebase'
import { Box, Divider, Title } from '@qonsoll/react-design'
import TherapistInviteView from '../TherapistInviteView'

const LIST_GRID = {
  gutter: [32, 16],
  xs: 1,
  sm: 1,
  md: 1,
  lg: 2,
  xl: 4,
  xxl: 4
}

function TherapistsList(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()

  const [invitations = []] = useCollectionData(
    firebase
      .firestore()
      .collection(INVITATIONS_MODEL_NAME)
      .where('type', '==', BIOFLOW_THERAPIST_INVITATION_TYPE)
  )
  const [therapists = []] = useCollectionData(
    firebase
      .firestore()
      .collection(USERS_MODEL_NAME)
      .where('role', '==', BIOFLOW_THERAPIST_ROLE)
      .where('isTemporaryPasswordResolved', '==', true)
  )

  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const goToInviteTherapist = () => {
    history.push(BIOFLOW_ADMIN_THERAPIST_INVITE_PATH)
  }

  return (
    <Fragment>
      {invitations && !!invitations.length && (
        <Box>
          <Box mb={24}>
            <Title level={4}>{t('Invitations')}</Title>
          </Box>
          <ListWithCreate
            grid={LIST_GRID}
            dataSource={invitations}
            withCreate={false}>
            <TherapistInviteView />
          </ListWithCreate>
          <Divider />
        </Box>
      )}

      <ListWithCreate
        grid={LIST_GRID}
        createHeight={340}
        dataSource={therapists}
        createVariant="large"
        createText={t('Invite therapist')}
        onCreate={goToInviteTherapist}>
        <TherapistSimpleView />
      </ListWithCreate>
    </Fragment>
  )
}

TherapistsList.propTypes = {}

export default TherapistsList
