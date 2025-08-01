import { performLogout } from '@/utils'
import { Ionicons } from '@expo/vector-icons'
import { Alert, TouchableOpacity } from 'react-native'
import styled from 'styled-components'

export default function Header() {
	function handleLogout() {
		Alert.alert('Log out', 'Are you sure you want to log out?', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{
				text: 'Logout',
				style: 'destructive',
				onPress: performLogout,
			},
		])
	}

	return (
		<IconContainer onPress={handleLogout} activeOpacity={0.9}>
			<Ionicons size={18} color='maroon' name='log-out-outline' />
		</IconContainer>
	)
}

const IconContainer = styled(TouchableOpacity)`
	width: 32px;
	height: 32px;
	border-radius: 20px;
	background-color: #fef3f2;
	border: 1px solid #fcc7c8;
	align-items: center;
	justify-content: center;
`
