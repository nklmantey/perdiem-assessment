import { View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'
import { Button } from '@/components/ui'

type ConfirmationStepProps = {
	selectedDate: Date
	selectedTime: Date
	onConfirm: () => void
	onStartOver: () => void
	onReschedule: () => void
}

export function ConfirmationStep({ selectedDate, selectedTime, onConfirm, onStartOver, onReschedule }: ConfirmationStepProps) {
	return (
		<ConfirmContainer>
			<Typography weight='median' size='base'>
				Confirm Schedule
			</Typography>
			<Typography variant='secondary' size='sm'>
				Date:{' '}
				{selectedDate.toLocaleDateString('en-US', {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</Typography>
			<Typography variant='secondary' size='sm'>
				Time: {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
			</Typography>
			<Button title='Confirm' onPress={onConfirm} />
			<Button title='Reschedule' variant='secondary' onPress={onReschedule} />
		</ConfirmContainer>
	)
}

const ConfirmContainer = styled(View)`
	gap: 12px;
`
