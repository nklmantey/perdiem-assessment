import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import styled from 'styled-components'

export default function LoginScreen() {
	return (
		<SafeAreaView>
			<Text>LoginScreen</Text>
		</SafeAreaView>
	)
}

const Container = styled(SafeAreaView)``
