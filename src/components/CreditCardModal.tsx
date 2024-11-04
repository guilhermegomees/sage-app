import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Input from './Input';
import DayPicker from './DayPicker';
import base from '~/css/base';
import colors from '~/css/colors';
import { ICreditCard } from '~/interfaces/interfaces';
import useUser from '~/hooks/useUser';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '~/config/firebase';
import { useCreditCards } from '~/context/CreditCardContext';

interface CreditCardModalProps {
    creditCard: ICreditCard | null;
    isVisible: boolean;
    onClose: () => void;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ creditCard, isVisible, onClose }) => {
    const user = useUser();
    const [name, setName] = useState<string | null>(creditCard?.name || "");
    const [limit, setLimit] = useState<number | null>(creditCard?.limit || 0);
    const [selectedClosingDay, setSelectedClosingDay] = useState<number>(creditCard?.closingDay || 1);
    const [selectedDueDay, setSelectedDueDay] = useState<number>(creditCard?.dueDay || 5);
    const [isClosingDayModalVisible, setIsClosingDayModalVisible] = useState<boolean>(false);
    const [isDueDayModalVisible, setIsDueDayModalVisible] = useState<boolean>(false);
    const { fetchCreditCards } = useCreditCards();
    
    const formatValueInput = (value: any) => {
        if (!value) return '';

        const parsedValue = parseFloat(value.toString().replace(/[^0-9]/g, ''));
        return `R$ ${!isNaN(parsedValue) ? parsedValue.toLocaleString('pt-BR') : ''}`;
    };

    const openClosingDayPicker = () => setIsClosingDayModalVisible(true);
    const closeClosingDayPicker = () => setIsClosingDayModalVisible(false);

    const openDueDayPicker = () => setIsDueDayModalVisible(true);
    const closeDueDayPicker = () => setIsDueDayModalVisible(false);

    const saveCreditCard = async (): Promise<void> => {
        if (!name || !limit || !selectedClosingDay || !selectedDueDay) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        try {
            if (user && creditCard) {
                const data = {
                    uid: user.uid,
                    name: name,
                    bankName: creditCard.bankName,
                    limit: limit,
                    closingDay: selectedClosingDay,
                    dueDay: selectedDueDay
                };

                const creditCardDocRef = doc(db, "creditCard", creditCard.id);
                await setDoc(creditCardDocRef, data);

                handleCloseAndReset();
                fetchCreditCards(user);
            }
        } catch (error) {
            console.error("Erro ao salvar conta: ", error);
        }
    };

    const handleCloseAndReset = (): void => {
        onClose();
        //setIsEditing(false);
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
                        <Text style={[styles.inputText]}>Nome do cartão</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            placeholder="Nome do cartão"
                            placeholderTextColor={colors.gray_50}
                            onChangeText={setName}
                            value={name}
                            maxLength={25}
                        />
                    </View>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Limite</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            keyboardType="numeric"
                            placeholder="Limite do cartão"
                            placeholderTextColor={colors.gray_50}
                            onChangeText={setLimit}
                            value={formatValueInput(limit)}
                            maxLength={14}
                        />
                    </View>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Fecha dia</Text>
                        <DayPicker
                            isVisible={isClosingDayModalVisible}
                            selectedDay={selectedClosingDay}
                            setSelectedDay={setSelectedClosingDay}
                            setIsVisible={openClosingDayPicker}
                            onClose={closeClosingDayPicker}
                        />
                    </View>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Vence dia</Text>
                        <DayPicker
                            isVisible={isDueDayModalVisible}
                            selectedDay={selectedDueDay}
                            setSelectedDay={setSelectedDueDay}
                            setIsVisible={openDueDayPicker}
                            onClose={closeDueDayPicker}
                        />
                    </View>
                    <TouchableOpacity style={[base.button, base.btnSave, base.w_100, base.mt_5]} onPress={saveCreditCard}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    containerCreditCard: {
        backgroundColor: colors.gray_875,
        flex: 0.53,
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
});

export default CreditCardModal;