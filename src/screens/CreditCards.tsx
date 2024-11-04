import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from "react-native";
import { ICreditCard } from "~/interfaces/interfaces";
import { formatValue, getBankLogo } from "~/utils/utils";
import base from "~/css/base";
import colors from "~/css/colors";
import useUser from "~/hooks/useUser";
import { FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import { useCreditCards } from "~/context/CreditCardContext";
import CreditCardModal from "~/components/CreditCardModal";

type CreditCardsScreenNavigationProp = StackNavigationProp<any, 'CreditCards'>;

export default function CreditCards() {
    const navigation = useNavigation<CreditCardsScreenNavigationProp>();

    const { creditCards, fetchCreditCards } = useCreditCards();
    const user = useUser();

    const [isCreditCardModalVisible, setIsCreditCardModalVisible] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            fetchCreditCards(user);
        }
    }, [user]);

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    return (
        <View style={[styles.container]}>
            <View style={[styles.backContainer]}>
                <TouchableOpacity onPress={handleNavigateToBack} style={[styles.iconBack]}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle]}>Cartões</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[base.gap_10]}>
                    {creditCards.length > 0 ?
                        creditCards.map((creditCard: ICreditCard) => {
                            // Calcule o valor da fatura atual
                            const currentInvoice = creditCard.invoices.find(invoice => !invoice.isPaid);
                            const invoiceValue = formatValue(currentInvoice ? currentInvoice.totalAmount : 0);

                            // Verifique a data atual em relação à data de fechamento
                            const today = new Date();
                            const closingDate = new Date(today.getFullYear(), today.getMonth(), creditCard.closingDay);
                            const isClosed = today > closingDate;

                            return (
                                <TouchableOpacity key={creditCard.id} onPress={() => {
                                    navigation.navigate("CreditCardDetails", { creditCardId: creditCard.id });
                                }}>
                                    <View style={[styles.card]}>
                                        <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter]}>
                                            <Image source={getBankLogo(creditCard.bankName)} style={[styles.cardIcon]} />
                                            <FontAwesome6 name="angle-right" size={15} color={colors.gray_200} />
                                        </View>
                                        <View style={[base.gap_5]}>
                                            <View style={[base.flexRow, base.justifyContentSpaceBetween]}>
                                                <Text style={[styles.cardText]}>{creditCard.name}</Text>
                                                <View style={[base.flexRow]}>
                                                    <Text style={[styles.cardValue]}>R$ </Text>
                                                    <Text style={[styles.cardValue]}>{invoiceValue}</Text>
                                                </View>
                                            </View>
                                            <View style={[base.w_100, base.justifyContentEnd, base.alignItemsCenter, base.gap_4, base.flexRow]}>
                                                <MaterialIcons name={'circle'} color={isClosed ? colors.red_500 : colors.blue_300} size={7} />
                                                <Text style={[styles.invoiceStatus, { color: isClosed ? colors.red_500 : colors.blue_300 }]}>
                                                    {isClosed ? "Fechada" : "Aberta"}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }) :
                        <View style={[base.flexColumn, base.alignItemsCenter, base.gap_10, base.my_10]}>
                            <Image source={require('../assets/images/no-credit-card.png')} tintColor={colors.gray_100} style={[styles.noCreditCardIcon]} />
                            <Text style={[styles.emptyCard]}>Você ainda não possui nenhum cartão cadastrado</Text>
                        </View>}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.fabButton} onPress={() => setIsCreditCardModalVisible(true)}>
                <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
            </TouchableOpacity>
            <CreditCardModal
                isVisible={isCreditCardModalVisible}
                onClose={() => { setIsCreditCardModalVisible(false) }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900,
        padding: 30
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginBottom: 25,
        gap: 10
    },
    iconBack: {
        justifyContent: "center",
        width: 30,
        height: 30
    },
    screenTitle: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 22,
    },
    fabButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.blue_600,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    card: {
        gap: 15,
        backgroundColor: colors.gray_800,
        padding: 20,
        borderRadius: 15
    },
    cardIcon: {
        borderRadius: 50,
        width: 40,
        height: 40
    },
    cardText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: colors.gray_50
    },
    cardValue: {
        fontFamily: "Outfit_500Medium",
        fontSize: 15,
        color: colors.gray_50
    },
    emptyCard: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_100,
    },
    noCreditCardIcon: {
        width: 60,
        height: 60
    },
    invoiceStatus: {
        fontFamily: "Outfit_500Medium",
        fontSize: 14
    },
})