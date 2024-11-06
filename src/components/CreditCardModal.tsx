import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Modal from 'react-native-modal';
import Input from './Input';
import DayPicker from './DayPicker';
import base from '~/css/base';
import colors from '~/css/colors';
import { ICreditCard } from '~/interfaces/interfaces';
import useUser from '~/hooks/useUser';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '~/config/firebase';
import { useCreditCards } from '~/context/CreditCardContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { getBankLogo } from '~/utils/utils';
import BankIconModal from './BankIconModal';
import { banks } from '~/constants/banks';

interface CreditCardModalProps {
    creditCard?: ICreditCard | null;
    isVisible: boolean;
    isEditing?: boolean;
    onClose: () => void;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ creditCard, isVisible, isEditing, onClose }) => {
    const user = useUser();
    const [name, setName] = useState<string | null>(creditCard?.name || "");
    const [creditCardIcon, setCreditCardIcon] = useState<string | null>();
    const [limit, setLimit] = useState<number | null>(creditCard?.limit || 0);
    const [selectedClosingDay, setSelectedClosingDay] = useState<number>(creditCard?.closingDay || 1);
    const [selectedDueDay, setSelectedDueDay] = useState<number>(creditCard?.dueDay || 5);
    const [isClosingDayModalVisible, setIsClosingDayModalVisible] = useState<boolean>(false);
    const [isDueDayModalVisible, setIsDueDayModalVisible] = useState<boolean>(false);
    const { fetchCreditCards } = useCreditCards();
    const creditCardsCollectionRef = collection(db, "creditCard");

    const [isIconModalVisible, setIsIconModalVisible] = useState(false);
    const [searchCreditCardIcon, setSearchCreditCardIcon] = useState<string>('');
    
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
        if (!name || !creditCardIcon || !limit || !selectedClosingDay || !selectedDueDay) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        try {
            if (user) {
                const data = {
                    uid: user.uid,
                    name: name,
                    bankName: creditCardIcon || creditCard?.bankName,
                    limit: limit,
                    closingDay: selectedClosingDay,
                    dueDay: selectedDueDay
                };

                if (isEditing && creditCard) {
                    // Atualizar cartão existente
                    const creditCardDocRef = doc(db, "creditCard", creditCard.id);
                    await setDoc(creditCardDocRef, data);
                } else {
                    // Criar novo cartão
                    await addDoc(creditCardsCollectionRef, data);
                }

                await fetchCreditCards(user);
                handleCloseAndReset();
            }
        } catch (error) {
            console.error("Erro ao salvar conta: ", error);
        }
    };

    const handleCloseAndReset = (): void => {
        onClose();
        setName(null);
        setCreditCardIcon(null);
        setLimit(null);
        setSelectedClosingDay(1);
        setSelectedDueDay(5);
    };

    const handleChangeLimit = (text: string): void => {
        setLimit(parseInt(text.replace(/[^\d]/g, '')));
    };

    // Filtra os bancos conforme a busca
    const filteredBanks = Object.keys(banks)
        .sort()
        .filter((key) => key.toLowerCase().includes(searchCreditCardIcon.toLowerCase()));

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={handleCloseAndReset}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={[styles.containerCreditCard]}>
                <View style={[base.gap_25, base.w_100]}>
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Nome do cartão</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            placeholder="Ex: Nubank"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={setName}
                            value={name}
                            maxLength={25}
                        />
                    </View>
                    {!isEditing && (
                        <View style={[base.gap_10]}>
                            <Text style={[styles.inputText]}>Ícone do cartão</Text>
                            <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconModalVisible(true)}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    <View style={[base.alignItemsCenter, { width: 20 }]}>
                                        {creditCardIcon ? (
                                            <Image source={getBankLogo(creditCardIcon)} style={[styles.creditCardIconModal]} />
                                        ) : (
                                            <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.ellipsisIcon} />
                                        )}
                                    </View>
                                    <Text style={base.inputText}>{creditCardIcon}</Text>
                                </View>
                                <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={[base.gap_10]}>
                        <Text style={[styles.inputText]}>Limite</Text>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            keyboardType="numeric"
                            placeholder="R$ 10.000"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={handleChangeLimit}
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
            <BankIconModal
                isVisible={isIconModalVisible}
                searchItem={searchCreditCardIcon}
                filteredBanks={filteredBanks}
                onSearch={setSearchCreditCardIcon}
                onSelectIcon={(icon: string) => {
                    setCreditCardIcon(icon);
                    setIsIconModalVisible(false);
                }}
                onClose={() => setIsIconModalVisible(false)}
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
});

export default CreditCardModal;