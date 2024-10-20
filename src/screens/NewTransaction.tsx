import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput, ScrollView, Image } from "react-native";
import Modal from "react-native-modal";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome6, MaterialIcons, Octicons } from "@expo/vector-icons";
import { ICategory } from "~/interfaces/interfaces";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "~/config/firebase";
import { Calendar } from "~/components/Calendar";
import { transactionContext } from "~/enums/enums";
import { predefinedColors } from "~/constants/colors";
import { predefinedIcons } from "~/constants/icons";
import { useTransactions } from "~/context/TransactionContext";
import useUser from "~/hooks/useUser";

const NewTransaction: React.FC<any> = ({ isModalVisible, context, onClose } : { isModalVisible: boolean, context: transactionContext, onClose: () => void }) => {
    const user = useUser();

    const [isCategoriesVisible, setIsCategoriesVisible] = useState(false);
    const [isNewCategorieVisible, setIsNewCategorieVisible] = useState(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const [valueTransaction, setValueTransaction] = useState<number>(0);
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
    const transactionCollectionRef = collection(db, "transaction");
    const categoryCollectionRef = collection(db, "category");

    const { fetchTransactions } = useTransactions();

    const formatCurrency = (num: number): string => 
        `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const handleChange = (text: string): void => {
        const numericValue = parseFloat(text.replace(/[^\d]/g, '')) / 100;
        setValueTransaction(numericValue);
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
        await fetchCategories();
        setIsCategoriesVisible(true);
    }

    const handleSelectCategory = (category: ICategory): void => {
        setSelectedCategory(category);
        setIsCategoriesVisible(false);
    };

    const handleCloseAndReset = (): void => {
        onClose();
        setValueTransaction(0);
        setDescription('');
        setSelectedDate(today.toISOString().split('T')[0]);
        setSelectedCategory(null);
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
        if (!valueTransaction || !description || !selectedDate || !selectedCategory) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }
    
        try {
            const date = new Date(selectedDate);
            date.setHours(date.getHours() + 3);

            const newTransactionData = {
                value: valueTransaction,
                description: description,
                date: date,
                category: selectedCategory,
                isExpense: context != transactionContext.revenue,
                source: context === transactionContext.cardExpense ? 2 : 1,
                account: "Nubank", // TODO: conta do usuário
                uid: user?.uid,
            }
            
            await addDoc(transactionCollectionRef, newTransactionData);
            await fetchTransactions(user);
            handleCloseAndReset();
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
            const newCategoryData = {
                name: nameNewCategory,
                color: selectedColor,
                icon: selectedIcon,
                user: "user1", // TODO: ID do usuário logado
                context: context === transactionContext.revenue ? 1 : 2
            }
            
            const docRef = await addDoc(categoryCollectionRef, newCategoryData);

            setSelectedCategory({ id: docRef.id, ...newCategoryData });

            resetNewCategory();
            setIsNewCategorieVisible(false);
        } catch (error) {
            console.error("Erro ao criar categoria: ", error);
        }
    };

    const resetNewCategory = (): void => {
        setNameNewCategory('');
        setSelectedColor('#FF6347');
        setSelectedIcon('apple-whole');
    };

    const fetchCategories = async (): Promise<void> => {
        try {
            const q = query(categoryCollectionRef, where("context", "==", context === transactionContext.revenue ? 1 : 2));
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
        fetchCategories();
    }, []);

    const filteredCategories = categories.filter(ctg => 
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
                <View style={styles.containerValueTransaction}>
                    <Text style={styles.label}>Valor</Text>
                    <TextInput 
                        style={[styles.valueTransaction, { color: context === transactionContext.revenue ? colors.green_500 : colors.red_500 }]}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={context === transactionContext.revenue ? colors.green_500 : colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(valueTransaction)}
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
                            {selectedCategory
                                ? <FontAwesome6 name={selectedCategory.icon} color={selectedCategory.color} size={20}/>
                                : <FontAwesome6 name="ellipsis" color={colors.gray_100} size={20} style={styles.iconCtgEmpty}/>
                            }
                            <Text style={base.inputText}>{selectedCategory?.name || "Categoria"}</Text>
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
            <CategoriesModal
                isVisible={isCategoriesVisible}
                filteredCategories={filteredCategories}
                searchCategory={searchCategory}
                setSearchCategory={setSearchCategory}
                handleSelectCategory={handleSelectCategory}
                handleNewCategory={handleNewCategory}
                setIsCategoriesVisible={setIsCategoriesVisible}
                category={selectedCategory}
                context={context}
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

interface CategoriesModalProps {
    isVisible: boolean;
    filteredCategories: ICategory[];
    searchCategory: string;
    setSearchCategory: (text: string) => void;
    handleSelectCategory: (ctg: ICategory) => void;
    handleNewCategory: () => void;
    setIsCategoriesVisible: (visible: boolean) => void;
    category: ICategory | null;
    context: transactionContext
}
  
const CategoriesModal: React.FC<CategoriesModalProps> = ({
    isVisible,
    filteredCategories,
    searchCategory,
    setSearchCategory,
    handleSelectCategory,
    handleNewCategory,
    setIsCategoriesVisible,
    category,
    context
}) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsCategoriesVisible(false)}
        backdropOpacity={0.4}
        style={[base.justifyContentEnd, base.m_0]}
    >
        <View style={[styles.categoriesContainer]}>
            <View style={[base.px_20]}>
                {/* Barra de pesquisa */}
                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_18, styles.line]}>
                    <View style={[styles.containerIcon, {backgroundColor: colors.gray_600}]}>
                        <FontAwesome6 name="magnifying-glass" color={colors.white} size={15}/>
                    </View>
                    <TextInput
                        placeholder="Pesquisar categoria"
                        placeholderTextColor={colors.gray_300}
                        style={[styles.searchBar]}
                        value={searchCategory}
                        onChangeText={setSearchCategory}
                    />
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredCategories.map((ctg) => {
                    const isSelected = category?.id === ctg.id;
                    return (
                        <TouchableOpacity key={ctg.id} style={[base.px_20]} onPress={() => handleSelectCategory(ctg)}>
                            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter, base.w_100, base.py_18]}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    <View style={[styles.containerIcon, {backgroundColor: ctg.color}]}>
                                        <FontAwesome6 name={ctg.icon} color={colors.white} size={15}/>
                                    </View>
                                    <Text style={[styles.categorieName]}>{ctg.name}</Text>
                                </View>
                                <Octicons
                                    name={isSelected ? "check-circle-fill" : "circle"}
                                    size={20}
                                    color={isSelected ? colors.blue_300 : colors.gray_600}
                                />
                            </View>
                            <View style={[styles.line]}/>
                        </TouchableOpacity>
                    )
                })}
                {Object.keys(filteredCategories).length === 0 && (
                    <View style={[base.justifyContentCenter, base.alignItemsCenter, base.flex_1, base.pt_25, base.pb_10, base.px_25]}>
                        <View style={[base.justifyContentCenter, base.alignItemsCenter, base.gap_15]}>
                            <Image source={require('./../assets/images/empty-folder.png')} tintColor={colors.gray_100} style={{ width: 65, height: 65 }} />
                            <Text style={base.emptyMessage}>
                                Você ainda não tem categorias de
                                {context === transactionContext.revenue ? ' receitas' : ' despesas'}. 
                                Comece criando uma em "Criar nova categoria".
                            </Text>
                        </View>
                    </View>
                )}
                {/* Nova categoria */}
                <TouchableOpacity style={[base.px_20, base.pb_10]} onPress={handleNewCategory}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_18]}>
                        <View style={[styles.containerIcon, {backgroundColor: colors.gray_600}]}>
                            <FontAwesome6 name="plus" color={colors.white} size={15}/>
                        </View>
                        <Text style={[styles.textCreateCtg]}>Criar nova categoria</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    </Modal>
);

interface NewCategoryModalProps {
    isVisible: boolean;
    nameNewCategory: string | any;
    selectedColor: string;
    selectedIcon: string;
    setIsNewCategorieVisible: (visible: boolean) => void;
    setNameNewCtg: (desc: string) => void;
    setIsColorPickerVisible: (visible: boolean) => void;
    setIsIconPickerVisible: (visible: boolean) => void;
    createCategory: () => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ isVisible, nameNewCategory, selectedColor, selectedIcon, setIsNewCategorieVisible, setNameNewCtg, setIsColorPickerVisible, setIsIconPickerVisible, createCategory }) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={() => setIsNewCategorieVisible(false)}
        backdropOpacity={0.4}
        style={[base.justifyContentEnd, base.m_0]}
    >
        <View style={[styles.newCategorieContainer]}>
            <Text style={styles.createNewCtg}>Criar nova categoria</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={[base.gap_15]}>
                    <TextInput
                        style={[base.input, { backgroundColor: colors.gray_825 }]}
                        placeholder="Nome"
                        placeholderTextColor={colors.gray_200}
                        value={nameNewCategory}
                        onChangeText={setNameNewCtg}
                        maxLength={25}
                    />
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsColorPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome6 name="palette" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Cor</Text>
                        </View>
                        <View style={[styles.colorCircleCtg, base.m_0, { backgroundColor: selectedColor }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome6 name="image" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Ícone</Text>
                        </View>
                        <FontAwesome6 name={selectedIcon} color={selectedColor} size={20}/>
                    </TouchableOpacity>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_10]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={() => setIsNewCategorieVisible(false)}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]} onPress={createCategory}>
                            <Text style={[base.btnText]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    </Modal>
);

interface ColorPickerModalProps {
    isVisible: boolean;
    handleSelectColor: (color: string) => void;
    setIsColorPickerVisible: (visible: boolean) => void;
}
  
const ColorPickerModal: React.FC<ColorPickerModalProps> = ({ isVisible, handleSelectColor, setIsColorPickerVisible }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsColorPickerVisible(false)}
            backdropOpacity={0}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalColorPicker}>
                <Text style={[styles.colorPickerTitle, styles.line, base.w_100]}>Selecione uma cor</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.colorsContainer}>
                        {predefinedColors.map((color) => (
                            <View key={color} style={[base.alignItemsCenter]}>
                                <TouchableOpacity
                                    style={[styles.colorCircle, { backgroundColor: color }]}
                                    onPress={() => handleSelectColor(color)}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

interface IconPickerModalProps {
    isVisible: boolean;
    handleSelectIcon: (icon: string) => void;
    setIsIconPickerVisible: (visible: boolean) => void;
}
  
const IconPickerModal: React.FC<IconPickerModalProps> = ({ isVisible, handleSelectIcon, setIsIconPickerVisible }) => {
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsIconPickerVisible(false)}
            backdropOpacity={0}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalIconPicker}>
                <Text style={[styles.iconPickerTitle, styles.line, base.w_100]}>Selecione um ícone</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.iconsContainer}>
                        {predefinedIcons.map((icon) => (
                            <TouchableOpacity
                                key={icon}
                                onPress={() => handleSelectIcon(icon)}
                                style={[styles.icon]}
                            >
                                <View style={[base.alignItemsCenter]}>
                                    <FontAwesome6 name={icon} color={colors.gray_100} size={25} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.91,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    containerValueTransaction: {
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
    },
    valueTransaction: {
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
    categoriesContainer: {
        backgroundColor: colors.gray_875,
        height: '80%',
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    createNewCtg: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 18,
		color: colors.white,
        marginBottom: 5
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_700
    },
    containerIcon: {
        borderRadius: 50,
        padding: 10,
        width: 38,
        height: 38,
        justifyContent: "center",
        alignItems: "center"
    },
    categorieName: {
        color: colors.gray_100,
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
        lineHeight: 18
    },
    textCreateCtg: {
        color: colors.gray_200,
        fontSize: 15,
        fontFamily: 'Outfit_500Medium'
    },
    searchBar: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15,
        color: colors.gray_200
    },

    // Nova Categoria
    newCategorieContainer: {
        backgroundColor: colors.gray_875,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingBottom: 30,
        gap: 15
    },
    colorCircleCtg: {
        width: 22,
        height: 22,
        borderRadius: 25,
    },
    // Color Picker
    modalColorPicker: {
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: "100%",
        height: "50%",
        alignItems: "center",
    },
    colorPickerTitle: {
        fontFamily: "Outfit_400Regular",
        color: colors.white,
        fontSize: 18,
        marginBottom: 20,
        paddingBottom: 10
    },
    colorsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center"
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 25, 
    },
    // Icon Picker
    modalIconPicker: {
        backgroundColor: colors.gray_800,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        width: "100%",
        height: "50%",
        alignItems: "center",
    },
    iconPickerTitle: {
        fontFamily: "Outfit_400Regular",
        color: colors.white,
        fontSize: 18,
        marginBottom: 20,
        paddingBottom: 10
    },
    iconsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 30,
        justifyContent: "center",
        paddingHorizontal: 5,
    },
    icon: {
        width: 40,
        height: 40,
    }
});

export default NewTransaction;