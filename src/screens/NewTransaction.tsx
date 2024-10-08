import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome5, MaterialIcons, Octicons } from "@expo/vector-icons";
import { ICategory } from "~/interfaces/interfaces";
import { categories as categoriesList } from "./CategoryGraphic";
import { collection, getDocs } from "firebase/firestore";
import { db } from "~/config";

LocaleConfig.locales['pt-BR'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-BR';

const NewTransaction: React.FC<any> = (props) => {
    const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(false);
    const [isNewCategorieVisible, setIsNewCategorieVisible] = useState<boolean>(false);
    const [isColorPickerVisible, setIsColorPickerVisible] = useState<boolean>(false);
    const [isIconPickerVisible, setIsIconPickerVisible] = useState<boolean>(false);

    const [valueTransaction, setValueTransaction] = useState<number>(0);
    const [descript, setDescript] = useState<string | any>();
    const [categorie, setCategorie] = useState<ICategory | null>(null);
    const [searchCategorie, setSearchCategorie] = useState<string>('');
    const [descriptNewCtg, setDescriptNewCtg] = useState<string | any>();
    const [categories, setCategories] = useState<ICategory[] | any>();

    const getToday = () => { return new Date(); };

    const [selectedDate, setSelectedDate] = useState<string>(getToday().toISOString().split('T')[0]);
    const [selectedTempDate, setSelectedTempDate] = useState<string>(getToday().toISOString().split('T')[0]);
    const [formattedDate, setFormattedDate] = useState<string>(getToday().toLocaleDateString('pt-BR'));
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

    const [selectedColor, setSelectedColor] = useState<string>("#FF6347");
    const [selectedIcon, setSelectedIcon] = useState<string>("home");

    const formatCurrency = (num: number) => {
        return `R$ ${num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleChange = (text: string) => {
        const rawValue = text.replace(/[^\d]/g, '');
        const numericValue = parseFloat(rawValue) / 100;

        setValueTransaction(numericValue);
    };
    
    const handleSelectTempDate = (date: string) => {
        setSelectedTempDate(date);
    };

    const handleSelectDate = () => {
        setSelectedDate(selectedTempDate);

        const [year, month, day] = selectedTempDate.split("-");
        setFormattedDate(new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('pt-BR'));
        setIsCalendarVisible(false);
    };

    const handleCancelCalendar = () => {
        setSelectedTempDate(selectedDate)
        setIsCalendarVisible(false)
    }

    const handleDateClick = () => {
        setIsCalendarVisible(true);
    };

    const handleSelectCategorie = (ctg: ICategory) => {
        setCategorie(ctg);
        setIsCategoriesVisible(false);
    }

    const handleCloseAndReset = () => {
        props.onClose();
        setValueTransaction(0);
        setDescript(null);
        setSelectedDate(getToday().toISOString().split('T')[0]);
        setCategorie(null);
    }

    const handleNewCategorie = () => {
        setIsCategoriesVisible(false);
        setIsNewCategorieVisible(true);
    }

    const handleSelectColor = (color: string): void => {
        setSelectedColor(color);
        setIsColorPickerVisible(false);
    };

    const handleSelectIcon = (icon: string): void => {
        setSelectedIcon(icon);
        setIsIconPickerVisible(false);
    };

    const fetchCategories = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "categorie"));
            const data: ICategory[] = querySnapshot.docs.map(doc => {
                const categorieData = doc.data();

                return {
                    id: categorieData.id || 0,
                    user: categorieData.user,
                    name: categorieData.name,
                    icon: categorieData.icon,
                    color: categorieData.color,
                };
            });

            setCategories(data);
        } catch (error) {
            console.error("Erro ao buscar categorias: ", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const filteredCategories = categories?.filter((ctg : ICategory) =>
        ctg.name.toLowerCase().includes(searchCategorie.toLowerCase())
    );
    
    return (
        <Modal
            isVisible={props.isModalVisible}
            onBackdropPress={handleCloseAndReset}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modal}>
                <View style={styles.containerValueTransaction}>
                    <Text style={styles.label}>Valor</Text>
                    <TextInput 
                        style={styles.valueTransaction}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={colors.red_500}
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
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                    />
                    {/* Data */}
                    <TouchableOpacity style={[base.input, base.gap_5, base.justifyContentStart, { backgroundColor: colors.gray_825 }]} onPress={handleDateClick}>
                        <FontAwesome5 name="calendar-alt" color={colors.gray_100} size={20} />
                        <Text style={styles.textBtnDate}>{formattedDate}</Text>
                    </TouchableOpacity>
                    {/* Categoria */}
                    <TouchableOpacity style={[base.input, { backgroundColor: colors.gray_825 }]} onPress={() => setIsCategoriesVisible(true)}>
                        <View style={styles.row}>
                            {categorie
                                ? <FontAwesome5 name={categorie.icon} color={categorie.color} size={20}/>
                                : <MaterialIcons name="more-horiz" color={colors.gray_100} size={20} style={styles.iconCtgEmpty}/>
                            }
                            <Text style={base.inputText}>{categorie?.name || "Categoria"}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" color={colors.gray_100} size={20} />
                    </TouchableOpacity>
                </View>
                <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_30]}>
                    <TouchableOpacity style={[base.button, base.btnCancel]} onPress={handleCloseAndReset}>
                        <Text style={[base.btnText]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.button, base.btnSave]}>
                        <Text style={[base.btnText]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CalendarModal
                isVisible={isCalendarVisible}
                selectedTempDate={selectedTempDate || selectedDate}
                handleSelectTempDate={handleSelectTempDate}
                handleSelectDate={handleSelectDate}
                handleCancelCalendar={handleCancelCalendar}
            />
            <CategoriesModal
                isVisible={isCategoriesVisible}
                filteredCategories={filteredCategories}
                searchCategorie={searchCategorie}
                setSearchCategorie={setSearchCategorie}
                handleSelectCategorie={handleSelectCategorie}
                handleNewCategorie={handleNewCategorie}
                setIsCategoriesVisible={setIsCategoriesVisible}
                categorie={categorie}
            />
            <NewCategoryModal
                isVisible={isNewCategorieVisible}
                descriptNewCtg={descriptNewCtg}
                selectedColor={selectedColor}
                selectedIcon={selectedIcon}
                setIsNewCategorieVisible={setIsNewCategorieVisible}
                setDescriptNewCtg={setDescriptNewCtg}
                setIsColorPickerVisible={setIsColorPickerVisible}
                setIsIconPickerVisible={setIsIconPickerVisible}
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

interface CalendarModalProps {
    isVisible: boolean;
    selectedTempDate: string;
    handleSelectTempDate: (date: string) => void;
    handleSelectDate: () => void;
    handleCancelCalendar: () => void;
  }
  
const CalendarModal: React.FC<CalendarModalProps> = ({
    isVisible,
    selectedTempDate,
    handleSelectTempDate,
    handleSelectDate,
    handleCancelCalendar,
}) => (
    <Modal
        isVisible={isVisible}
        onBackdropPress={handleCancelCalendar}
        backdropOpacity={0.4}
        style={[base.alignItemsCenter, base.px_10]}
    >
        <View style={styles.calendarContainer}>
            <Calendar
                initialDate={selectedTempDate}
                onDayPress={(day: any) => handleSelectTempDate(day.dateString)}
                markedDates={{ [selectedTempDate]: { selected: true, selectedColor: colors.blue_300 } }}
                style={styles.calendar}
                hideExtraDays={true}
                theme={calendarTheme}
                renderArrow={(direction: string) => (
                    <MaterialIcons
                        name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                        size={24}
                        color={colors.blue_300}
                    />
                )}
            />
            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.px_15, base.mt_20]}>
                <TouchableOpacity onPress={handleCancelCalendar}>
                    <Text style={[styles.calendarText, {color: colors.orange_300}]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSelectDate}>
                    <Text style={styles.calendarText}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

interface CategoriesModalProps {
    isVisible: boolean;
    filteredCategories: ICategory[];
    searchCategorie: string;
    setSearchCategorie: (text: string) => void;
    handleSelectCategorie: (ctg: ICategory) => void;
    handleNewCategorie: () => void;
    setIsCategoriesVisible: (visible: boolean) => void;
    categorie: ICategory | null;
  }
  
const CategoriesModal: React.FC<CategoriesModalProps> = ({
    isVisible,
    filteredCategories,
    searchCategorie,
    setSearchCategorie,
    handleSelectCategorie,
    handleNewCategorie,
    setIsCategoriesVisible,
    categorie,
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
                        <FontAwesome5 name="search" color={colors.white} size={15}/>
                    </View>
                    <TextInput
                        placeholder="Pesquisar categoria"
                        placeholderTextColor={colors.gray_300}
                        style={[styles.searchBar]}
                        value={searchCategorie}
                        onChangeText={setSearchCategorie}
                    />
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {filteredCategories.map((ctg) => {
                    const isSelected = categorie?.id === ctg.id;
                    return (
                        <TouchableOpacity key={ctg.id} style={[base.px_20]} onPress={() => handleSelectCategorie(ctg)}>
                            <View style={[base.flexRow, base.justifyContentSpaceBetween, base.alignItemsCenter, base.w_100, base.py_18]}>
                                <View style={[base.flexRow, base.alignItemsCenter, base.gap_15]}>
                                    <View style={[styles.containerIcon, {backgroundColor: ctg.color}]}>
                                        <FontAwesome5 name={ctg.icon} color={colors.white} size={15}/>
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
                {/* Nova categoria */}
                <TouchableOpacity style={[base.px_20, base.pb_10]} onPress={handleNewCategorie}>
                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_18]}>
                        <View style={[styles.containerIcon, {backgroundColor: colors.gray_600}]}>
                            <FontAwesome5 name="plus" color={colors.white} size={15}/>
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
    descriptNewCtg: string | any;
    selectedColor: string;
    selectedIcon: string;
    setIsNewCategorieVisible: (visible: boolean) => void;
    setDescriptNewCtg: (desc: string) => void;
    setIsColorPickerVisible: (visible: boolean) => void;
    setIsIconPickerVisible: (visible: boolean) => void;
}

const NewCategoryModal: React.FC<NewCategoryModalProps> = ({ isVisible, descriptNewCtg, selectedColor, selectedIcon, setIsNewCategorieVisible, setDescriptNewCtg, setIsColorPickerVisible, setIsIconPickerVisible }) => (
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
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescriptNewCtg}
                        value={descriptNewCtg}
                        maxLength={25}
                    />
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsColorPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome5 name="palette" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Cor</Text>
                        </View>
                        <View style={[styles.colorCircleCtg, base.m_0, { backgroundColor: selectedColor }]} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[base.input, base.justifyContentSpaceBetween, { backgroundColor: colors.gray_825 }]} onPress={() => setIsIconPickerVisible(true)}>
                        <View style={styles.row}>
                            <FontAwesome5 name="image" color={colors.gray_100} size={20}/>
                            <Text style={base.inputText}>Ícone</Text>
                        </View>
                        <FontAwesome5 name={selectedIcon} color={selectedColor} size={20}/>
                    </TouchableOpacity>
                    <View style={[base.flexRow, base.justifyContentSpaceBetween, base.mt_10]}>
                        <TouchableOpacity style={[base.button, base.btnCancel]} onPress={() => setIsNewCategorieVisible(false)}>
                            <Text style={[base.btnText]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[base.button, base.btnSave]}>
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
    // Lista de cores pré-definidas
    const predefinedColors = [
        "#FF6347", // Tomato
        "#FFD700", // Gold
        "#32CD32", // Lime Green
        "#1E90FF", // Dodger Blue
        "#FF69B4", // Hot Pink
        "#8A2BE2", // Blue Violet
        "#FF4500", // Orange Red
        "#2E8B57", // Sea Green
        "#4682B4", // Steel Blue
        "#A52A2A", // Brown
    ];
  
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsColorPickerVisible(false)}
            backdropOpacity={0}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalColorPicker}>
                <Text style={[styles.colorPickerTitle, styles.line, base.w_100]}>Selecione uma cor</Text>
                <View style={styles.colorsContainer}>
                    {predefinedColors.map((color) => (
                    <TouchableOpacity
                        key={color}
                        style={[styles.colorCircle, { backgroundColor: color }]}
                        onPress={() => handleSelectColor(color)}
                    />
                    ))}
                </View>
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
    // Lista de ícones pré-definidos
    const predefinedIcons = [
        "home",
        "apple-alt",
        "heart",
        "mug-hot",
        "music",
        "paw",
        "plane",
        "umbrella-beach",
        "wallet",
        "wrench",
    ];
  
    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={() => setIsIconPickerVisible(false)}
            backdropOpacity={0}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modalIconPicker}>
                <Text style={[styles.iconPickerTitle, styles.line, base.w_100]}>Selecione um ícone</Text>
                <View style={styles.iconsContainer}>
                    {predefinedIcons.map((icon) => (
                    <TouchableOpacity
                        key={icon}
                        onPress={() => handleSelectIcon(icon)}
                        style={[styles.icon]}
                    >
                        <FontAwesome5 name={icon} color={colors.gray_100} size={25}/>
                    </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const calendarTheme = {
    calendarBackground: colors.gray_800,
    textSectionTitleColor: colors.gray_500,
    todayTextColor: colors.blue_300,
    dayTextColor: colors.gray_100,
    dotColor: colors.blue_300,
    arrowColor: colors.blue_300,
    monthTextColor: colors.blue_300,
    indicatorColor: colors.blue_300,
    textDayFontFamily: 'Outfit_600SemiBold',
    textMonthFontFamily: 'Outfit_600SemiBold',
    textDayHeaderFontFamily: 'Outfit_600SemiBold',
    selectedDayTextColor: 'black',
    'stylesheet.day': {
        base: { margin: 1 },
        text: { borderRadius: 10 },
    },
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
        color: colors.red_500,
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
    calendarContainer: {
        width: "100%",
        padding: 15,
        paddingBottom: 25,
        backgroundColor: colors.gray_800,
        borderRadius: 15,
    },
    calendar: {
        backgroundColor: colors.gray_800,
        borderRadius: 15,
    },
    calendarText: {
        fontSize: 16,
        fontFamily: 'Outfit_600SemiBold',
        color: colors.blue_300,
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
        fontFamily: 'Outfit_500Medium'
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
        justifyContent: "center"
    },
    icon: {
        width: 40,
        height: 40,
    }
});

export default NewTransaction;