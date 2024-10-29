import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput, ScrollView, Image, ImageSourcePropType } from "react-native";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome6, Octicons } from "@expo/vector-icons";
import { IAccount, ICategory, IUser } from "~/interfaces/interfaces";
import { addDoc, collection, doc, getDoc, getDocs, query, runTransaction, where } from "firebase/firestore";
import { db } from "~/config/firebase";
import { Calendar } from "~/components/Calendar";
import { transactionContext } from "~/enums/enums";
import { predefinedColors } from "~/constants/colors";
import { predefinedIcons } from "~/constants/icons";
import { useTransactions } from "~/context/TransactionContext";
import useUser from "~/hooks/useUser";
import { getBankLogo } from "~/utils/utils";
import { useAccounts } from "~/context/AccountContext";
import { SelectionModal } from "~/components/SelectionModal";
import { NewCategoryModal } from "~/components/NewCategoryModal";
import { ColorPickerModal } from "~/components/ColorPickerModal";
import { IconPickerModal } from "~/components/IconPickerModal";

const NewTransaction: React.FC<any> = ({ isModalVisible, context, onClose } : { isModalVisible: boolean, context: transactionContext, onClose: () => void }) => {
    const user = useUser();
    
    const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
    const [isNewCategorieVisible, setIsNewCategorieVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isAccountsVisible, setIsAccountsVisible] = useState(false);

    const [transactionValue, setTransactionValue] = useState<number>(0);
    const [description, setDescription] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [searchCategory, setSearchCategory] = useState<string>('');
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [nameNewCategory, setNameNewCategory] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('#FF6347');
    const [selectedIcon, setSelectedIcon] = useState<string>('apple-whole');

    const today = new Date();
    today.setHours(today.getHours() - 3);
    const [selectedDate, setSelectedDate] = useState<string>(today.toISOString().split('T')[0]);
    const [selectedTempDate, setSelectedTempDate] = useState<string>(today.toISOString().split('T')[0]);
    const [formattedDate, setFormattedDate] = useState<string>(today.toLocaleDateString('pt-BR'));
    
    const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);
    const [searchAccount, setSearchAccount] = useState<string>('');

    const transactionCollectionRef = collection(db, "transaction");
    const categoryCollectionRef = collection(db, "category");

    const { fetchTransactions } = useTransactions();
    const { accounts, fetchAccounts } = useAccounts();

    const formatCurrency = (num: number): string => 
        `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const handleChange = (text: string): void => {
        const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100;
        setTransactionValue(numericValue);
    };

    const handleSelectTempDate = (date: string): void => setSelectedTempDate(date);

    const handleSelectDate = (): void => {
        setSelectedDate(selectedTempDate);
        const [year, month, day] = selectedTempDate.split("-");
        setFormattedDate(new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('pt-BR'));
        setIsCalendarVisible(false);
    };

    const handleCancelCalendar = (): void => {
        setSelectedTempDate(selectedDate);
        setIsCalendarVisible(false);
    };

    const handleDateClick = (): void => setIsCalendarVisible(true);

    const openCategoryModal = async (): Promise<void> => {
        if(user){
            await fetchCategories(user);
            setIsCategoriesVisible(true);
        }
    }

    const openAccountModal = async (): Promise<void> => {
        if(user){
            await fetchAccounts(user);
            setIsAccountsVisible(true);
        }
    }

    const handleSelectCategory = (category: ICategory): void => {
        setSelectedCategory(category);
        setIsCategoriesVisible(false);
    };

    const handleSelectAccount = (account: IAccount): void => {
        setSelectedAccount(account);
        setIsAccountsVisible(false);
    };

    const handleCloseAndReset = (): void => {
        onClose();
        setTransactionValue(0);
        setDescription('');
        setSelectedDate(today.toISOString().split('T')[0]);
        setSelectedCategory(null);
        setSelectedAccount(null);
    };

    const handleNewCategory = (): void => {
        setIsCategoriesVisible(false);
        setIsNewCategorieVisible(true);
    };

    const handleSelectColor = (color: string): void => {
        setSelectedColor(color);
        setIsColorPickerVisible(false);
    };

    const handleSelectIcon = (icon: string): void => {
        setSelectedIcon(icon);
        setIsIconPickerVisible(false);
    };

    const createTransaction = async (): Promise<void> => {
        if (!transactionValue || !description || !selectedDate || !selectedCategory || !selectedAccount) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        try {
            if (user) {
                const date = new Date(selectedDate);
                date.setHours(date.getHours() + 3);

                const isExpense = context != transactionContext.revenue;
                const updatedValue = isExpense ? -transactionValue : transactionValue;

                // Cria os dados da nova transação
                const newTransactionData = {
                    value: transactionValue,
                    description: description,
                    date: date,
                    category: {
                        id: selectedCategory.id,
                        color: selectedCategory.color,
                        icon: selectedCategory.icon,
                    },
                    isExpense: isExpense,
                    source: context === transactionContext.cardExpense ? 2 : 1,
                    account: selectedAccount.id,
                    uid: user.uid,
                };

                // Adiciona a nova transação
                await addDoc(transactionCollectionRef, newTransactionData);

                // Atualiza o valor da conta no Firestore
                const accountRef = doc(db, 'account', selectedAccount.id);
                await runTransaction(db, async (transaction) => {
                    const accountDoc = await getDoc(accountRef);
                    if (accountDoc.exists()) {
                        const currentBalance = accountDoc.data().balance || 0;
                        const newBalance = parseFloat(currentBalance) + updatedValue;

                        transaction.update(accountRef, { balance: newBalance });
                    }
                });

                // Busca as transações atualizadas e fecha o modal
                await fetchTransactions(user);
                await fetchAccounts(user);
                handleCloseAndReset();
            }
        } catch (error) {
            console.error("Erro ao criar transação: ", error);
        }
    };

    const createCategory = async (): Promise<void> => {
        if (!nameNewCategory || !selectedColor || !selectedIcon) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        try {
            if (user) {
                const newCategoryData = {
                    name: nameNewCategory,
                    color: selectedColor,
                    icon: selectedIcon,
                    user: user.uid,
                    context: context === transactionContext.revenue ? 1 : 2
                }

                const docRef = await addDoc(categoryCollectionRef, newCategoryData);

                setSelectedCategory({ id: docRef.id, ...newCategoryData });

                resetNewCategory();
                setIsNewCategorieVisible(false);
            }
        } catch (error) {
            console.error("Erro ao criar categoria: ", error);
        }
    };

    const resetNewCategory = (): void => {
        setNameNewCategory('');
        setSelectedColor('#FF6347');
        setSelectedIcon('apple-whole');
    };

    const fetchCategories = async (user: IUser): Promise<void> => {
        try {
            const q = query(
                categoryCollectionRef, 
                where("context", "==", context === transactionContext.revenue ? 1 : 2),
                where("user", "==", user.uid)
            );
            const querySnapshot = await getDocs(q);
            const data: ICategory[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                user: doc.data().user,
                name: doc.data().name,
                icon: doc.data().icon,
                color: doc.data().color,
                context: doc.data().context
            }));
            
            setCategories(data);
        } catch (error) {
            console.error("Erro ao buscar categorias: ", error);
        }
    };

    useEffect(() => {
        if(user) {
            fetchCategories(user);
            fetchAccounts(user);
        }
    }, [user]);

    useEffect(() => {
        if (accounts.length > 0 && isModalVisible) {
            setSelectedAccount(accounts[0]);
        }
    }, [isModalVisible]);

    const filteredCategories = categories.filter(ctg => 
        ctg.name.toLowerCase().includes(searchCategory.toLowerCase())
    );

    const filteredAccounts = accounts.filter(ctg => 
        ctg.name.toLowerCase().includes(searchCategory.toLowerCase())
    );
    
    return (
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={handleCloseAndReset}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modal}>
                <View style={styles.containertransactionValue}>
                    <Text style={styles.label}>Valor</Text>
                    <TextInput 
                        style={[styles.transactionValue, { color: context === transactionContext.revenue ? colors.green_500 : colors.red_500 }]}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={context === transactionContext.revenue ? colors.green_500 : colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(transactionValue)}
                    />
                </View>
                <View style={[base.gap_18, base.mt_20]}>
                    {/* Descrição */}
                    <TextInput
                        style={base.inputDescript}
                        placeholder="Descrição"
                        placeholderTextColor={colors.gray_200}
                        onChangeText={setDescription}
                        value={description}
                        maxLength={25}
                    />
                    {/* Data */}
                    <TouchableOpacity style={[base.input, base.gap_5, base.justifyContentStart, { backgroundColor: colors.gray_825 }]} onPress={handleDateClick}>
                        <FontAwesome6 name="calendar-day" color={colors.gray_100} size={20} />
                        <Text style={styles.textBtnDate}>{formattedDate}</Text>
                    </TouchableOpacity>
                    {/* Categoria */}
                    <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={openCategoryModal}>
                        <View style={styles.row}>
                            <View style={[base.alignItemsCenter, {width: 20}]}>
                                {selectedCategory
                                    ? <FontAwesome6 name={selectedCategory.icon} color={selectedCategory.color} size={20}/>
                                    : <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.iconCtgEmpty}/>
                                }
                            </View>
                            <Text style={base.inputText}>{selectedCategory?.name || "Categoria"}</Text>
                        </View>
                        <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                    </TouchableOpacity>
                    {/* Conta */}
                    <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={openAccountModal}>
                        <View style={styles.row}>
                            <View style={[base.alignItemsCenter, {width: 20}]}>
                                {selectedAccount
                                    ? <Image source={getBankLogo(selectedAccount.bankName)} style={[styles.accountIcon]}/>
                                    : <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.iconCtgEmpty}/>
                                }
                            </View>
                            <Text style={base.inputText}>{selectedAccount?.name || "Conta"}</Text>
                        </View>
                        <FontAwesome6 name="angle-right" color={colors.gray_100} size={15} />
                    </TouchableOpacity>
                </View>
                <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_30]}>
                    <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleCloseAndReset}>
                        <Text style={[base.btnText]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.button, base.btnSave]} onPress={createTransaction}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <Calendar
                isVisible={isCalendarVisible}
                selectedTempDate={selectedTempDate || selectedDate}
                handleSelectTempDate={handleSelectTempDate}
                handleSelectDate={handleSelectDate}
                handleCancelCalendar={handleCancelCalendar}
            />
            <SelectionModal
                isVisible={isCategoriesVisible}
                filteredItems={filteredCategories}
                searchItem={searchCategory}
                setSearchItem={setSearchCategory}
                handleSelectItem={handleSelectCategory}
                handleNewItem={handleNewCategory}
                setIsVisible={setIsCategoriesVisible}
                selectedItem={selectedCategory}
                contextLabel="categoria"
                getItemIcon={(category) => category.icon}
                getItemColor={(category) => category.color}
                getItemName={(category) => category.name}
            />
            <SelectionModal
                isVisible={isAccountsVisible}
                filteredItems={filteredAccounts}
                searchItem={searchAccount}
                setSearchItem={setSearchAccount}
                handleSelectItem={handleSelectAccount}
                setIsVisible={setIsAccountsVisible}
                selectedItem={selectedAccount}
                contextLabel="conta"
                getItemIcon={(account) => getBankLogo(account.bankName)}
                getItemName={(account) => account.name}
            />
            <NewCategoryModal
                isVisible={isNewCategorieVisible}
                nameNewCategory={nameNewCategory}
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                setIsNewCategorieVisible={setIsNewCategorieVisible}
                setNameNewCtg={setNameNewCategory}
                setIsColorPickerVisible={setIsColorPickerVisible}
                setIsIconPickerVisible={setIsIconPickerVisible}
                createCategory={createCategory}
            />
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
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.91,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    containertransactionValue: {
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
    },
    transactionValue: {
        height: 40,
        fontSize: 28,
        fontFamily: 'Outfit_600SemiBold',
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    iconCtgEmpty: {
        width: 18,
    },
    label: {
        color: colors.gray_200,
        fontSize: 16,
        fontFamily: 'Outfit_400Regular',
    },
    textBtnDate: {
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
        marginLeft: 10,
    },
    accountIcon: {
        borderRadius: 50,
        width: 25,
        height: 25
    },
});

export default NewTransaction;