import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { ICategory } from "~/interfaces/interfaces";
import { categories as categoriesList } from "./CategoryGraphic";

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
    const [value, setValue] = useState<number>(0);
    const [descript, setDescript] = useState<string>();
    const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(false);
    const [categorie, setCategorie] = useState<ICategory>();

    const getToday = () => { return new Date(); };

    const [selectedDate, setSelectedDate] = useState<string>(getToday().toISOString().split('T')[0]);
    const [selectedTempDate, setSelectedTempDate] = useState<string>(getToday().toISOString().split('T')[0]);
    const [formattedDate, setFormattedDate] = useState<string>(getToday().toLocaleDateString('pt-BR'));
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);

    const formatCurrency = (num: number) => {
        return `R$ ${num.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const handleChange = (text: string) => {
        const rawValue = text.replace(/[^\d]/g, '');
        const numericValue = parseFloat(rawValue) / 100;

        setValue(numericValue);
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

    return (
        <Modal
            isVisible={props.isModalVisible}
            onBackdropPress={props.onClose}
            backdropOpacity={0.5}
            style={[base.justifyContentEnd, base.m_0]}
        >
            <View style={styles.modal}>
                <View style={styles.containerBtnActions}>
                    <TouchableOpacity onPress={props.onClose}>
                        <Text style={styles.cancel}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.save}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.containerValue}>
                    <Text style={styles.label}>Valor</Text>
                    <TextInput 
                        style={styles.value}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(value)}
                    />
                </View>
                <View style={[base.gap_5, base.mt_20]}>
                    {/* Descrição */}
                    <TextInput
                        style={styles.inputDesc}
                        placeholder="Descrição"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                    />
                    {/* Data */}
                    <TouchableOpacity style={[styles.input, base.gap_5]} onPress={handleDateClick}>
                        <FontAwesome5 name="calendar-alt" color={colors.gray_100} size={20} />
                        <Text style={styles.textBtnDate}>{formattedDate}</Text>
                    </TouchableOpacity>
                    {/* Categoria */}
                    <TouchableOpacity style={[styles.input, base.justifyContentSpaceBetween]} onPress={() => setIsCategoriesVisible(true)}>
                        <View style={styles.row}>
                            <MaterialIcons name="more-horiz" color={colors.gray_100} size={20} style={styles.icon}/>
                            <Text style={base.inputText}>Categorias</Text>
                        </View>
                        <MaterialIcons name="chevron-right" color={colors.gray_100} size={20} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                isVisible={isCalendarVisible}
                onBackdropPress={() => setIsCalendarVisible(false)}
                backdropOpacity={0.4}
                style={[base.alignItemsCenter, base.px_10]}
            >
                <View style={styles.calendarContainer}>
                    <Calendar
                        initialDate={selectedTempDate || selectedDate}
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
                            <Text style={styles.calendarText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSelectDate}>
                            <Text style={styles.calendarText}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                isVisible={isCategoriesVisible}
                onBackdropPress={() => setIsCategoriesVisible(false)}
                backdropOpacity={0.4}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={[styles.categoriesContainer]}>
                    <View style={[base.px_20]}>
                        <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.py_20, styles.line]}>
                            <View style={[styles.containerIcon, {backgroundColor: colors.gray_600}]}>
                                <FontAwesome5 name="search" color={colors.white} size={15}/>
                            </View>
                            <TextInput placeholder="Pesquisar categoria" placeholderTextColor={colors.gray_300} style={[styles.searchBar]}/>
                        </View>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {categoriesList.map((ctg) => {
                            return (
                                <TouchableOpacity key={ctg.id} style={[base.px_20]}>
                                    <View style={[base.flexRow, base.alignItemsCenter, base.gap_15, base.w_100, base.py_20]}>
                                        <View style={[styles.containerIcon, {backgroundColor: ctg.color}]}>
                                            <FontAwesome5 name={ctg.icon} color={colors.white} size={15}/>
                                        </View>
                                        <Text style={[styles.categorieName]}>{ctg.name}</Text>
                                    </View>
                                    <View style={[styles.line]}/>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            </Modal>
        </Modal>
    );
}

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
        borderRadius: 15,
        padding: 20,
    },
    containerBtnActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancel: {
        fontFamily: 'Outfit_500Medium',
        color: colors.orange_300,
        fontSize: 16
    },
    save: {
        fontFamily: 'Outfit_500Medium',
        color: colors.blue_400,
        fontSize: 16
    },
    containerValue: {
        marginTop: 25,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
    },
    value: {
        height: 40,
        fontSize: 28,
        color: colors.red_500,
        fontFamily: 'Outfit_600SemiBold',
    },
    input: {
        backgroundColor: colors.gray_800,
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderRadius: 12,
        marginTop: 15,
    },
    inputDesc: {
        backgroundColor: colors.gray_800,
        borderRadius: 12,
        textAlignVertical: 'top',
        padding: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
        height: 75,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    icon: {
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
        backgroundColor: colors.gray_800,
        height: '80%',
        width: '100%',
        borderRadius: 20
    },
    line: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray_600
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
    searchBar: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 15
    },
});

export default NewTransaction;