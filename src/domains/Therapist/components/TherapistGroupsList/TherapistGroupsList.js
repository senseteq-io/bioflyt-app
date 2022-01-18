import React, { useEffect, Fragment, useMemo, useState } from 'react'
import {
  Box,
  Col,
  Divider,
  NoData,
  Row,
  Text,
  Title
} from '@qonsoll/react-design'
import { Spin, Grid } from 'antd'
import { getTherapistGroupsData } from '../../helpers'
import { useTranslations } from '@qonsoll/translation'
import { Icon } from '@qonsoll/icons'

const { useBreakpoint } = Grid

const TherapistGroupsList = (props) => {
  const { initializedUserId, clinics } = props

  const { t } = useTranslations()
  const { xs } = useBreakpoint()

  const [groupDataLoading, setGroupDataLoading] = useState(true)
  const [additionalTherapistData, setAdditionalTherapistData] = useState({})

  const { clinicsData, groupsData, disordersData, studiesData } =
    additionalTherapistData || {}

  const isTherapistHasGroups =
    additionalTherapistData?.disordersData &&
    Object.keys?.(additionalTherapistData?.disordersData)?.length
  const clinicIds = useMemo(() => Object.keys(clinics), [clinics])

  const filteredClinicIds = useMemo(
    () =>
      clinicIds.length
        ? clinicIds?.filter(
            (clinicId) => groupsData?.[clinicId]?.length && clinicId
          )
        : [],
    [clinicIds, groupsData]
  )

  const groupListSize = useMemo(() => (xs ? '250px' : '300px'), [xs])
  const getMarginForClinicGroupsList = (index) =>
    filteredClinicIds?.length - 1 !== index ? 3 : 0

  //[CLEAN_FUNCTIONS]
  const getClinicName = (clinicId) =>
    `${t('Clinic')}: ${
      clinicsData?.filter((clinic) => clinic?._id === clinicId)?.[0]?.name
    }`

  const getGroupFieldName = (field, groupData) => {
    const fieldText = {
      groupName: `${t('Week')} ${groupData?.weekNumber}`,
      study: studiesData?.[groupData?.studyId] || t('Study was deleted'),
      disorder:
        disordersData?.[groupData?.disorderId] || t('Disorder was deleted')
    }

    return fieldText[field]
  }

  const isLastGroupItem = (clinicId, index) =>
    groupsData?.[clinicId]?.length - 1 !== index

  //[USE_EFFECTS]
  useEffect(() => {
    if (groupDataLoading && !additionalTherapistData.length) {
      getTherapistGroupsData(Object.keys(clinics), initializedUserId).then(
        (data) => {
          setAdditionalTherapistData(data)
          setGroupDataLoading(false)
        }
      )
    } else {
      setGroupDataLoading(false)
    }
  }, [groupDataLoading, additionalTherapistData])

  if (groupDataLoading) {
    return (
      <Box display="flex" flex={1} justifyContent="center" alignItems="center">
        <Spin />
      </Box>
    )
  }

  if (!isTherapistHasGroups) {
    return (
      <Fragment>
        <NoData description={t('Therapist has no groups')} />
      </Fragment>
    )
  }

  return (
    <Box
      maxHeight={groupListSize}
      width={groupListSize}
      overflow="auto"
      mx={-3}
      pl={3}
      pr={2}>
      {filteredClinicIds?.map((clinicId, i) => (
        <Box key={i} mb={getMarginForClinicGroupsList(i)}>
          <Row mb={2} noGutters>
            <Col cw={12}>
              <Title level={5}>{getClinicName(clinicId)}</Title>
            </Col>
          </Row>
          {groupsData?.[clinicId]?.map((group, index) => (
            <Fragment>
              <Row key={`${i}${index}`} noGutters mb={1}>
                <Col cw="auto" mr={3}>
                  <Icon
                    name="BioGroupFilled"
                    size={24}
                    fill="var(--ql-color-dark-t-lighten2)"
                  />
                </Col>
                <Col v="center">
                  <Text>{getGroupFieldName('groupName', group)}</Text>
                </Col>
              </Row>
              <Row noGutters mb={1} v="center">
                <Col cw="auto" mr={3}>
                  <Icon
                    name="StudyFilled"
                    size={24}
                    fill="var(--ql-color-dark-t-lighten2)"
                  />
                </Col>
                <Col>
                  <Text type="secondary">
                    {getGroupFieldName('study', group)}
                  </Text>
                </Col>
              </Row>
              <Row noGutters mb={1} v="center">
                <Col cw="auto" mr={3}>
                  <Icon
                    name="DisorderFilled"
                    size={24}
                    fill="var(--ql-color-dark-t-lighten2)"
                  />
                </Col>
                <Col v="center">
                  <Text type="secondary">
                    {getGroupFieldName('disorder', group)}
                  </Text>
                </Col>
              </Row>
              {isLastGroupItem(clinicId, index) && (
                <Row noGutters>
                  <Col cw={12}>
                    <Divider type="horizontal" mt={1} mb={12} />
                  </Col>
                </Row>
              )}
            </Fragment>
          ))}
        </Box>
      ))}
    </Box>
  )
}

export default TherapistGroupsList
