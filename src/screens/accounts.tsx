import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';

export default function Accounts() {
  return (
    <View style={[styles.container, base.alignItemsCenter, base.flex_1, base.justifyContentCenter]}>
      <Text style={styles.text}>Contas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900
  },
  text: {
    color: colors.white_100
  }
})