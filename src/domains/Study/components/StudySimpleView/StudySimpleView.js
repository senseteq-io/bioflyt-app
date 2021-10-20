import React from 'react'
import { Box, Card, Text } from '@qonsoll/react-design'
import { Tooltip } from 'antd'
import { EditRemove } from 'app/components'

function StudySimpleView(props) {
  const { name } = props
  // const { ADDITIONAL_DESTRUCTURING_HERE } = user

  // [ADDITIONAL HOOKS]
  // const { t } = useTranslation('translation')
  // const { currentLanguage } = t

  // [COMPONENT STATE HOOKS]
  // const [state, setState] = useState({})

  // [COMPUTED PROPERTIES]

  // [CLEAN FUNCTIONS]
  const handleEdit = () => {}
  const handleRemove = () => {}

  return (
    <Card
      size="small"
      bordered={false}
      shadowless
      bg="var(--ql-color-dark-t-lighten6)">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        px={3}>
        <Tooltip title={name}>
          <Text variant="h5" isEllipsis>
            {name}
          </Text>
        </Tooltip>
        <Box minWidth="88px">
          <EditRemove onEdit={handleEdit} onRemove={handleRemove} name={name} />
        </Box>
      </Box>
    </Card>
  )
}

StudySimpleView.propTypes = {}

export default StudySimpleView
