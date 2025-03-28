import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet from '~/components/BottomSheet';
import { RouteProp, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import { TypeScreem } from '~/enums/enums';
import colors from '~/css/colors';
import base from '~/css/base';
import { useTransactions } from '~/context/TransactionContext';
import { FontAwesome6 } from '@expo/vector-icons';
import { ITransaction } from '~/interfaces/interfaces';
import OptionsModal from '~/components/OptionsModal';
import ConfirmationModal from '~/components/ConfirmationModal';
import useUser from '~/hooks/useUser';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/config/firebase';
import { useCreditCards } from '~/context/CreditCardContext';
import CreditCardModal from '~/components/CreditCardModal';
import { formatValue, getBankLogo } from '~/utils/utils';
import PeriodSelector from '~/components/PeriodSelector';
import { monthsList } from '~/constants/monthsList';

type CreditCardScreenNavigationProp = StackNavigationProp<any, 'CreditCard'>;
type CreditCardScreenRouteProp = RouteProp<StackParamList, 'CreditCard'>;

type StackParamList = {
    CreditCard: { creditCardId: string };
};

export default function CreditCardDetails() {
    const navigation = useNavigation<CreditCardScreenNavigationProp>();
    const { cardTransactions, fetchTransactions, fetchCardTransactions } = useTransactions();
    const { creditCardDetails, fetchCreditCards } = useCreditCards();
    const route = useRoute<CreditCardScreenRouteProp>();
    const { creditCardId } = route.params || {};
    const user = useUser();

    const currentDate = new Date();
	const currentMonth = monthsList[currentDate.getMonth()];
	const currentYear = currentDate.getFullYear();
    const [month, setMonth] = useState(currentMonth);
	const [year, setYear] = useState(currentYear);
    const [data, setData] = useState<ITransaction[]>(cardTransactions);

    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);
    const [isCreditCardModalVisible, setIsCreditCardModalVisible] = useState<boolean>(false);
    const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);

    const transactionCollectionRef = collection(db, "transaction");   

    const [invoiceValue, setInvoiceValue] = useState<number>(0);

    useEffect(() => {
        if(user && creditCardId){
            fetchCreditCards(user, creditCardId);
            fetchCardTransactions(user, creditCardId);
        }
    }, [user, creditCardId]);

    useEffect(() => {
		const filteredTransactions = cardTransactions.filter(transaction => {
			const transactionDate = new Date(transaction.date);
			const transactionMonth = transactionDate.getMonth();
			const transactionYear = transactionDate.getFullYear();
		
			const isCorrectMonth = transactionMonth === monthsList.indexOf(month);
			const isCorrectYear = transactionYear === year;
		
			return isCorrectMonth && isCorrectYear && transaction.source === 2;
		});

		setData(filteredTransactions);
	}, [month, cardTransactions]);

    const updateInvoiceForPeriod = (month: string, year: number) => {
        if (creditCardDetails) {
            const selectedMonthKey = `${year}-${String(monthsList.indexOf(month) + 1).padStart(2, '0')}`;
            const selectedInvoice = creditCardDetails.invoices.find(invoice => invoice.month === selectedMonthKey);
            const invoiceValue = selectedInvoice ? selectedInvoice.totalAmount : 0;

            setInvoiceValue(Math.round(invoiceValue * 100) / 100);
        }
    };


    useEffect(() => {
        updateInvoiceForPeriod(month, year);
    }, [creditCardDetails]);

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    const handleEditCreditCard = () => {
        setIsCreditCardModalVisible(true);
        setIsOptionsModalVisible(false);
    };

    const confirmDeleteCreditCard = () => {
        setIsDeleteConfirmModalVisible(true);
        setIsOptionsModalVisible(false);
    };

    const deleteCreditCard = async () => {
        if (user && creditCardDetails) {
            try {
                const transactionsQuery = query(
                    transactionCollectionRef,
                    where("creditCard", "==", creditCardDetails.id)
                );

                const transactionsSnapshot = await getDocs(transactionsQuery);
                const deleteTransactionPromises = transactionsSnapshot.docs.map(transactionDoc =>
                    deleteDoc(transactionDoc.ref)
                );

                // Aguardar a exclusão de todas as transações
                await Promise.all(deleteTransactionPromises);

                await fetchTransactions(user);

                const creditCardDocRef = doc(db, "creditCard", creditCardDetails.id);
                await deleteDoc(creditCardDocRef);

                await fetchCreditCards(user);
                setIsDeleteConfirmModalVisible(false);
                navigation.dispatch(
                    StackActions.replace('Main')
                );
            } catch (error) {
                console.error("Erro ao deletar conta e transações: ", error);
            }
        }
    };

    const getInvoiceStatus = () => {
        let isClosed = false;

        if (creditCardDetails){
            const today = new Date();
            const closingDate = new Date(today.getFullYear(), today.getMonth(), creditCardDetails.closingDay);
            isClosed = today > closingDate;
        }

        return `Fatura ${isClosed ? 'fechada' : 'aberta'}`;
    }

    function handlePrevPeriod() {
        setMonth(prevMonth => {
            const currentIndex = monthsList.indexOf(prevMonth);
            const newIndex = (currentIndex - 1 + monthsList.length) % monthsList.length;
            const newMonth = monthsList[newIndex];

            // Decrementa o ano se o novo mês for dezembro
            if (newIndex === monthsList.length - 1) {
                setYear(prevYear => prevYear - 1);
            }

            // Atualiza a fatura e o valor para o novo período
            updateInvoiceForPeriod(newMonth, newIndex === monthsList.length - 1 ? year - 1 : year);

            return newMonth;
        });
    }

    function handleNextPeriod() {
        setMonth(prevMonth => {
            const currentIndex = monthsList.indexOf(prevMonth);
            const newIndex = (currentIndex + 1) % monthsList.length;
            const newMonth = monthsList[newIndex];

            // Incrementa o ano se o novo mês for janeiro
            if (newIndex === 0) {
                setYear(prevYear => prevYear + 1);
            }

            // Atualiza a fatura e o valor para o novo período
            updateInvoiceForPeriod(newMonth, newIndex === 0 ? year + 1 : year);

            return newMonth;
        });
    }

    return (
        <View style={[styles.container, base.alignItemsCenter, base.flex_1]}>
            <View style={[styles.backContainer, base.justifyContentSpaceBetween]}>
                <TouchableOpacity onPress={handleNavigateToBack} style={styles.iconBack}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <TouchableOpacity style={[base.alignItemsCenter, { width: 20 }]} onPress={() => { setIsOptionsModalVisible(true) }}>
                    <FontAwesome6 name="ellipsis-vertical" color={colors.gray_100} size={20} />
                </TouchableOpacity>
            </View>
            {/* Card */}
            {creditCardDetails && (
                <View style={[styles.card]}>
                    <View style={[base.p_13, base.flexColumn, base.flexSpaceBetween, base.flex_1]}>
                        <View style={[styles.containerTop]}>
                            <Text style={[styles.cardName]}>{creditCardDetails.name}</Text>
                            <Image source={require('./../assets/images/contactless.png')} style={styles.contactless} />
                        </View>
                        <View style={[styles.containerChip]}>
                            <Image source={require('./../assets/images/chipcard.png')} style={styles.chipcard} />
                        </View>
                        <View style={[styles.containerBottom]}>
                            <Image source={getBankLogo(creditCardDetails.bankName)} style={styles.bankLogo} />
                        </View>
                    </View>
                </View>
            )}
            <View style={[base.w_100, base.px_30, base.pb_30, base.gap_20]}>
                <View style={[base.flexRow]}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_10, {width: 190}]}>
                        <View style={[base.alignItemsCenter, { width: 16 }]}>
                            <FontAwesome6 name="calendar-week" color={colors.gray_100} size={18} />
                        </View>
                        <View style={[base.gap_5]}>
                            <Text style={[styles.title]}>Dia do fechamento</Text>
                            <Text style={[styles.label]}>{creditCardDetails?.closingDay}</Text>
                        </View>
                    </View>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_10, { width: 190 }]}>
                        <View style={[base.alignItemsCenter, { width: 16 }]}>
                            <FontAwesome6 name="calendar-check" color={colors.gray_100} size={18} />
                        </View>
                        <View style={[base.gap_5]}>
                            <Text style={[styles.title]}>Dia do vencimento</Text>
                            <Text style={[styles.label]}>{creditCardDetails?.dueDay}</Text>
                        </View>
                    </View>
                </View>
                <View style={[base.flexRow]}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_10, { width: 190 }]}>
                        <View style={[base.alignItemsCenter, { width: 16 }]}>
                            <FontAwesome6 name="clipboard-check" color={colors.gray_100} size={18} />
                        </View>
                        <View style={[base.gap_5]}>
                            <Text style={[styles.title]}>Status da fatura</Text>
                            <Text style={[styles.label]}>{getInvoiceStatus()}</Text>
                        </View>
                    </View>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_10, { width: 190 }]}>
                        <View style={[base.alignItemsCenter, {width: 16}]}>
                            <FontAwesome6 name="dollar-sign" color={colors.gray_100} size={18} />
                        </View>
                        <View style={[base.gap_5]}>
                            <Text style={[styles.title]}>Total da fatura</Text>
                            <Text style={[styles.label, { color: colors.red_500 }]}>R$ {invoiceValue.toFixed(2).replace('.', ',')}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[base.mb_10]}>
                <PeriodSelector
                    currentPeriod={month}
                    currentYear={year}
                    onPrevPeriod={handlePrevPeriod}
                    onNextPeriod={handleNextPeriod}
                />
            </View>
            <BottomSheet data={data} type={TypeScreem.Card} />
            <OptionsModal
                isVisible={isOptionsModalVisible}
                onClose={() => setIsOptionsModalVisible(false)}
                options={[
                    { label: 'Editar cartão', icon: 'pencil', color: colors.gray_100, onPress: handleEditCreditCard },
                    { label: 'Excluir cartão', icon: 'trash', color: colors.red_500, onPress: confirmDeleteCreditCard }
                ]}
            />
            <CreditCardModal
                isVisible={isCreditCardModalVisible}
                isEditing={true}
                onClose={() => { setIsCreditCardModalVisible(false) }}
                creditCard={creditCardDetails}
            />
            <ConfirmationModal
                isVisible={isDeleteConfirmModalVisible}
                onClose={() => setIsDeleteConfirmModalVisible(false)}
                onConfirm={deleteCreditCard}
                confirmationText="Tem certeza que deseja excluir este cartão?"
                cancelText="Cancelar"
                confirmText="Confirmar"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        gap: 10,
        padding: 30,
        paddingBottom: 15
    },
    iconBack: {
        justifyContent: "center",
        width: 30,
        height: 30,
    },
    screenTitle: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 22,
        height: 22
    },
    card: {
        width: 288,
        height: 178,
        backgroundColor: '#E0E3E7',
        borderRadius: 10,
        marginBottom: 30
    },
    contactless: {
        width: 28,
        height: 28,
        marginRight: 1
    },
    cardName: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 20,
        color: colors.gray_900,
        marginTop: 5
    },
    sage: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 20,
        color: colors.gray_900,
        lineHeight: 20,
        marginBottom: 5
    },
    chipcard: {
        width: 40,
        height: 29
    },
    containerChip: {
        marginLeft: 10,
    },
    containerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.gray_150
    },
    label: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 15,
        color: colors.gray_100
    },
    bankLogo: {
        width: 35,
        height: 35,
        borderRadius: 5
    }
})
