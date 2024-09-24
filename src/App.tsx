import { StatusBar } from 'react-native';
import RootStack from '~/navigation/RootStack';
import colors from '~/css/colors';
import {
    useFonts,
    Outfit_600SemiBold,
    Outfit_500Medium,
    Outfit_400Regular
} from '@expo-google-fonts/outfit'

export default function App() {
    const [fontsLoaded] = useFonts({
        Outfit_600SemiBold,
        Outfit_500Medium,
        Outfit_400Regular
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor={colors.gray_900} />
            <RootStack />
        </>
    )
}