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
  useNavigation,
  StackNavigationProp
} from '~/imports';

type GraphicScreenNavigationProp = StackNavigationProp<any, 'Graphic'>;

export default function Graphic() {
  const navigation = useNavigation<GraphicScreenNavigationProp>();

  const handleNavigateToBack = () => {
    navigation.navigate('Home');
  };
  const handleNavigateToEntryExit = () => {
    navigation.navigate('EntryExitGraphic');
  };
  const handleNavigateToCategoryGraphic = () => {
    navigation.navigate('CategoryGraphic');
  };

  return (
    <View style={[styles.container, base.flex_1]}>
      <View style={[styles.containerBack]}>
        <TouchableOpacity onPress={handleNavigateToBack}>
          <MaterialIcons name="chevron-left" size={30} color={colors.white_100} />
        </TouchableOpacity>
        <Text style={[styles.title]}>Gráficos</Text>
      </View>
      <View style={styles.containerBtn}>
        <TouchableOpacity style={styles.btn} onPress={handleNavigateToEntryExit}>
          <View style={[styles.imageContainer]}>
            <Image source={require('../assets/images/graphic01.png')} style={styles.barGraph} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleButton}>Entradas e saídas</Text>
            <Text style={styles.subTitleButton}>Saiba quanto você recebeu e quanto você gastou durante um certo período.</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleNavigateToCategoryGraphic}>
          <View style={[styles.imageContainer]}>
            <Image source={require('../assets/images/graphic02.png')} style={styles.circleGraph} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.titleButton}>Transações por categoria</Text>
            <Text style={styles.subTitleButton}>Confira o total gasto em cada categoria e identifique onde está concentrando mais despesas.</Text>
          </View>
        </TouchableOpacity>
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
  btn: {
    flexDirection: 'row', // Modificado para alinhar elementos horizontalmente
    justifyContent: 'space-between', // Espaça os elementos dentro do botão
    alignItems: 'center', // Centraliza os itens verticalmente
    backgroundColor: colors.gray_800,
    borderRadius: 10,
    paddingVertical: 10,
    paddingLeft: 18,
    paddingRight: 15,
    gap: 23
  },
  imageContainer: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1, // Faz com que o contêiner do texto ocupe o espaço máximo antes da imagem
    gap: 8,
    marginVertical: 5
  },
  barGraph: {
    width: 47,
    height: 37,
  },
  circleGraph: {
    width: 50,
    height: 58,
  },
  titleButton: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 16,
  },
  subTitleButton: {
    fontFamily: 'Outfit_400Regular',
    color: colors.subTitle,
    fontSize: 12,
    marginTop: 4,
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
