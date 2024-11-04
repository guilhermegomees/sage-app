import React, { useState, useEffect } from 'react';
import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { db } from '~/config/firebase';
import { addDoc, updateDoc, doc, deleteDoc, collection } from 'firebase/firestore';
import base from "~/css/base";
import colors from "~/css/colors";

interface GoalModalProps {
  isVisible: boolean;
  goal?: any; // pode ser `undefined` para nova meta
  setIsNewGoalVisible: (visible: boolean) => void;
  onSave: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isVisible,
  goal,
  setIsNewGoalVisible,
  onSave,
}) => {
  const [name, setName] = useState(goal?.name || '');
  const [currentValue, setCurrentValue] = useState(goal?.currentValue?.toString() || '0');
  const [goalValue, setGoalValue] = useState(goal?.goalValue?.toString() || '0');
  const [icon, setIcon] = useState(goal?.icon || 'star');

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setCurrentValue(goal.currentValue?.toString() || '0');
      setGoalValue(goal.goalValue?.toString() || '0');
      setIcon(goal.icon || 'star'); // Garantir que o ícone seja inicializado corretamente
    }
  }, [goal]);

  const handleSave = async () => {
    if (!name) {
      console.error('Nome da meta não pode ser vazio.');
      return;
    }
  
    const newGoal = {
      name: name || 'Meta sem nome',
      currentValue: parseFloat(currentValue) || 0,
      goalValue: parseFloat(goalValue) || 0,
      icon: icon || 'default-icon',
      isCompleted: false // ou conforme sua lógica
    };
  
    try {
      if (goal) {
        const goalDocRef = doc(db, 'goal', goal.id);
        await updateDoc(goalDocRef, newGoal);
      } else {
        await addDoc(collection(db, 'goal'), { ...newGoal, createdAt: new Date() });
      }
      onSave();
      setIsNewGoalVisible(false);
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleDelete = async () => {
    if (goal) {
      try {
        const goalDocRef = doc(db, 'goal', goal.id);
        await deleteDoc(goalDocRef);
        onSave(); // Atualiza a lista após a exclusão
        setIsNewGoalVisible(false); // Fecha o modal
      } catch (error) {
        console.error('Erro ao excluir meta:', error);
      }
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => setIsNewGoalVisible(false)}
      backdropOpacity={0.6}
      style={[base.justifyContentEnd, base.m_0]}
    >
      <View style={styles.container}>
        <Text style={styles.textNewGoal}>{goal ? 'Editar Meta' : 'Nova Meta'}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[base.gap_15]}>
            <TextInput
              style={[base.input, { backgroundColor: colors.gray_825 }]}
              placeholder="Nome"
              placeholderTextColor={colors.gray_200}
              value={name}
              onChangeText={setName}
              maxLength={25}
            />
            <TextInput
              style={[base.input, { backgroundColor: colors.gray_825 }]}
              placeholder="Valor Atual"
              placeholderTextColor={colors.gray_200}
              keyboardType="numeric"
              value={currentValue}
              onChangeText={setCurrentValue}
            />
            <TextInput
              style={[base.input, { backgroundColor: colors.gray_825 }]}
              placeholder="Valor da Meta"
              placeholderTextColor={colors.gray_200}
              keyboardType="numeric"
              value={goalValue}
              onChangeText={setGoalValue}
            />
            <TouchableOpacity
              style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]}
              onPress={() => {} /* lógica para escolher ícone */}
            >
              <View style={styles.row}>
                <FontAwesome6 name="image" color={colors.gray_100} size={20} />
                <Text style={base.inputText}>Ícone</Text>
              </View>
              <FontAwesome6 name={icon} color={colors.gray_100} size={20} />
            </TouchableOpacity>
            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_10]}>
              {goal && (
                <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleDelete}>
                  <Text style={[base.btnText]}>Excluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={[base.button, base.btnSave]} onPress={handleSave}>
                <Text style={[base.btnText]}>{goal ? 'Salvar Alterações' : 'Adicionar Meta'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray_875,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    gap: 15,
  },
  textNewGoal: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 18,
    color: colors.white,
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
});