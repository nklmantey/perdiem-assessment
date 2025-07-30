import { Header, SafeareaContainer, Typography } from '@/components/global'
import { useAuthStore } from '@/stores'
import { ScrollView, StyleSheet, View } from 'react-native'
import styled from 'styled-components'

export default function HomeScreen() {
	const { user } = useAuthStore()

	return (
		<SafeareaContainer>
			<ScrollView contentContainerStyle={styles.container}>
				<HeaderContainer>
					<TextContainer>
						<Typography weight='median' size='lg'>
							Welcome back,
						</Typography>
						<Typography variant='secondary'>{user?.email as string}</Typography>
					</TextContainer>
					<Header />
				</HeaderContainer>
			</ScrollView>
		</SafeareaContainer>
	)
}

const HeaderContainer = styled(View)`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const TextContainer = styled(View)`
	gap: 4px;
`

// SEPARATED BECAUSE OF contentContainerStyle
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
