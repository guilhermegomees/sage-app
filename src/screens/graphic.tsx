import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, colors, base, Image, MaterialIcons } from './imports';

export default function Graphic() {
  return (
    <View style={[styles.container, base.flex_1]}>
        <TouchableOpacity style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={colors.white_100} />
            <Text style={styles.title}>Gráficos</Text>
        </TouchableOpacity>
        <View style={styles.containerBtn}>
        <TouchableOpacity style={styles.btn}>
        <Image source={require('../image/graphic01.png')} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.titleButton}>Entradas e saídas</Text>
              <Text style={styles.subTitleButton}>Saiba quanto você recebeu e quanto você gastou durante um certo período.</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn}>
        <Image source={require('../image/graphic02.png')} style={styles.image} />
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
  },
  containerBtn:{
    backgroundColor: colors.gray_900,
    justifyContent: 'space-between',
  },
  backButton: {
    width: '55%',
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  btn: {
    flexDirection: 'row', // Modificado para alinhar elementos horizontalmente
    justifyContent: 'space-between', // Espaça os elementos dentro do botão
    alignItems: 'center', // Centraliza os itens verticalmente
    width: '90%',
    backgroundColor: colors.gray_800,
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    marginLeft: 20,
  },
  textContainer: {
    flex: 1, // Faz com que o contêiner do texto ocupe o espaço máximo antes da imagem
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 35, // Adiciona espaço à esquerda da imagem
  },
  titleButton: {
    color: colors.white_100,
    fontSize: 16,
    fontWeight: 'bold'
  },
  subTitleButton: {
    color: colors.subTitle,
    fontSize: 12,
    marginTop: 4,
  },
  title: {
    color: colors.white_100,
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  arrow: {
    color: colors.white_100,
    fontSize: 35,
  },
});
