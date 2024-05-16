import {
  React,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Bar,
  MaterialIcons,
  colors,
  base
} from '../imports';

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
              <View style={[base.flexRow, base.gap_13, base.alignItemsCenter]}>
                <View>{goal.icon}</View>
                <Text style={styles.text}>{goal.name}</Text>
              </View>
              <Bar
                progress={goal.currentValue / goal.goalValue}
                width={Dimensions.get('window').width * 0.4 - 60} // Largura da barra de progresso
                height={8}
                unfilledColor={colors.gray_400}
                borderWidth={0}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.textValue}>
                R$ {goal.currentValue.toLocaleString('pt-BR')} / R$ {goal.goalValue.toLocaleString('pt-BR')}
              </Text>
              <Text
                style={[
                  styles.textValue2,
                  goal.goalValue - goal.currentValue === 0 ? styles.greenText : styles.blueText
                ]}>
                R${(goal.goalValue - goal.currentValue).toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.containerBtns}>
              <TouchableOpacity style={styles.Btn}>
                <Text style={styles.textBtn}>
                  {goal.goalValue - goal.currentValue === 0 ? 'Reativar a meta' : 'Editar'}
                </Text>
              </TouchableOpacity>
              <View style={{ width: 20 }} />
              <TouchableOpacity style={styles.btnDelete}>
                <Text style={styles.textBtn}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.btnNew}>
        <Text style={[styles.textBtn, { fontSize: 16 }]}>Adicionar uma nova meta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_900,
    paddingTop: 20,
    paddingHorizontal: 30
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    gap: 20,
  },
  goalContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width * 0.85, // 90% da largura da tela
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: colors.gray_800,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 90
  },
  containerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: 20,
    gap: 15
  },
  text: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 16,
  },
  textBtn: {
    fontFamily: 'Outfit_500Medium',
    color: colors.white_100,
    fontSize: 14,
  },
  textValue: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 20,
  },
  textValue2: {
    fontFamily: 'Outfit_600SemiBold',
    color: colors.white_100,
    fontSize: 12,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  greenText: {
    color: colors.green_500,
  },
  Btn: {
    width: '45%',
    backgroundColor: colors.blue_100,
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnDelete: {
    width: '45%',
    backgroundColor: colors.yellow_100,
    borderRadius: 10,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btnNew: {
    width: '100%',
    backgroundColor: colors.blue_100,
    borderRadius: 15,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  blueText: {
    color: colors.blue_200,
  }
});
