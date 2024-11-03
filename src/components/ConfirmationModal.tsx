import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '~/css/colors';

interface ConfirmationModalProps {
    isVisible: boolean;
    confirmationText: string;
    cancelText: string;
    confirmText: string;
    onClose: () => void;
    onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    confirmationText = 'Tem certeza que deseja continuar?',
    cancelText = 'Cancelar',
    confirmText = 'Confirmar',
    onClose,
    onConfirm,
}) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.5}
            animationIn="slideInUp"
            animationOut="slideOutDown"
        >
            <View style={styles.confirmationBox}>
                <Text style={styles.confirmationText}>{confirmationText}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>{cancelText}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={onConfirm}
                    >
                        <Text style={styles.buttonText}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    confirmationBox: {
        padding: 20,
        backgroundColor: colors.gray_850,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmationText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
        color: colors.gray_100,
        marginBottom: 30,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20
    },
    cancelButton: {
        backgroundColor: colors.gray_500,
        padding: 12,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    confirmButton: {
        backgroundColor: colors.red_500,
        padding: 12,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center"
    },
    buttonText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        color: colors.gray_100,
    },
});

export default ConfirmationModal;