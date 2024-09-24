import { useState } from "react";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet, Platform, TextInput } from "react-native";
import Input from "~/components/Input";
import Overlay from "~/components/Overlay";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import base from "~/css/base";
import colors from "~/css/colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

const NewTransaction: React.FC<any> = (props) => {
    const [value, setValue] = useState<number>(0);
    const [descript, setDescript] = useState<string>();

    const getToday = () => { return new Date().toLocaleDateString('pt-BR'); };

    const [selectedDate, setSelectedDate] = useState<string>(getToday());
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

    const getYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toLocaleDateString('pt-BR');
    };

    // Função para definir a data atual
    const handleTodayPress = () => {
        setSelectedDate(getToday());
        setIsCalendarVisible(false)
    };

    // Função para definir a data de ontem
    const handleYesterdayPress = () => {
        setSelectedDate(getYesterday());
        setIsCalendarVisible(false)
    };

    // Função para selecionar a data no calendário
    const handleSelectDate = (date: string) => {
        const [year, month, day] = date.split("-");
        setSelectedDate(new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('pt-BR'));
        setIsCalendarVisible(false);
    };

    const handleDateClick = () => {
        setIsCalendarVisible(true);
    };

    return (
        <Modal
            isVisible={props.isModalVisible}
            onBackdropPress={props.onClose}
            swipeDirection="down"
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
                    <View style={[styles.containerDate]}>
                        <TouchableOpacity style={[base.input, styles.input, base.justifyContentStart, base.gap_15]} onPress={handleDateClick}>
                            <FontAwesome5 name="calendar-alt" color={colors.gray_100} size={20} />
                            <Text style={styles.textBtnDate}>
                                {selectedDate}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={[styles.inputDesc, styles.input, { height: 75 }]}
                        placeholder="Descrição"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                    />
                </View>
            </View>
            {/* Calendário */}
            {isCalendarVisible && (
                <View style={styles.calendarWindow}>
                    <View style={styles.calendarContainer}>
                        <TouchableOpacity style={[base.alignItemsEnd, base.w_100]} onPress={() => setIsCalendarVisible(false)}>
                            <MaterialIcons name="close" size={25}/>
                        </TouchableOpacity>
                        <Calendar
                            onDayPress={(day: any) => handleSelectDate(day.dateString)}
                            markedDates={{
                                [selectedDate]: { selected: true, selectedColor: 'blue' },
                            }}
                        />
                        <View style={[base.flexRow, base.justifyContentCenter, base.gap_10]}>
                            <TouchableOpacity
                                style={[styles.btnDate]}
                                onPress={handleTodayPress}
                            >
                                <Text style={[styles.textBtnDate]}>Hoje</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnDate]}
                                onPress={handleYesterdayPress}
                            >
                                <Text style={[styles.textBtnDate]}>Ontem</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        fontSize: 17,
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
    calendarWindow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo escuro para realçar a janela
    },
    calendarContainer: {
        width: Dimensions.get('window').width * 0.8,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    closeText: {
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
    },
    btnDate: {
        backgroundColor: colors.gray_500,
        padding: 11,
        borderRadius: 20
    },
    textBtnDate: {
        fontSize: 18,
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_100,
    },
})

export default NewTransaction;