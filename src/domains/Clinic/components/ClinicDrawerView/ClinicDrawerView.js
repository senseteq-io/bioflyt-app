import React, { useMemo } from 'react'
import { Drawer, Tooltip } from 'antd'
import { Box, Col, Row, Switch, Text } from '@qonsoll/react-design'
import { useTranslations } from '@qonsoll/translation'
import useMedia from 'use-media'

const WIDTHS = ['60vw', '35vw', '25vw', '15vw']

function ClinicDrawerView(props) {
  const { visible, onDrawerClose, clinicName, clinicPlaces } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const isPhoneMediaSize = useMedia({ maxWidth: 498 })
  const isTabletMediaSize = useMedia({ minWidth: 500, maxWidth: 780 })
  const isSmallLaptopMediaSize = useMedia({
    minWidth: 782,
    maxWidth: 1025
  })

  //[COMPUTED PROPERTIES]

  const drawerWidth = useMemo(() => {
    let width = [isPhoneMediaSize, isTabletMediaSize, isSmallLaptopMediaSize]
      .map((mediaSize, index) => mediaSize && WIDTHS[index])
      .filter((width) => width)?.[0]

    return width || '15vw'
  }, [isPhoneMediaSize, isTabletMediaSize, isSmallLaptopMediaSize])

  // [CLEAN FUNCTIONS]
  const onSwitchValueChange = (isBioflowEnabled) => {
    console.log(isBioflowEnabled)
  }

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
                defaultChecked={false}
                onChange={onSwitchValueChange}
              />
            </Tooltip>
          </Box>
        </Col>
        <Col cw={12}>
          <Text>{t('places')}:</Text>
        </Col>
        <Col cw={12}>
          {clinicPlaces?.map((place) => (
            <Text type="secondary">{place}</Text>
          ))}
        </Col>
      </Row>
    </Drawer>
  )
}

ClinicDrawerView.propTypes = {}

export default ClinicDrawerView
