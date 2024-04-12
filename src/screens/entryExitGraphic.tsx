import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  colors,
  base,
  Image,
  MaterialIcons,
  StackNavigationProp
} from '~/imports';
import { useNavigation } from '@react-navigation/native';


type EntryExitGraphicScreenNavigationProp = StackNavigationProp<any, 'EntryExitGraphic'>;

export default function EntryExitGraphic() {
  const navigation = useNavigation<EntryExitGraphicScreenNavigationProp>();

  const handleNavigateToBack = () => {
    navigation.navigate('Graphic');
  };

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Entrada e Saída</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingHorizontal: 20
  },
  containerBtn:{
    backgroundColor: colors.gray_900,
    justifyContent: 'space-between',
    gap: 23
  },
  containerBack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 25,
  },
  title: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 20,
    marginLeft: 10,
  },
  arrow: {
    color: colors.white_100,
    fontSize: 35,
  },
});
