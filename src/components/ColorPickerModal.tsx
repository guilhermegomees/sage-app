import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { predefinedColors } from "~/constants/colors";
import base from "~/css/base";
import colors from "~/css/colors";

interface ColorPickerModalProps {
    isVisible: boolean;
    handleSelectColor: (color: string) => void;
    setIsColorPickerVisible: (visible: boolean) => void;
}
  
export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, handleSelectColor, setIsColorPickerVisible }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsColorPickerVisible(false)}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalColorPicker}>
                <Text style={[styles.colorPickerTitle, styles.line, base.w_100]}>Selecione uma cor</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.colorsContainer}>
                        {predefinedColors.map((color) => (
                            <View key={color} style={[base.alignItemsCenter]}>
                                <TouchableOpacity
                                    style={[styles.colorCircle, { backgroundColor: color }]}
                                    onPress={() => handleSelectColor(color)}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalColorPicker: {
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: "100%",
        height: "50%",
        alignItems: "center",
    },
    colorPickerTitle: {
        fontFamily: "Outfit_400Regular",
        color: colors.white,
        fontSize: 18,
        marginBottom: 20,
        paddingBottom: 10
    },
    colorsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center"
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 25, 
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
});