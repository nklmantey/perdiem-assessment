import { TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'

import { Typography } from '@/components/global'

type TabToggleProps = {
	options: { label: string; value: 'nyc' | 'local' }[]
	selectedValue: 'nyc' | 'local'
	onValueChange: (value: 'nyc' | 'local') => void
}

export function TabToggle({ options, selectedValue, onValueChange }: TabToggleProps) {
	return (
		<ToggleContainer>
			{options.map((option) => (
				<TabButton
					key={option.value}
					onPress={() => onValueChange(option.value)}
					activeOpacity={0.8}
					isSelected={selectedValue === option.value}
				>
					<Typography weight='median' variant={selectedValue === option.value ? 'button' : 'secondary'} size='sm'>
						{option.label}
					</Typography>
				</TabButton>
			))}
		</ToggleContainer>
	)
}

const ToggleContainer = styled(View)`
	flex-direction: row;
	background-color: #e9e9e9;
	padding: 3px;
	border-radius: 10px;
`

const TabButton = styled(TouchableOpacity)<{ isSelected: boolean }>`
	flex: 1;
	align-items: center;
	padding: 12px;
	border-radius: 8px;
	background-color: ${(props) => (props.isSelected ? '#eb1600' : 'transparent')};
`
