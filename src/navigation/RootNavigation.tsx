import { NavigationContainer } from '@react-navigation/native'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { HomeScreen } from '@/screens/app'
import { LoginScreen } from '@/screens/auth'
import { useAuthStore } from '@/stores'

const Stack = createStackNavigator<RootNavigationType>()

export default function RootNavigation() {
	const { user, token } = useAuthStore()

	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerShown: false,
					...TransitionPresets.SlideFromRightIOS,
					gestureEnabled: true,
					gestureDirection: 'horizontal',
				}}
			>
				{user && token ? (
					<Stack.Screen name='HomeScreen' component={HomeScreen} />
				) : (
					<Stack.Screen name='LoginScreen' component={LoginScreen} />
				)}
			</Stack.Navigator>
		</NavigationContainer>
	)
}
