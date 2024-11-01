import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput, FlatList, Switch } from "react-native";
import { useAccounts } from "~/context/AccountContext";
import { IAccount } from "~/interfaces/interfaces";
import { formatCurrency, formatValue, getBankLogo } from "~/utils/utils";
import base from "~/css/base";
import colors from "~/css/colors";
import useUser from "~/hooks/useUser";
import { FontAwesome6 } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { banks } from "~/constants/banks";
import SearchBar from "~/components/SearchBar";
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "~/config/firebase";
import { useTransactions } from "~/context/TransactionContext";

type AccountsScreenNavigationProp = StackNavigationProp<any, 'Accounts'>;

export default function Accounts(){
    const navigation = useNavigation<AccountsScreenNavigationProp>();

    const { accounts, fetchAccounts } = useAccounts();
    const { fetchTransactions } = useTransactions();
    const user = useUser();

    const [isAccountModalVisible, setIsAccountModalVisible] = useState<boolean>(false);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
    const [accountName, setAccountName] = useState<string>();
    const [accountIcon, setAccountIcon] = useState<string>();
    const [includeInSum, setIncludeInSum] = useState<boolean>(true);

    const [isIconModalVisible, setIsIconModalVisible] = useState(false);
    const [searchAccountIcon, setSearchAccountIcon] = useState<string>('');

    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);

    const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);

    const accountCollectionRef = collection(db, "account");
    const transactionCollectionRef = collection(db, "transaction");
    
    useEffect(() => {
        if (user) {
            fetchAccounts(user);
        }
    }, [user]);

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    const handleCloseAndReset = (): void => {
        setIsAccountModalVisible(false);
        setCurrentBalance(0);
        setAccountName('');
        setAccountIcon('');
        setIncludeInSum(true);
        setIsEditing(false);
        setSelectedAccount(null);
    };

    const handleEditAccount = () => {
        if (selectedAccount) {
            setAccountName(selectedAccount.name);
            setAccountIcon(selectedAccount.bankName);
            setCurrentBalance(selectedAccount.balance);
            setIncludeInSum(selectedAccount.includeInSum);
            setIsAccountModalVisible(true);
            setIsEditing(true);
            setIsOptionsModalVisible(false);
        }
    };

    const saveAccount = async (): Promise<void> => {
        if (!accountName || !accountIcon || currentBalance === undefined) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }
    
        try {
            if (user) {
                const account = {
                    uid: user.uid,
                    name: accountName,
                    bankName: accountIcon,
                    includeInSum: includeInSum,
                    balance: currentBalance,
                };
    
                if (isEditing && selectedAccount) {
                    // Atualizar conta existente
                    const accountDocRef = doc(db, "account", selectedAccount.id);
                    await setDoc(accountDocRef, account);
                } else {
                    // Criar nova conta
                    await addDoc(accountCollectionRef, account);
                }
    
                await fetchAccounts(user);
                handleCloseAndReset();
            }
        } catch (error) {
            console.error("Erro ao salvar conta: ", error);
        }
    };

    const confirmDeleteAccount = () => {
        setIsDeleteConfirmModalVisible(true);
        setIsOptionsModalVisible(false);
    };

    const deleteAccount = async () => {
        if (user && selectedAccount) {
            try {
                // Verifica a quantidade de contas antes de deletar
                const accountsSnapshot = await getDocs(accountCollectionRef);
                const accountsCount = accountsSnapshot.docs.filter(doc => doc.data().uid === user.uid).length;

                if (accountsCount > 1) {
                    const transactionsQuery = query(
                        transactionCollectionRef,
                        where("account", "==", selectedAccount.id)
                    );

                    const transactionsSnapshot = await getDocs(transactionsQuery);
                    const deleteTransactionPromises = transactionsSnapshot.docs.map(transactionDoc =>
                        deleteDoc(transactionDoc.ref)
                    );
                    
                    // Aguardar a exclusão de todas as transações
                    await Promise.all(deleteTransactionPromises);

                    await fetchTransactions(user);

                    const accountDocRef = doc(db, "account", selectedAccount.id);
                    await deleteDoc(accountDocRef);

                    await fetchAccounts(user); 
                    setIsDeleteConfirmModalVisible(false);
                    setSelectedAccount(null);
                } else {
                    alert("Você deve ter pelo menos uma conta.");
                    setIsDeleteConfirmModalVisible(false);
                }
            } catch (error) {
                console.error("Erro ao deletar conta e transações: ", error);
            }
        }
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
                            <TouchableOpacity key={account.id} onPress={() => { 
                                setSelectedAccount(account); 
                                setIsOptionsModalVisible(true); 
                            }}>
                                <View style={[styles.account]}>
                                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                        <Image source={getBankLogo(account.bankName)} style={[styles.accountIcon]} />
                                        <Text style={[styles.accountText]}>{account.name}</Text>
                                    </View>
                                    <Text style={[styles.accountValue, { color: account.balance < 0 ? colors.red_500 : colors.green_500 }]}>R$ {formatValue(account.balance)}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>
            <TouchableOpacity style={styles.fabButton} onPress={() => setIsAccountModalVisible(true)}>
                <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
            </TouchableOpacity>
            <Modal
                isVisible={isAccountModalVisible}
                onBackdropPress={handleCloseAndReset}
                backdropOpacity={0.5}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={styles.createAccountModal}>
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
                    <View style={[base.gap_10, base.mt_20]}>
                        <View style={[base.gap_15]}>
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
                            <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconModalVisible(true)}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    <View style={[base.alignItemsCenter, { width: 20 }]}>
                                        {accountIcon
                                            ? <Image source={getBankLogo(accountIcon)} style={[styles.accountIconModal]} />
                                            : <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.ellipsisIcon} />
                                        }
                                    </View>
                                    <Text style={base.inputText}>{accountIcon || 'Ícone da conta'}</Text>
                                </View>
                                <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                            </TouchableOpacity>
                        </View>
                        {/* Toggle para Incluir na Soma da tela inicial */}
                        <View style={[styles.toggleContainer]}>
                            <Text style={[styles.toggleLabel]}>Incluir na soma da tela inicial</Text>
                            <Switch
                                value={includeInSum}
                                onValueChange={(value) => setIncludeInSum(value)}
                                trackColor={{ false: colors.gray_600, true: colors.blue_800 }}
                                thumbColor={includeInSum ? colors.blue_600 : colors.gray_200}
                            />
                        </View>
                    </View>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_30]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleCloseAndReset}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]} onPress={saveAccount}>
                            <Text style={[base.btnText]}>{isEditing ? 'Editar' : 'Criar conta'}</Text>
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
                        <SearchBar searchItem={searchAccountIcon} setSearchItem={setSearchAccountIcon} placeholder="Buscar ícone" />
                        <FlatList
                            data={filteredBanks}
                            keyExtractor={(item) => item}
                            style={[base.mt_5]}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.bankItem}
                                    onPress={() => {
                                        setAccountIcon(item);
                                        setIsIconModalVisible(false);
                                    }}
                                >
                                    <Image source={banks[item]} style={styles.bankIcon} />
                                    <Text style={styles.bankName}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <Text style={[styles.listEmpty]}>
                                    Ops! Nenhum resultado para sua pesquisa.
                                </Text>
                            )}
                        />
                    </View>
                </Modal>
            </Modal>
            <Modal
                isVisible={isOptionsModalVisible}
                onBackdropPress={() => { setIsOptionsModalVisible(false) }}
                backdropOpacity={0.5}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={[styles.containerOptionsModal]}>
                    <Text style={[styles.labelOptions]}>Opções</Text>
                    <View style={[base.gap_30]}>
                        <TouchableOpacity onPress={() => {
                            handleEditAccount();
                            setIsOptionsModalVisible(false);
                        }}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                                <View style={[styles.iconContainer]}>
                                    <FontAwesome6 name='pencil' size={18} color={colors.gray_100} />
                                </View>
                                <Text style={[styles.options, { color: colors.gray_100 }]}>Editar conta</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDeleteAccount}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                                <View style={[styles.iconContainer]}>
                                    <FontAwesome6 name='trash' size={18} color={colors.red_500} />
                                </View>
                                <Text style={[styles.options, { color: colors.red_500 }]}>Excluir conta</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={isDeleteConfirmModalVisible}
                onBackdropPress={() => setIsDeleteConfirmModalVisible(false)}
                backdropOpacity={0.5}
                animationIn="slideInUp"
                animationOut="slideOutDown"
            >
                <View style={styles.confirmationBox}>
                    <Text style={styles.confirmationText}>Tem certeza que deseja excluir esta conta?</Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.cancelButton} 
                            onPress={() => setIsDeleteConfirmModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.confirmButton} 
                            onPress={deleteAccount}
                        >
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    accountIconModal: {
        borderRadius: 50,
        width: 25,
        height: 25
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
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 5
    },
    toggleLabel: {
        fontFamily: "Outfit_500Medium",
        fontSize: 16,
        color: colors.gray_50,
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
    createAccountModal: {
        backgroundColor: colors.gray_875,
        flex: 0.45,
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
        flex: 0.8
    },
    modalTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18, 
        color: colors.gray_50,
        marginBottom: 5
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
    },
    listEmpty: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        textAlign: 'center',
        color: colors.gray_150, 
        marginTop: 20
    },
    containerOptionsModal: {
        backgroundColor: colors.gray_900,
        padding: 30,
        flex: 0.2,
        gap: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    labelOptions: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 22,
        color: colors.gray_100,
        width: '100%',
        borderBottomColor: colors.gray_700,
        borderBottomWidth: 1,
        paddingBottom: 20
    },
    options: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 20,
    },
    iconContainer: {
        width: 20
    },
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
})