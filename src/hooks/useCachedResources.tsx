import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = useState(false)

	useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync()

				// Load fonts
				await Font.loadAsync({
					PolysansBulky: require('../../assets/fonts/polysanstrial-bulky.otf'),
					PolysansMedian: require('../../assets/fonts/polysanstrial-median.otf'),
					PolysansNeutral: require('../../assets/fonts/polysanstrial-neutral.otf'),
					PolysansSlim: require('../../assets/fonts/polysanstrial-slim.otf'),
				})
			} catch (e) {
				alert(e)
			} finally {
				setLoadingComplete(true)
				SplashScreen.hideAsync()
			}
		}

		loadResourcesAndDataAsync()
	}, [])

	return isLoadingComplete
}
