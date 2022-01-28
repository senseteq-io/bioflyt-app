import React from 'react'
import { Row, Col, Box } from '@qonsoll/react-design'

const TherapistCard = ({
  avatarUrl,
  children,
  onClick,
  rightActions,
  leftActions,
  height
}) => {
  // [COMPONENT STATE HOOKS]

  // [HELPER FUNCTIONS]

  return (
    <Box
      height={height || '340px'}
      overflow="hidden"
      borderRadius="16px"
      zIndex={2}
      onClick={onClick}>
      <Box
        p={3}
        height="100%"
        bg={!avatarUrl && 'var(--ql-color-dark-t-lighten6)'}
        display="flex"
        flexDirection="column"
        position="relative"
        backgroundImage={`linear-gradient(to bottom, var(--ql-color-dark-t-lighten6) 75%, var(--ql-color-dark-t-lighten3))`}>
        {/* Background */}
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          zIndex={-1}
          backgroundImage={
            avatarUrl ? `url(${avatarUrl})` : 'url(/icons/user.svg)'
          }
          backgroundSize={!avatarUrl ? '128px 128px' : 'cover'}
          backgroundRepeat="no-repeat"
          backgroundAttachment="fixed"
          backgroundPosition={!avatarUrl ? '50% 72px' : 'center'}
        />
        {/* Background */}
        <Row mt="auto">
          <Col cw={12}>{children}</Col>
        </Row>
        {rightActions && (
          <Box
            position="absolute"
            right={16}
            className="animate__animated  animate__fadeInRight"
            style={{ animationDuration: '0.4s' }}>
            {rightActions}
          </Box>
        )}

        {leftActions && (
          <Box
            position="absolute"
            left={16}
            className="animate__animated  animate__fadeInRight"
            style={{ animationDuration: '0.4s' }}>
            {leftActions}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default TherapistCard
