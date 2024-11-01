import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList } from "react-native";
import { useAccounts } from "~/context/AccountContext";
import { IAccount } from "~/interfaces/interfaces";
import { formatCurrency, formatValue, getBankLogo } from "~/utils/utils";
import base from "~/css/base";
import colors from "~/css/colors";
import useUser from "~/hooks/useUser";
import { FontAwesome6 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { SelectionModal } from "~/components/SelectionModal";
import { banks } from "~/constants/banks";

type AccountsScreenNavigationProp = StackNavigationProp<any, 'Accounts'>;

export default function Accounts(){
    const navigation = useNavigation<AccountsScreenNavigationProp>();

    const { accounts, fetchAccounts } = useAccounts();
    const user = useUser();

    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [accountName, setAccountName] = useState<string>();
    const [selectedAccountIcon, setSelectedAccountIcon] = useState<string>();

    const [isIconModalVisible, setIsIconModalVisible] = useState(false);
    const [searchAccountIcon, setSearchAccountIcon] = useState<string>('');
    
    useEffect(() => {
        if (user) {
            fetchAccounts(user);
        }
    }, [user]);

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    const handleCloseAndReset = (): void => {
        
    };

    const createAccount = (): void => {
        
    };

    const handleChange = (text: string): void => {
        const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100;
        setCurrentBalance(numericValue);
    };

    // Filtra os bancos conforme a busca
    const filteredBanks = Object.keys(banks)
        .sort()
        .filter((key) => key.toLowerCase().includes(searchAccountIcon.toLowerCase()));

    return (
        <View style={[styles.container]}>
            <View style={[styles.containerBack]}>
                <TouchableOpacity onPress={handleNavigateToBack} style={[styles.iconBack]}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={[styles.screenTitle]}>Contas</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[base.gap_10]}>
                    {accounts.map((account: IAccount) => {
                        return (
                            <View key={account.id} style={[styles.account]}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    <Image source={getBankLogo(account.bankName)} style={[styles.accountIcon]} />
                                    <Text style={[styles.accountText]}>{account.name}</Text>
                                </View>
                                <Text style={[styles.accountValue, { color: account.balance < 0 ? colors.red_500 : colors.green_500 }]}>R$ {formatValue(account.balance)}</Text>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.fabButton} onPress={() => console.log('Adicionar nova conta')}>
                <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
            </TouchableOpacity>
            <Modal
                isVisible={true}
                backdropOpacity={0.4}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={styles.modal}>
                    {/* Saldo atual da conta */}
                    <View style={styles.containerValueInitial}>
                        <Text style={styles.currentBalanceLabel}>Saldo atual da conta</Text>
                        <TextInput
                            style={[styles.currentBalance]}
                            placeholder={'R$ 0.00'}
                            placeholderTextColor={colors.gray_100}
                            keyboardType="numeric"
                            onChangeText={handleChange}
                            value={formatCurrency(currentBalance)}
                        />
                    </View>
                    <View style={[base.gap_18, base.mt_20]}>
                        {/* Nome da conta */}
                        <TextInput
                            style={[base.input, { backgroundColor: colors.gray_825 }]}
                            placeholder="Nome da conta"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={setAccountName}
                            value={accountName}
                            maxLength={25}
                        />
                        {/* Ícone da conta */}
                        <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} /*onPress={context === transactionContext.cardExpense ? openCreditCardModal : openAccountModal}*/>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                <View style={[base.alignItemsCenter, { width: 20 }]}>
                                    {selectedAccountIcon
                                        ? <Image source={getBankLogo(selectedAccountIcon)} style={[styles.accountIcon]} />
                                        : <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.ellipsisIcon} />
                                    }
                                </View>
                                <Text style={base.inputText}>Ícone da conta</Text>
                            </View>
                            <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                        </TouchableOpacity>
                    </View>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_30]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleCloseAndReset}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]} onPress={createAccount}>
                            <Text style={[base.btnText]}>Criar conta</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Modal
                    isVisible={isIconModalVisible}
                    onBackdropPress={() => setIsIconModalVisible(false)}
                    backdropOpacity={0.4}
                    style={[base.justifyContentEnd, base.m_0]}
                >
                    <View style={styles.accountsIconModal}>
                        <Text style={styles.modalTitle}>Selecione o ícone do banco</Text>
                        <TextInput
                            style={[base.input, styles.searchInput]}
                            placeholder="Buscar ícone de banco"
                            placeholderTextColor={colors.gray_200}
                            onChangeText={setSearchAccountIcon}
                            value={searchAccountIcon}
                        />
                        <FlatList
                            data={filteredBanks}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.bankItem}
                                    onPress={() => {
                                        setSelectedAccountIcon(item);
                                        setIsIconModalVisible(false);
                                    }}
                                >
                                    <Image source={banks[item]} style={styles.bankIcon} />
                                    <Text style={styles.bankName}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </Modal>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900,
        padding: 30
    },
    containerBack: {
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
    account: {
        backgroundColor: colors.gray_800,
        borderRadius: 10,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,
    },
    accountIcon: {
        borderRadius: 50,
        width: 40,
        height: 40
    },
    accountText: {
        fontFamily: "Outfit_500Medium",
        fontSize: 18,
        color: colors.gray_50
    },
    accountValue: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_50
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
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.6,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    containerValueInitial: {
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
    },
    currentBalanceLabel: {
        color: colors.gray_200,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
    },
    currentBalance: {
        height: 40,
        fontSize: 28,
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_100
    },
    ellipsisIcon: {
        width: 18
    },
    accountsIconModal: { 
        backgroundColor: colors.gray_875,
        borderRadius: 20,
        padding: 20, 
        flex: 0.6
    },
    modalTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18, 
        color: colors.gray_50,
        marginBottom: 15
    },
    searchInput: {
        backgroundColor: colors.gray_825,
        marginBottom: 15
    },
    bankItem: {
        flexDirection: 'row',
        alignItems: 'center', 
        paddingVertical: 10,
    },
    bankIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 50
    },
    bankName: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16, 
        color: colors.gray_50 
    }
})