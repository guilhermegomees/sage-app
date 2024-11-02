import { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import base from "~/css/base";
import colors from "~/css/colors";
import { ICategory, IUser } from "~/interfaces/interfaces";
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "~/config/firebase";
import useUser from "~/hooks/useUser";
import Modal from "react-native-modal";
import { NewCategoryModal } from "~/components/NewCategoryModal";
import { ColorPickerModal } from "~/components/ColorPickerModal";
import { IconPickerModal } from "~/components/IconPickerModal";
import { transactionContext } from "~/enums/enums";

type CategoriesScreenNavigationProp = StackNavigationProp<any, 'Categories'>;

export default function Categories() {
    const navigation = useNavigation<CategoriesScreenNavigationProp>();
    const user = useUser();

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<ICategory[]>([]);
    const [selectedContext, setSelectedContext] = useState<number>(2);

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const [isNewCategoryVisible, setIsNewCategoryVisible] = useState(false);
    const [nameNewCategory, setNameNewCategory] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('#FF6347');
    const [selectedIcon, setSelectedIcon] = useState<string>('apple-whole');
    
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [isIconPickerVisible, setIsIconPickerVisible] = useState(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const categoryCollectionRef = collection(db, "category");

    const handleNavigateToBack = () => {
        navigation.goBack();
    }

    const handleSelectColor = (color: string): void => {
        setSelectedColor(color);
        setIsColorPickerVisible(false);
    };

    const handleSelectIcon = (icon: string): void => {
        setSelectedIcon(icon);
        setIsIconPickerVisible(false);
    };

    const handleEditCategory = () => {
        if (selectedCategory) {
            setNameNewCategory(selectedCategory.name);
            setSelectedColor(selectedCategory.color);
            setSelectedIcon(selectedCategory.icon);
            setIsNewCategoryVisible(true);
            setIsEditing(true);
            setIsOptionsModalVisible(false);
        }
    };

    const saveCategory = async (): Promise<void> => {
        if (!nameNewCategory || !selectedColor || !selectedIcon) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        try {
            if (user) {
                const category = {
                    name: nameNewCategory,
                    color: selectedColor,
                    icon: selectedIcon,
                    user: user.uid,
                    context: selectedContext
                }

                if (isEditing && selectedCategory) {
                    // Atualizar conta existente
                    const categoryDocRef = doc(db, "category", selectedCategory.id);
                    await setDoc(categoryDocRef, category);
                } else {
                    // Criar nova conta
                    await addDoc(categoryCollectionRef, category);
                }

                await fetchCategories(user);

                resetNewCategory();
                setIsNewCategoryVisible(false);
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

    const deleteCategory = async () => {
        if (user && selectedCategory) {
            try {
                const categoryDocRef = doc(db, "category", selectedCategory.id);
                await deleteDoc(categoryDocRef);

                await fetchCategories(user); 
                setIsOptionsModalVisible(false);
                setSelectedCategory(null);
            } catch (error) {
                console.error("Erro ao deletar conta e transações: ", error);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchCategories(user);
        }
    }, [user]);

    useEffect(() => {
        setFilteredCategories(categories.filter(category => category.context === selectedContext));
    }, [categories, selectedContext]);

    return (
        <View style={styles.container}>
            <View style={styles.backContainer}>
                <TouchableOpacity onPress={handleNavigateToBack} style={styles.iconBack}>
                    <FontAwesome6 name="angle-left" size={20} color={colors.gray_50} />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Categorias</Text>
            </View>
            <View style={[base.w_100, base.alignItemsCenter, base.mb_30, base.mt_5]}>
                <View style={styles.contextFilterContainer}>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedContext === 2 && styles.activeFilterButton]}
                        onPress={() => setSelectedContext(2)}
                    >
                        <Text style={[styles.filterButtonText, selectedContext === 2 && styles.activeFilterButtonText]}>
                            Despesas
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedContext === 1 && styles.activeFilterButton]}
                        onPress={() => setSelectedContext(1)}
                    >
                        <Text style={[styles.filterButtonText, selectedContext === 1 && styles.activeFilterButtonText]}>
                            Receitas
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.categoriesContainer}>
                {filteredCategories.length > 0 ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={base.gap_25}>
                            {filteredCategories.map((category: ICategory) => (
                                <View key={category.id}>
                                    <TouchableOpacity onPress={() => {
                                        setSelectedCategory(category); 
                                        setIsOptionsModalVisible(true);
                                    }}>
                                        <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter]}>
                                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                                <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                                                    <FontAwesome6 name={category.icon} color={colors.white} size={18} />
                                                </View>
                                                <Text style={styles.categoryName}>{category.name}</Text>
                                            </View>
                                            <FontAwesome6 name="angle-right" size={16} color={colors.gray_50} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                ) : (
                    <View style={[base.flex_1, base.justifyContentCenter, base.alignItemsCenter, base.gap_10, base.px_10]}>
                        <Image source={require('./../assets/images/no-category.png')} tintColor={colors.gray_100} style={{ width: 115, height: 115 }} />
                        <Text style={[styles.noCategory]}>Ops! Você ainda não possui nenhuma categoria de {selectedContext === 2 ? 'despesa' : 'receita'}. Use o botão de adicionar para começar!</Text>
                    </View>
                )}
            </View>
            <Modal
                isVisible={isOptionsModalVisible}
                onBackdropPress={() => { setIsOptionsModalVisible(false) }}
                backdropOpacity={0.6}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={[styles.containerOptionsModal]}>
                    <Text style={[styles.labelOptions]}>Opções</Text>
                    <View style={[base.gap_20]}>
                        <TouchableOpacity onPress={() => {
                            handleEditCategory();
                            setIsOptionsModalVisible(false);
                        }}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                                <View style={[styles.iconContainer]}>
                                    <FontAwesome6 name='pencil' size={18} color={colors.gray_100} />
                                </View>
                                <Text style={[styles.options, { color: colors.gray_100 }]}>Editar categoria</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteCategory}>
                            <View style={[base.flexRow, base.alignItemsCenter, base.gap_20]}>
                                <View style={[styles.iconContainer]}>
                                    <FontAwesome6 name='trash' size={18} color={colors.red_500} />
                                </View>
                                <Text style={[styles.options, { color: colors.red_500 }]}>Excluir categoria</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.fabButton} onPress={() => setIsNewCategoryVisible(true)}>
                <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
            </TouchableOpacity>
            <NewCategoryModal
                isVisible={isNewCategoryVisible}
                nameNewCategory={nameNewCategory}
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                setIsNewCategorieVisible={setIsNewCategoryVisible}
                setNameNewCtg={setNameNewCategory}
                setIsColorPickerVisible={setIsColorPickerVisible}
                setIsIconPickerVisible={setIsIconPickerVisible}
                createCategory={saveCategory}
                title='Editar categoria'
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.gray_900
    },
    backContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        gap: 10,
        padding: 30,
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
    },
    contextFilterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.gray_800,
        borderRadius: 100,
        width: 300
    },
    filterButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 16,
    },
    activeFilterButton: {
        backgroundColor: colors.blue_600,
        borderRadius: 50
    },
    activeFilterButtonText: {
        color: colors.white,
    },
    filterButtonText: {
        color: colors.gray_400,
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
    },
    categoriesContainer: {
        flex: 1,
        backgroundColor: colors.gray_800,
        padding: 30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    iconContainer: {
        borderRadius: 50,
        padding: 10,
        width: 42,
        height: 42,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryName: {
        color: colors.gray_100,
        fontSize: 16,
        fontFamily: 'Outfit_500Medium',
        lineHeight: 18,
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
    noCategory: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 19,
        color: colors.gray_50,
        textAlign: "center"
    }
});