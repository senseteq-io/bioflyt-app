import React, { useMemo } from 'react'
import { Drawer, Tooltip, Grid } from 'antd'
import { Box, Col, Row, Switch, Text } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'

const { useBreakpoint } = Grid

const WIDTHS = ['15vw', '25vw', '35vw', '60vw']

function ClinicDrawerView(props) {
  const {
    visible,
    onDrawerClose,
    clinicName,
    clinicPlaces,
    bioflowAccess,
    onSwitchValueChange
  } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()

  const { xs, md, lg, xl } = useBreakpoint()

  //[COMPUTED PROPERTIES]
  const drawerWidth = useMemo(() => {
    let width = [xl, lg, md, xs]
      .map((mediaSize, index) => mediaSize && WIDTHS[index])
      .filter((width) => width)?.[0]

    return width
  }, [xl, lg, md, xs])

  // [CLEAN FUNCTIONS]

  return (
    <Drawer
      closable
      width={drawerWidth}
      title={clinicName}
      placement="right"
      onClose={onDrawerClose}
      visible={visible}>
      <Row noGutters>
        <Col cw={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}>
            <Text variant="h5" isEllipsis>
              {t('Bioflow')}
            </Text>

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
        <Col cw={12}>
          <Text>{t('places')}:</Text>
        </Col>
        <Col cw={12}>
          {clinicPlaces?.length ? (
            clinicPlaces.map((place) => <Text type="secondary">{place}</Text>)
          ) : (
            <Text type="secondary">{t('No selected places')}</Text>
          )}
        </Col>
      </Row>
    </Drawer>
  )
}

ClinicDrawerView.propTypes = {}

export default ClinicDrawerView
