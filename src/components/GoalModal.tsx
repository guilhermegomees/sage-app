import React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TextInput, TouchableOpacity, Image, Switch, StyleSheet } from 'react-native';
import base from '~/css/base';
import colors from '~/css/colors';
import { FontAwesome6 } from '@expo/vector-icons';
import Input from './Input';
import { IconPickerModal } from './IconPickerModal';
import { ColorPickerModal } from './ColorPickerModal';
import { Calendar } from './Calendar';

interface AccountModalProps {
    isVisible: boolean;
    isEditing?: boolean;
    name: string | null;
    icon: string;
	color: string;
    goalValue: number | null;
    initialValue: number | null;
    tempEndDate: string;
	endDate: string;
    formattedDate: string;
    setName: (text: string) => void;
	setIcon: (icon: string) => void;
	setColor: (color: string) => void;
    setGoalValue: (value: number) => void;
    setInitialValue: (value: number) => void;
    onClose: () => void;
    onSave: () => void;
	isIconPickerVisible: boolean;
	isColorPickerVisible: boolean;
	setIsIconPickerVisible: (visible: boolean) => void;
	setIsColorPickerVisible: (visible: boolean) => void;
    isCalendarVisible: boolean;
    setIsCalendarVisible: (visible: boolean) => void;
    handleSelectTempDate: (date: string) => void;
    handleSelectDate: () => void;
    handleCancelCalendar: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
    isVisible,
    name,
    icon,
	color,
    goalValue,
    initialValue,
    tempEndDate,
    endDate,
    formattedDate,
    setName,
	setIcon,
    setGoalValue,
    setInitialValue,
	setColor,
    onClose,
    onSave,
	isColorPickerVisible,
	isIconPickerVisible,
	setIsIconPickerVisible,
	setIsColorPickerVisible,
    isCalendarVisible,
    setIsCalendarVisible,
    handleSelectTempDate,
    handleSelectDate,
    handleCancelCalendar
}) => {
	const formatValueInput = (value: any) => {
        if (!value) return '';

        const parsedValue = parseFloat(value.toString().replace(/[^0-9]/g, ''));
        return `R$ ${!isNaN(parsedValue) ? parsedValue.toLocaleString('pt-BR') : ''}`;
    };

	const handleSelectColor = (color: string): void => {
        setColor(color);
        setIsColorPickerVisible(false);
    };

	const handleSelectIcon = (icon: string): void => {
        setIcon(icon);
        setIsIconPickerVisible(false);
    };

    const handleChangeGoalValue = (text: string): void => {
        setGoalValue(parseInt(text.replace(/[^\d]/g, '')));
    };

    const handleChangeInitialValue = (text: string): void => {
        setInitialValue(parseInt(text.replace(/[^\d]/g, '')));
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={[styles.containerCreditCard]}>
                <View style={[base.gap_25, base.w_100]}>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Nome</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            placeholder="Ex: Comprar um carro"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={setName}
                            value={name}
                            maxLength={25}
                        />
                    </View>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Valor da meta</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            keyboardType="numeric"
                            placeholder="R$ 0,00"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={handleChangeGoalValue}
                            value={formatValueInput(goalValue)}
                            maxLength={14}
                        />
                    </View>
					<View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Valor inicial (opcional)</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            keyboardType="numeric"
                            placeholder="R$ 0,00"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={handleChangeInitialValue}
                            value={formatValueInput(initialValue)}
                            maxLength={14}
                        />
                    </View>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Data final da meta</Text>
                            <TouchableOpacity style={[base.input, base.gap_5, base.justifyContentStart, { backgroundColor: colors.gray_825 }]} onPress={() => setIsCalendarVisible(true)}>
                            <FontAwesome6 name="calendar-day" color={colors.gray_100} size={20} />
                        <Text style={[styles.textBtnDate, {color: formattedDate ? colors.gray_100 : colors.gray_400}]}>{formattedDate || 'Selecione a data'}</Text>
                    </TouchableOpacity>
                    </View>
					<TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsColorPickerVisible(true)}>
						<View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                            <FontAwesome6 name="palette" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Cor</Text>
                        </View>
                        <View style={[styles.colorCircle, base.m_0, { backgroundColor: color }]} />
                    </TouchableOpacity>
					<TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconPickerVisible(true)}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                            <FontAwesome6 name="image" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Ícone</Text>
                        </View>
                        <FontAwesome6 name={icon} color={color} size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.button, base.btnSave, base.w_100, base.mt_5]} onPress={onSave}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
			<ColorPickerModal
                isVisible={isColorPickerVisible}
                handleSelectColor={handleSelectColor}
                setIsColorPickerVisible={setIsColorPickerVisible}
            />
			<IconPickerModal
                isVisible={isIconPickerVisible}
                handleSelectIcon={handleSelectIcon}
                setIsIconPickerVisible={setIsIconPickerVisible}
            />
            <Calendar
                isVisible={isCalendarVisible}
                selectedTempDate={tempEndDate || endDate}
                handleSelectTempDate={handleSelectTempDate}
                handleSelectDate={handleSelectDate}
                handleCancelCalendar={handleCancelCalendar}
            />
		</Modal>
    );
};

const styles = StyleSheet.create({
    containerCreditCard: {
        backgroundColor: colors.gray_875,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 25
    },
    inputText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.white,
        lineHeight: 18,
    },
    creditCardIconModal: {
        borderRadius: 50,
        width: 25,
        height: 25
    },
    ellipsisIcon: {
        width: 18
    },
	colorCircle: {
        width: 22,
        height: 22,
        borderRadius: 25,
    },
    textBtnDate: {
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        marginLeft: 10,
    },
});

export default AccountModal;