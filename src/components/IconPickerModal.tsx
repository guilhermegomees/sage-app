import { FontAwesome6 } from "@expo/vector-icons";
import { ScrollView, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { predefinedIcons } from "~/constants/icons";
import base from "~/css/base";
import colors from "~/css/colors";

interface IconPickerModalProps {
    isVisible: boolean;
    handleSelectIcon: (icon: string) => void;
    setIsIconPickerVisible: (visible: boolean) => void;
}
  
export const IconPickerModal: React.FC<IconPickerModalProps> = ({ isVisible, handleSelectIcon, setIsIconPickerVisible }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsIconPickerVisible(false)}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalIconPicker}>
                <Text style={[styles.iconPickerTitle, styles.line, base.w_100]}>Selecione um ícone</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.iconsContainer}>
                        {predefinedIcons.map((icon) => (
                            <TouchableOpacity
                                key={icon}
                                onPress={() => handleSelectIcon(icon)}
                                style={[styles.icon]}
                            >
                                <View style={[base.alignItemsCenter]}>
                                    <FontAwesome6 name={icon} color={colors.gray_100} size={25} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalIconPicker: {
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: "100%",
        height: "50%",
        alignItems: "center",
    },
    iconPickerTitle: {
        fontFamily: "Outfit_400Regular",
        color: colors.white,
        fontSize: 18,
        marginBottom: 20,
        paddingBottom: 10
    },
    iconsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    icon: {
        width: 40,
        height: 40,
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
});