import React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../css/colors';
import { base } from '../css/base';
import { Bar } from 'react-native-progress';
import { MaterialIcons } from '@expo/vector-icons'; // Importe o MaterialIcons

export default function Goals() {
  const goalsData = [
    {
      id: 1,
      name: 'Meta 1',
      currentValue: 1200,
      goalValue: 1200,
      icon: <MaterialIcons name="check-circle" size={35} color={colors.blue_100} />,
    },
    {
      id: 2,
      name: 'Meta 2',
      currentValue: 14506.32,
      goalValue: 76200,
      icon: <MaterialIcons name="check-circle" size={35} color={colors.blue_100} />,
    },
    {
      id: 3,
      name: 'Meta 2',
      currentValue: 1222,
      goalValue: 1520,
      icon: <MaterialIcons name="check-circle" size={35} color={colors.blue_100} />,
    },
    // Adicione mais metas conforme necessário
  ];

  return (
    <View style={[styles.container, base.flex_1]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {goalsData.map((goal) => (
          <View key={goal.id} style={styles.goalContainer}>
            <View style={styles.infoContainer}>
              <View style={styles.iconContainer}>{goal.icon}</View>
              <Text style={styles.text}>{goal.name}</Text>
              <View style={styles.progressBarContainer}>
                <Bar
                  progress={goal.currentValue / goal.goalValue}
                  width={Dimensions.get('window').width * 0.6 - 60} // Largura da barra de progresso
                  height={10}
                  unfilledColor={colors.gray_400}
                  borderWidth={0}
                />
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textValue}>
                R${goal.currentValue.toLocaleString('pt-BR')} / R$
                {goal.goalValue.toLocaleString('pt-BR')}
              </Text>
              <Text
                style={[
                  styles.textValue2,
                  goal.goalValue - goal.currentValue === 0 && styles.greenText,
                ]}>
                R${(goal.goalValue - goal.currentValue).toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <TouchableOpacity style={styles.Btn}>
                <Text style={styles.text}>
                  {goal.goalValue - goal.currentValue === 0 ? 'Reativar a meta' : 'Editar'}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity style={styles.btnDelete}>
                <Text style={styles.text}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <TouchableOpacity style={styles.btnNew}>
          <Text style={styles.text}>Adicionar uma nova meta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    alignItems: 'center', // Alinhe os itens centralmente no ScrollView
  },
  goalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.85, // 90% da largura da tela
    marginVertical: 10, // Margem vertical entre os contêineres de meta
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.gray_800,
  },
  infoContainer: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 10,
  },
  textContainer: {
    marginTop: 10,
  },
  text: {
    color: colors.white_100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textValue: {
    color: colors.white_100,
    fontSize: 20,
    fontWeight: 'bold',
  },
  textValue2: {
    color: colors.white_100,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  greenText: {
    color: colors.green_500,
  },
  progressBarContainer: {
    marginLeft: 10,
  },
  Btn: {
    width: '45%',
    backgroundColor: colors.blue_100,
    borderRadius: 5,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  btnDelete: {
    width: '45%',
    backgroundColor: colors.yellow_100,
    borderRadius: 5,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  btnNew: {
    width: '95%',
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});
