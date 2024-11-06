import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import Modal from 'react-native-modal';
import base from '~/css/base';
import colors from '~/css/colors';

interface InstallmentPickerProps {
    isVisible: boolean;
    selectedInstallment: number;
    setSelectedInstallment: (installment: number) => void;
    setIsVisible: () => void;
    onClose: () => void;
}

const InstallmentPicker: React.FC<InstallmentPickerProps> = ({
    isVisible,
    setIsVisible,
    selectedInstallment,
    setSelectedInstallment,
    onClose,
}) => {
    const installments = Array.from({ length: 12 }, (_, i) => i + 1);
    const [tempSelectedInstallment, setTempSelectedInstallment] = React.useState(selectedInstallment);

    const handleInstallmentChange = (index: number, value: string) => {
        if (index >= 0 && index < installments.length) {
            setTempSelectedInstallment(parseInt(value));
        }
    };

    const handleSave = () => {
        setSelectedInstallment(tempSelectedInstallment);
        onClose();
    };

    return (
        <>
            <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={setIsVisible}>
                <Text style={[base.inputText]}>{selectedInstallment}x</Text>
                <FontAwesome6 name="angle-right" size={14} color={colors.gray_50} />
            </TouchableOpacity>
            <Modal
                isVisible={isVisible}
                onBackdropPress={onClose}
                backdropOpacity={0.5}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={styles.container}>
                    <View style={[base.w_100, base.gap_10]}>
                        <Text style={styles.label}>Parcelar em</Text>
                        <WheelPicker
                            initialSelectedIndex={tempSelectedInstallment - 1}
                            data={installments}
                            restElements={2}
                            elementHeight={50}
                            onChangeValue={handleInstallmentChange}
                            selectedIndex={tempSelectedInstallment - 1}
                            selectedLayoutStyle={styles.selectedLayoutStyle}
                            elementTextStyle={styles.elementTextStyle}
                            containerStyle={[base.alignItemsCenter]}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSave} style={[base.button, base.btnSave, base.w_100]}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </>
    );
};

export default InstallmentPicker;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_875,
        flex: 0.4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 25,
        alignItems: 'center',
        gap: 15,
    },
    label: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
        marginBottom: 8,
        color: colors.gray_100,
    },
    selectedLayoutStyle: {
        backgroundColor: colors.gray_700,
        borderRadius: 10,
        width: 60,
    },
    elementTextStyle: {
        fontSize: 18,
        color: 'white',
    },
});