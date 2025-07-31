import { View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'
import { ValidatedStoreSchedule } from '@/utils/schedule'

type WeeklyScheduleProps = {
	schedule: ValidatedStoreSchedule[]
}

export function WeeklySchedule({ schedule }: WeeklyScheduleProps) {
	return (
		<ScheduleContainer>
			<Typography weight='median' size='lg' style={{ marginBottom: 16 }}>
				Store Hours
			</Typography>
			{schedule.map((day) => (
				<DayRow key={day.day_of_week}>
					<DayName>
						<Typography size='sm'>{day.dayName}</Typography>
					</DayName>
					<DayStatus isOpen={day.is_open}>
						<Typography size='sm' variant={day.is_open ? 'primary' : 'secondary'}>
							{day.is_open ? 'Open' : 'Closed'}
						</Typography>
					</DayStatus>
					<DayHours>
						<Typography size='sm' variant='secondary'>
							{day.is_open && day.start_time && day.end_time ? `${day.start_time} - ${day.end_time}` : 'Closed'}
						</Typography>
					</DayHours>
				</DayRow>
			))}
		</ScheduleContainer>
	)
}

const ScheduleContainer = styled(View)`
	gap: 8px;
`

const DayRow = styled(View)`
	flex-direction: row;
	align-items: center;
	padding: 8px 0;
	border-bottom-width: 1px;
	border-bottom-color: #f0f0f0;
`

const DayName = styled(View)`
	flex: 1;
`

const DayStatus = styled(View)<{ isOpen: boolean }>`
	background-color: ${(props) => (props.isOpen ? '#e8f5e8' : '#ffe8e8')};
	padding: 4px 8px;
	border-radius: 4px;
	margin-right: 12px;
	min-width: 50px;
	align-items: center;
`

const DayHours = styled(View)`
	flex: 1;
	align-items: flex-end;
`
