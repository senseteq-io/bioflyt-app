import React from 'react'
import { Tooltip } from 'antd'
import { Box, Card, Col, Row, Switch, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { useSaveData } from 'app/hooks'
import { useActivities } from 'bioflow/hooks'
import { useUserContext } from 'app/domains/User/contexts'
import { CLINICS_MODEL_NAME } from 'app/constants/models'
import { CHANGE_CLINIC_BIOFLOW_ACCESS } from 'bioflow/constants/activitiesTypes'

function ClinicSimpleView(props) {
  const { _id, name, bioflowAccess } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { update } = useSaveData()
  const { firstName, lastName, email: adminEmail } = useUserContext()
  const { createActivity } = useActivities()

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (bioflowAccess) => {
    update({
      collection: CLINICS_MODEL_NAME,
      id: _id,
      data: { bioflowAccess }
    })

    createActivity({
      isTriggeredByAdmin: true,
      type: CHANGE_CLINIC_BIOFLOW_ACCESS,
      additionalData: {
        adminEmail,
        adminDisplayName: `${firstName} ${lastName}`,
        clinicName: name,
        clinicBioflowAccess: bioflowAccess
      }
    })
  }

  return (
    <Card
      size="small"
      bordered={false}
      shadowless
      bg="var(--ql-color-dark-t-lighten6)">
      <Row v="center" noOuterGutters>
        <Col cw={9} v="center" pr={2}>
          <Tooltip title={name}>
            <Title variant="h5" isEllipsis>
              {name}
            </Title>
          </Tooltip>
        </Col>
        <Col cw={3} v="center" pl={0}>
          <Box display="flex" justifyContent="end" alignItems="center">
            <Tooltip
              title={`${t(
                'Allows to enable or disable Bioflow functionality for this clinic'
              )}.`}>
              <Switch
                checkedChildren={t('on')}
                unCheckedChildren={t('off')}
                defaultChecked={bioflowAccess}
                onChange={onSwitchValueChange}
              />
            </Tooltip>
          </Box>
        </Col>
      </Row>
    </Card>
  )
}

ClinicSimpleView.propTypes = {}

export default ClinicSimpleView
