import React from 'react'
import { useHistory } from 'react-router'
import { useTranslations } from '@qonsoll/translation'
import { ListWithCreate } from 'app/components'
import { TherapistSimpleView } from '..'
import { BIOFLOW_ADMIN_THERAPIST_INVITE_PATH } from 'bioflow/constants/paths'
import { THERAPISTS } from 'bioflow/constants/collections'

const MOCK_THERAPISTS = [
  {
    firstName: 'Trond',
    lastName: 'Klaboe',
    email: 'trond.claboe@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Oleksandr',
    lastName: 'Kazhuro',
    email: 'sasha@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Maxim',
    lastName: 'Makarov',
    email: 'maxim@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  },
  {
    firstName: 'Trond',
    lastName: 'Klaboe',
    email: 'trond.claboe@foidev.com',
    groups: [
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Oslo',
        clinic: 'foi'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Bergen'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Toronto'
      },
      {
        name: 'Test name',
        clinicName: 'Test clinic name',
        clinicLocation: 'Kyiv'
      }
    ]
  }
]

function TherapistsList(props) {
  // [ADDITIONAL HOOKS]
  const history = useHistory()
  const { t } = useTranslations()
  // [COMPONENT STATE HOOKS]

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const goToInviteTherapist = () => {
    history.push(BIOFLOW_ADMIN_THERAPIST_INVITE_PATH)
  }

  return (
    <ListWithCreate
      grid={{
        gutter: [32, 16],
        xs: 1,
        sm: 1,
        md: 1,
        lg: 2,
        xl: 4,
        xxl: 4
      }}
      createVariant="large"
      createText={t('Invite therapist')}
      onCreate={goToInviteTherapist}
      collection={THERAPISTS}
      withCreate
      dataSource={MOCK_THERAPISTS}>
      <TherapistSimpleView />
    </ListWithCreate>
  )
}

TherapistsList.propTypes = {}

export default TherapistsList
