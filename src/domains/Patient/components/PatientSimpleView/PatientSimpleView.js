import React, { Fragment, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import firebase from 'firebase'
import { Modal, Tooltip } from 'antd'
import { useTranslations } from '@qonsoll/translation'
import { Box, Button, Card, Icon, Text } from '@qonsoll/react-design'
import { CheckOutlined, SendOutlined } from '@ant-design/icons'
import { useBioflowAccess } from 'bioflow/hooks'
import { PatientSimpleForm } from '..'
import { useSaveData } from 'app/hooks'
import { GROUPS_MODEL_NAME } from 'bioflow/constants/collections'

const successIconStyles = {
  display: 'flex',
  alignItems: 'center',
  color: 'var(--ql-color-success)',
  fontSize: 'var(--ql-typography-font-size-lg)',
  height: 'var(--btn-height-base)'
}
const DATE_FORMAT_FOR_CONDITIONS = 'DD-MM-YYYY'
const checkIsTodayDate = (date) =>
  moment(date?.toDate()).format(DATE_FORMAT_FOR_CONDITIONS) ===
  moment().format(DATE_FORMAT_FOR_CONDITIONS)

function PatientSimpleView(props) {
  const {
    id: patientId,
    name,
    groupId,
    patients,
    firstDay,
    fourthDay,
    threeMonthDay,
    firstDayBIOCollected,
    fourthDayBIOCollected,
    threeMonthDayBIOCollected,
    onDeliverBio
  } = props

  // [ADDITIONAL HOOKS]
  const { t } = useTranslations()
  const { isAdmin } = useBioflowAccess()
  const { update } = useSaveData()

  //[COMPONENT STATE HOOKS]
  const [isModalVisible, setIsModalVisible] = useState(false)

  //[COMPUTED PROPERTIES]
  const isTodayFirstDay = checkIsTodayDate(firstDay)
  const isTodayFourthDay = checkIsTodayDate(fourthDay)
  const isTodayThreeMonthDay = threeMonthDay && checkIsTodayDate(threeMonthDay)

  const isBIOCollectEnabled = useMemo(
    () => isTodayFirstDay || isTodayFourthDay || isTodayThreeMonthDay,
    [firstDay, fourthDay]
  )

  const nextTimeBIOCollect = useMemo(() => {
    const nextBioDate =
      (isTodayFirstDay && fourthDay) || (isTodayFourthDay && threeMonthDay)

    return nextBioDate
      ? `${t('Next bio collect on')} ${moment(nextBioDate?.toDate()).format(
          'D MMM YYYY'
        )}`
      : t('All stages of bio were collected')
  }, [fourthDay, isTodayFirstDay, isTodayFourthDay, threeMonthDay])

  //if today collect bio day and bio was collected
  //and when fourth day and date for three month was set - show success icon
  const isSuccessIconVisible = useMemo(
    () =>
      (isTodayFirstDay && firstDayBIOCollected) ||
      (isTodayFourthDay && fourthDayBIOCollected) ||
      threeMonthDayBIOCollected,
    [
      firstDayBIOCollected,
      fourthDayBIOCollected,
      threeMonthDayBIOCollected,
      isTodayFirstDay,
      isTodayFourthDay
    ]
  )

  const isDeliverBioButtonVisible = useMemo(() => !isSuccessIconVisible, [
    isSuccessIconVisible
  ])

  //if user is therapist and today is fourth collect bio day
  //and date for three month visit wasn`t set - show set date button
  const setThreeMonthDateButtonVisible = useMemo(
    () =>
      !isAdmin && isTodayFourthDay && fourthDayBIOCollected && !threeMonthDay,
    [isAdmin, isTodayFourthDay, fourthDayBIOCollected, threeMonthDay]
  )

  //[CLEAN FUNCTIONS]
  const onOpenModal = () => {
    setIsModalVisible(true)
  }

  const onCloseModal = () => {
    setIsModalVisible(false)
  }

  const onSetThreeMonthDate = ({ threeMonthDay }) => {
    //find index of updated patient in patients array
    const patientIndex = patients?.findIndex(
      (patient) => patient?.id === patientId
    )

    //set three month date visit to patient data in firebase timestamp format
    if (patientIndex >= 0 && threeMonthDay && groupId && patientId) {
      patients[
        patientIndex
      ].threeMonthDay = firebase.firestore.Timestamp.fromDate(
        new Date(threeMonthDay)
      )

      update({
        collection: GROUPS_MODEL_NAME,
        id: groupId,
        data: { patients }
      })
    }
    setIsModalVisible(false)
  }

  const onClickDeliverBio = () => {
    onDeliverBio(props)
  }

  return (
    <Fragment>
      <Card
        shadowless
        bordered={false}
        size="small"
        bg="var(--ql-color-dark-t-lighten6)">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Tooltip title={name}>
            <Text isEllipsis pr={3}>
              {name}
            </Text>
          </Tooltip>
          <Box>
            {isDeliverBioButtonVisible && (
              <Tooltip
                title={
                  isAdmin ? t("Admin can't collect BIO") : t('Deliver Bio')
                }>
                <Box>
                  <Button
                    ghost
                    type="primary"
                    onClick={onClickDeliverBio}
                    disabled={!isBIOCollectEnabled || isAdmin}
                    icon={<SendOutlined />}
                  />
                </Box>
              </Tooltip>
            )}
            {isSuccessIconVisible && !setThreeMonthDateButtonVisible && (
              <Tooltip title={nextTimeBIOCollect}>
                <Icon {...successIconStyles} component={<CheckOutlined />} />
              </Tooltip>
            )}
            {setThreeMonthDateButtonVisible && (
              <Button ghost type="primary" onClick={onOpenModal}>
                {t('Set three month date')}
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      <Modal centered visible={isModalVisible} closable={false} footer={null}>
        <PatientSimpleForm
          onCancel={onCloseModal}
          onSubmit={onSetThreeMonthDate}
        />
      </Modal>
    </Fragment>
  )
}

PatientSimpleView.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  patients: PropTypes.array.isRequired,
  firstDay: PropTypes.object.isRequired,
  fourthDay: PropTypes.object.isRequired,
  threeMonthDay: PropTypes.object.isRequired,
  firstDayBIOCollected: PropTypes.bool.isRequired,
  fourthDayBIOCollected: PropTypes.bool.isRequired,
  threeMonthDayBIOCollected: PropTypes.bool.isRequired,
  onDeliverBio: PropTypes.func
}

export default PatientSimpleView
