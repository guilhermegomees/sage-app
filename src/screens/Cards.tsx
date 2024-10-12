import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet from '~/components/BottomSheet';
import { ITransaction } from '~/interfaces/interfaces';
import { useNavigation } from '@react-navigation/native';
import { TypeScreem } from '~/enums/enums';
import colors from '~/css/colors';
import base from '~/css/base';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/config';

type CardsScreenNavigationProp = StackNavigationProp<any, 'Cards'>;

export default function Cards() {
    const navigation = useNavigation<CardsScreenNavigationProp>();
    const [transactions, setTransactions] = useState<ITransaction[]>([]);

    const transactionCollectionRef = collection(db, "transaction");

    const convertToDate = (timeObject: { seconds: number; nanoseconds: number }): Date => {
        const { seconds, nanoseconds } = timeObject;
        
        const millisecondsFromSeconds = seconds * 1000;
        const millisecondsFromNanoseconds = nanoseconds / 1_000_000;
        const totalMilliseconds = millisecondsFromSeconds + millisecondsFromNanoseconds;
        
        return new Date(totalMilliseconds);
    };

    const fetchTransactions = async (): Promise<void> => {
        try {
            const q = query(transactionCollectionRef, where("source", "==", 2));
            const querySnapshot = await getDocs(q);
            const data: ITransaction[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                description: doc.data().description,
                date: convertToDate(doc.data().date),
                category: doc.data().category,
                isExpense: doc.data().isExpense,
                value: doc.data().value,
                account: doc.data().account,
                user: doc.data().user
            }));

            setTransactions(data);
        } catch (error) {
            console.error("Erro ao buscar transações: ", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleNavigateToCardDatails = () => {
        navigation.navigate('CardDetails');
    };

    return (
        <View style={[styles.container, base.alignItemsCenter, base.flex_1]}>
            {/* Card */}
            <View style={[styles.card]}>
                <View style={[base.p_13, base.flexColumn, base.flexSpaceBetween, base.flex_1]}>
                    <View style={[styles.containerTop]}>
                        <Text style={[styles.cardName]}>Cartão 1</Text>
                        <Image source={require('./../assets/images/contactless.png')} style={styles.contactless} />
                    </View>
                    <View style={[styles.containerChip]}>
                        <Image source={require('./../assets/images/chipcard.png')} style={styles.chipcard} />
                    </View>
                    <View style={[styles.containerBottom]}>
                        <Text style={[styles.sage]}>Sage</Text>
                    </View>
                </View>
            </View>
            {/* Botões de ação */}
            <View style={[base.flexRow, base.alignItemsCenter, base.justifyContentCenter, base.gap_25, base.my_25]}>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity>
                        <View style={[styles.buttonsActions]}>
                            <Image source={require('./../assets/images/card-recive.png')} style={styles.iconButtonAction} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Transação</Text>
                </View>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity onPress={handleNavigateToCardDatails}>
                        <View style={[styles.buttonsActions]}>
                            <Image source={require('./../assets/images/edit.png')} style={styles.iconButtonActionEdit} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Editar</Text>
                </View>
                <View style={[base.alignItemsCenter, base.justifyContentCenter, base.gap_8]}>
                    <TouchableOpacity>
                        <View style={[styles.buttonsActions]}>
                            <View style={[base.flexColumn, base.alignItemsCenter]}>
                                {/* TODO: Aplicar data de vencimento definida no cartão e implementar
                                função para mostrar um mês em diante depois do dia definido */}
                                <Text style={[styles.dueDate]}>10</Text>
                                <Text style={[styles.dueMonth]}>Abr</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.textBtnsActions]}>Vencimento</Text>
                </View>
            </View>
            {/* Painel de transações */}
            <BottomSheet data={transactions} type={TypeScreem.Card} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25
    },
    card: {
        width: 288,
        height: 178,
        backgroundColor: '#E0E3E7',
        borderRadius: 20
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
    buttonsActions: {
        backgroundColor: colors.gray_800,
        width: 50,
        height: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textBtnsActions: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_400,
        fontSize: 14,
        lineHeight: 22
    },
    iconButtonAction: {
        width: 30,
        height: 30
    },
    iconButtonActionEdit: {
        width: 22,
        height: 22
    },
    dueDate: {
        color: colors.gray_50,
        fontWeight: '500',
        fontSize: 20,
        lineHeight: 24
    },
    dueMonth: {
        color: colors.gray_400,
        fontWeight: '400',
        fontSize: 11,
        lineHeight: 12
    }
})
