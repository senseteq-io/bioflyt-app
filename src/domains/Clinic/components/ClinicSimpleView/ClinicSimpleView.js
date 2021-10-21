import React, { Fragment, useMemo, useState } from 'react'
import { Tooltip } from 'antd'
import { Box, Card, Col, Row, Switch, Text, Title } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import { ClinicDrawerView } from '..'
import { useSaveData } from 'app/hooks'
import { useService } from 'bioflow/contexts/Service'

function ClinicSimpleView(props) {
  const { _id, name, clinicPlaces, bioflowAccess, places, therapists } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { update } = useSaveData()
  const { CLINICS_MODEL_NAME, USERS_MODEL_NAME } = useService()

  //[COMPONENT STATE HOOKS]
  const [isDrawerVisible, setIsDrawerVisible] = useState(false)

  //[COMPUTED PROPERTIES]
  const clinicPlacesNames = useMemo(() => {
    const computedPlaces = places?.filter((place) =>
      clinicPlaces?.includes(place?._id)
    )
    return computedPlaces?.map(({ name }) => name)
  }, [places, clinicPlaces])

  const currentClinicTherapists = useMemo(
    () => therapists?.filter((therapist) => therapist?.clinicId === _id),
    [therapists]
  )

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (bioflowAccess) => {
    update({
      collection: CLINICS_MODEL_NAME,
      id: _id,
      data: { bioflowAccess }
    })
    currentClinicTherapists?.forEach((therapist) => {
      if (therapist?._id) {
        update({
          collection: USERS_MODEL_NAME,
          id: therapist._id,
          data: { bioflowAccess },
          withNotification: false
        })
      }
    })
  }

  const onDrawerOpen = () => {
    setIsDrawerVisible(true)
  }

  const onDrawerClose = () => {
    setIsDrawerVisible(false)
  }

  return (
    <Fragment>
      <Card
        size="small"
        bordered={false}
        shadowless
        bg="var(--ql-color-dark-t-lighten6)"
        cursor="pointer"
        onClick={onDrawerOpen}>
        <Row v="center" noOuterGutters>
          <Col cw={9}>
            <Row noGutters>
              <Col cw={12} mb={2}>
                <Tooltip title={name}>
                  <Title variant="h5" isEllipsis>
                    {name}
                  </Title>
                </Tooltip>
              </Col>
              <Col cw={12}>
                <Text isEllipsis variant="caption1">
                  {clinicPlacesNames?.length
                    ? clinicPlacesNames.join(', ')
                    : t('No selected places')}
                </Text>
              </Col>
            </Row>
          </Col>
          <Col cw={3} v="center" pl={0}>
            <Box
              display="flex"
              justifyContent="end"
              onClick={(e) => e.stopPropagation()}>
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

      <ClinicDrawerView
        visible={isDrawerVisible}
        onDrawerClose={onDrawerClose}
        clinicName={name}
        clinicPlaces={clinicPlacesNames}
        bioflowAccess={bioflowAccess}
        onSwitchValueChange={onSwitchValueChange}
      />
    </Fragment>
  )
}

ClinicSimpleView.propTypes = {}

export default ClinicSimpleView
