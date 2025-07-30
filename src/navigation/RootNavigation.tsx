import { NavigationContainer } from '@react-navigation/native'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { HomeScreen } from '@/screens/app'
import { LoginScreen } from '@/screens/auth'

const Stack = createStackNavigator<RootNavigationType>()

export default function RootNavigation() {
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
				<Stack.Screen name='LoginScreen' component={LoginScreen} />
				<Stack.Screen name='HomeScreen' component={HomeScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	)
}
