import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, TextInput, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";

interface NewCategoryModalProps {
    isVisible: boolean;
    nameNewCategory: string | any;
    selectedColor: string;
    selectedIcon: string;
    title?: string;
    setIsNewCategorieVisible: (visible: boolean) => void;
    setNameNewCtg: (desc: string) => void;
    setIsColorPickerVisible: (visible: boolean) => void;
    setIsIconPickerVisible: (visible: boolean) => void;
    createCategory: () => void;
}

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ isVisible, nameNewCategory, selectedColor, selectedIcon, title, setIsNewCategorieVisible, setNameNewCtg, setIsColorPickerVisible, setIsIconPickerVisible, createCategory }) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsNewCategorieVisible(false)}
        backdropOpacity={0.6}
        style={[base.justifyContentEnd, base.m_0]}
    >
        <View style={[styles.contaner]}>
            <Text style={styles.textNewCtg}>{title || 'Criar nova categoria'}</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[base.gap_15]}>
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Nome"
                        placeholderTextColor={colors.gray_200}
                        value={nameNewCategory}
                        onChangeText={setNameNewCtg}
                        maxLength={25}
                    />
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsColorPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome6 name="palette" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Cor</Text>
                        </View>
                        <View style={[styles.colorCircle, base.m_0, { backgroundColor: selectedColor }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome6 name="image" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Ícone</Text>
                        </View>
                        <FontAwesome6 name={selectedIcon} color={selectedColor} size={20}/>
                    </TouchableOpacity>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_10]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={() => setIsNewCategorieVisible(false)}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]} onPress={createCategory}>
                            <Text style={[base.btnText]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    contaner: {
        backgroundColor: colors.gray_875,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        gap: 15
    },
    colorCircle: {
        width: 22,
        height: 22,
        borderRadius: 25,
    },
    textNewCtg: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 18,
		color: colors.white,
        marginBottom: 5
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
});