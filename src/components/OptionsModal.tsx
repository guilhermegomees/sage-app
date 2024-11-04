import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import colors from "~/css/colors";
import base from "~/css/base";

interface OptionsModalProps {
    isVisible: boolean;
    contextLabel: string;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const OptionsModal: React.FC<OptionsModalProps> = ({ isVisible, contextLabel, onClose, onEdit, onDelete }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.6}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.container}>
                <Text style={styles.label}>Opções</Text>
                <View style={base.gap_30}>
                    <TouchableOpacity onPress={() => { onEdit(); onClose(); }}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                            <View style={styles.iconContainer}>
                                <FontAwesome6 name='pencil' size={18} color={colors.gray_100} />
                            </View>
                            <Text style={[styles.optionText, { color: colors.gray_100 }]}>Editar {contextLabel}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { onDelete(); onClose(); }}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                            <View style={styles.iconContainer}>
                                <FontAwesome6 name='trash' size={18} color={colors.red_500} />
                            </View>
                            <Text style={[styles.optionText, { color: colors.red_500 }]}>Excluir {contextLabel}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        padding: 30,
        flex: 0.18,
        gap: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    label: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 22,
        color: colors.gray_100,
        width: '100%',
        borderBottomColor: colors.gray_700,
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    iconContainer: {
        width: 20
    },
    optionText: {
        fontSize: 20,
        fontFamily: 'Outfit_500Medium',
        height: 20
    },
});

export default OptionsModal;