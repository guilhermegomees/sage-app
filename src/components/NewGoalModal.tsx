import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";

interface GoalModalProps {
    isVisible: boolean;
    name: string;
    currentValue: string;
    goalValue: string;
    icon: string;
    isCompleted: boolean;
    setIsGoalModalVisible: (visible: boolean) => void;
    setName: (name: string) => void;
    setCurrentValue: (value: string) => void;
    setGoalValue: (value: string) => void;
    toggleIsCompleted: () => void;
    saveGoal: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
    isVisible,
    name,
    currentValue,
    goalValue,
    icon,
    isCompleted,
    setIsGoalModalVisible,
    setName,
    setCurrentValue,
    setGoalValue,
    toggleIsCompleted,
    saveGoal
}) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsGoalModalVisible(false)}
        backdropOpacity={0.5}
        style={[base.justifyContentEnd, base.m_0]}
    >
        <View style={styles.container}>
            <Text style={styles.textHeader}>Gerenciar Meta</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[base.gap_15]}>
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Nome da Meta"
                        placeholderTextColor={colors.gray_200}
                        value={name}
                        onChangeText={setName}
                        maxLength={50}
                    />
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Valor Atual"
                        placeholderTextColor={colors.gray_200}
                        value={currentValue}
                        onChangeText={setCurrentValue}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Valor da Meta"
                        placeholderTextColor={colors.gray_200}
                        value={goalValue}
                        onChangeText={setGoalValue}
                        keyboardType="numeric"
                    />
                    <View style={styles.row}>
                        <FontAwesome6 name={icon} size={30} color={colors.gray_100} />
                        <TouchableOpacity onPress={toggleIsCompleted}>
                            <Text style={styles.checkboxText}>{isCompleted ? "Meta Completa" : "Marcar como Completa"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_10]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={() => setIsGoalModalVisible(false)}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]} onPress={saveGoal}>
                            <Text style={[base.btnText]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </Modal>
);

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
    textHeader: {
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
    checkboxText: {
        color: colors.white,
        fontSize: 16,
    },
});
