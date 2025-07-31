import { View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'
import { Button } from '@/components/ui'

type AppointmentDisplayProps = {
	appointment: {
		formattedDate: string
		formattedTime: string
	}
	onReschedule: () => void
}

export function AppointmentDisplay({ appointment, onReschedule }: AppointmentDisplayProps) {
	return (
		<AppointmentContainer>
			<Typography weight='median' size='lg'>
				Your Appointment
			</Typography>
			<AppointmentDetails>
				<Typography variant='secondary' size='sm'>
					Date: {appointment.formattedDate}
				</Typography>
				<Typography variant='secondary' size='sm'>
					Time: {appointment.formattedTime}
				</Typography>
			</AppointmentDetails>
			<Button title='Reschedule' variant='secondary' onPress={onReschedule} />
		</AppointmentContainer>
	)
}

const AppointmentContainer = styled(View)`
	gap: 12px;
	padding: 16px;
	background-color: #f8f9fa;
	border: 1px solid #e9ecef;
	border-radius: 8px;
	margin-bottom: 16px;
`

const AppointmentDetails = styled(View)`
	gap: 4px;
`
