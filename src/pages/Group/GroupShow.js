import React, { useState } from 'react'
import { Box, Button, PageWrapper, Title } from '@qonsoll/react-design'
import { PatientsList } from 'bioflow/domains/Patient/components'
import { LineChartOutlined, SettingOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router'
import { useBioflowAccess } from 'bioflow/hooks'
import { useTranslations } from '@qonsoll/translation'
import {
  BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH,
  BIOFLOW_GROUP_ACTIVITIES_PATH
} from 'bioflow/constants/paths'

//TODO replace to data from db
const group = { name: 'Week 36' }

function GroupShow(props) {
  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const history = useHistory()
  const { isAdmin } = useBioflowAccess()

  //[COMPONENT STATE HOOKS]
  const [isActivated, setIsActivated] = useState(false)

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const goToActivities = () => {
    history.push(
      isAdmin
        ? BIOFLOW_ADMIN_GROUP_ACTIVITIES_PATH
        : BIOFLOW_GROUP_ACTIVITIES_PATH
    )
  }

  const goToSettings = () => {
    // TODO add route for Group settings
    // history.push()
  }

  const activateGroup = () => {
    setIsActivated(true)
  }

  const actionPanel = (
    <Box display="flex" alignItems="center">
      <Button
        mr={3}
        type="text"
        icon={<LineChartOutlined />}
        onClick={goToActivities}>
        {t('Activities')}
      </Button>
      <Button
        mr={3}
        type="text"
        icon={<SettingOutlined />}
        onClick={goToSettings}>
        {t('Settings')}
      </Button>
      <Button type="primary" disabled={isActivated} onClick={activateGroup}>
        {t('Activate')}
      </Button>
    </Box>
  )

  return (
    <PageWrapper
      onBack={() => history.goBack()}
      headingProps={{
        title: group?.name,
        subTitle: t('Patients'),
        titleSize: 2,
        textAlign: 'left',
        marginBottom: 48
      }}
      action={actionPanel}>
      <PatientsList />
    </PageWrapper>
  )
}

GroupShow.propTypes = {}

export default GroupShow
