import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { RootStackParamList } from '.';

import { base } from "../css/base";
import { colors } from '../css/colors'
import FontAwesome from '@expo/vector-icons/FontAwesome';

import TBar from './tbar';
import Accounts from '../screens/accounts';
import Goals from '../screens/goals';
import Cards from '../screens/cards';

const Tab = createMaterialTopTabNavigator();

type Props = StackScreenProps<RootStackParamList, 'TabNavigator'>;

export default function TabLayout({ navigation }: Props) {
  return (
    <SafeAreaView style={[styles.container, base.flex_1, base.px_30]}>
      <View style={[base.flexRow, base.flexSpaceBetween, base.alignItemsCenter, base.pb_25]}>
        <View style={[base.flexRow, base.alignItemsCenter, base.gap_12]}>
          <FontAwesome name='user-circle' color={colors.white} size={52} />
          <View style={[base.gap_4]}>
            <Text style={styles.text}>[Nome]</Text>
            <Text style={styles.text}>[Email]</Text>
          </View>
        </View>
        <FontAwesome name='user-circle-o' color={colors.white} size={40} />
      </View>
      <Tab.Navigator
        tabBar={(props) => <TBar {...props} />}
      >
        <Tab.Screen name="Accounts" component={Accounts} options={{ tabBarLabel: 'Contas' }} />
        <Tab.Screen name="Goals" component={Goals} options={{ tabBarLabel: 'Metas' }} />
        <Tab.Screen name="Cards" component={Cards} options={{ tabBarLabel: 'Cartões' }} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingTop: 60
  },
  text: {
    color: colors.white_100,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500'
  }
})