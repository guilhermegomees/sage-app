import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import colors from "~/css/colors";
import base from "~/css/base";

interface Option {
    label: string;
    icon: keyof typeof FontAwesome6.glyphMap;
    color: string;
    disabled?: boolean;
    onPress: () => void;
}

interface OptionsModalProps {
    isVisible: boolean;
    onClose: () => void;
    options: Option[];
}

const OptionsModal: React.FC<OptionsModalProps> = ({ isVisible, onClose, options }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.container}>
                <Text style={styles.label}>Opções</Text>
                <View style={base.gap_30}>
                    {options.map((option, index) => (
                        <TouchableOpacity key={index} onPress={() => { option.onPress(); onClose(); }} disabled={option.disabled}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_20, option.disabled && styles.disabled]}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome6 name={option.icon} size={18} color={option.color} />
                                </View>
                                <Text style={[styles.optionText, { color: option.color }]}>{option.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        padding: 30,
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
        width: 22
    },
    optionText: {
        fontSize: 20,
        fontFamily: 'Outfit_500Medium',
        height: 20
    },
    disabled: {
        opacity: 0.3
    }
});

export default OptionsModal;