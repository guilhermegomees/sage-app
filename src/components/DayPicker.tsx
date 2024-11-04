import { FontAwesome6 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WheelPicker } from 'react-native-infinite-wheel-picker';
import Modal from 'react-native-modal';
import base from '~/css/base';
import colors from '~/css/colors';

interface DayPickerProps {
    isVisible: boolean;
    selectedDay: number;
    setSelectedDay: (day: number) => void;
    setIsVisible: () => void;
    onClose: () => void;
}

const DayPicker: React.FC<DayPickerProps> = ({
    isVisible,
    setIsVisible,
    selectedDay,
    setSelectedDay,
    onClose,
}) => {
    const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const [tempSelectedDay, setTempSelectedDay] = React.useState(selectedDay);

    const handleDayChange = (index: number, value: string) => {
        if (index >= 0 && index < daysInMonth.length) {
            setTempSelectedDay(parseInt(value));
        }
    };

    const handleSave = () => {
        setSelectedDay(tempSelectedDay);
        onClose();
    };

    return (
        <>
            <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={setIsVisible}>
                <Text style={[base.inputText]}>{selectedDay}</Text>
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
                        <Text style={styles.label}>Fecha dia</Text>
                        <WheelPicker
                            initialSelectedIndex={tempSelectedDay - 1}
                            data={daysInMonth}
                            restElements={2}
                            elementHeight={50}
                            onChangeValue={handleDayChange}
                            selectedIndex={tempSelectedDay - 1}
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

export default DayPicker;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_875,
        flex: 0.4,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 25,
        alignItems: 'center',
        gap: 15
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
        color: 'white'
    },
});