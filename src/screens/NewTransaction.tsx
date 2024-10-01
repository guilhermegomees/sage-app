import { useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, TextInput } from "react-native";
import Modal from "react-native-modal";
import { Calendar, LocaleConfig } from "react-native-calendars";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

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
    const [isCategoriesVisible, setIsCategoriesVisible] = useState<boolean>(false)

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

        // Converter a data para o formato brasileiro 'DD/MM/YYYY' e exibir
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
            style={styles.containerModal}
        >
            <View style={[styles.modal]}>
                <View style={[styles.containerBtnActions]}>
                    <TouchableOpacity onPress={props.onClose}>
                        <Text style={[styles.cancel]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={[styles.save]}>Salvar</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.containerValue]}>
                    <Text style={[styles.text, { fontSize: 15, color: colors.gray_400 }]}>Valor</Text>
                    <TextInput 
                        style={styles.value}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(value)}
                    />
                </View>
                <View style={[base.gap_15, base.mt_20]}>
                    <TextInput
                        style={[styles.inputDesc, styles.input, { height: 75 }]}
                        placeholder="Descrição"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                    />
                    <View style={[styles.containerDate]}>
                        <TouchableOpacity style={[base.input, styles.input, base.justifyContentStart, base.gap_15]} onPress={handleDateClick}>
                            <FontAwesome5 name="calendar-alt" color={colors.gray_100} size={20} />
                            <Text style={styles.textBtnDate}>
                                {formattedDate}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[base.input, styles.input]} onPress={() => setIsCategoriesVisible(true)}>
                        <View style={[base.flexRow, base.alignItemsCenter, {gap: 12}]}>
                            <MaterialIcons name="more-horiz" color={colors.gray_100} size={25} />
                            <Text style={[base.inputText]}>Categorias</Text>
                        </View>
                        <MaterialIcons name="chevron-right" color={colors.gray_100} size={25} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                isVisible={isCalendarVisible}
                onBackdropPress={() => setIsCalendarVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.8}
                style={[base.alignItemsCenter, base.px_10]}
            >
                <View style={styles.calendarContainer}>
                    <Calendar
                        initialDate={selectedTempDate || selectedDate}
                        onDayPress={(day: any) => handleSelectTempDate(day.dateString)}
                        markedDates={{ [selectedTempDate]: { selected: true, selectedColor: colors.blue_300 } }}
                        style={{ borderRadius: 20, overflow: 'hidden' }}
                        hideExtraDays={true}
                        theme={{
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
                        }}
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
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.8}
                style={[base.justifyContentEnd]}
            >
                <View style={[{ backgroundColor: colors.gray_800, height: '60%', width: '100%' }]}>
                    <Text>Teste</Text>
                </View>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 25,
    },
    text: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 16,
    },
    iconUser: {
        width: 40,
        height: 40,
    },
    containerModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modal: {
        backgroundColor: colors.gray_875,
        flex: 0.91,
        borderRadius: 15,
        padding: 20,
    },
    containerBtnActions: {
        width: '100%',
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
        gap: 5,
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
    containerDate: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
    input: {
        backgroundColor: colors.gray_800,
    },
    inputDesc: {
        borderRadius: 12,
        textAlignVertical: 'top',
        padding: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    dateText: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    calendarContainer: {
        width: "100%",
        padding: 10,
        paddingBottom: 25,
        backgroundColor: colors.gray_800,
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    calendarText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: colors.blue_300,
    },
    btnDate: {
        backgroundColor: colors.gray_500,
        padding: 11,
        borderRadius: 20
    },
    textBtnDate: {
        fontSize: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
    },
})

export default NewTransaction;