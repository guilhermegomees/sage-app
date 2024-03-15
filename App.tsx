import { StatusBar } from 'react-native';
import RootStack from './src/navigation';
import colors from '~/css/colors';

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.gray_900} />
      <RootStack />
    </>
  )
}
