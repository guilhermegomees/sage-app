import { useState } from "react";
import { Dimensions, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import Input from "~/components/Input";
import Overlay from "~/components/Overlay";
import Modal from "react-native-modal";
import { Calendar } from "react-native-calendars";
import base from "~/css/base";
import colors from "~/css/colors";

const { width, height } = Dimensions.get('window');

const NewTransaction: React.FC<any> = (props) => {
    const [value, setValue] = useState<number>(0);
    const [descript, setDescript] = useState<string>();
    const [overlay, setOverley] = useState(false);

    const getToday = () => {
        return new Date().toLocaleDateString('pt-BR');
    };

    const [selectedDate, setSelectedDate] = useState<string>(getToday()); // Data selecionada
    const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false); // Controle da visibilidade da janela

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
    };

    // Função para definir a data de ontem
    const handleYesterdayPress = () => {
        setSelectedDate(getYesterday());
    };

    // Função para selecionar a data no calendário
    const handleSelectDate = (date: string) => {
        setSelectedDate(date);
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
            <View style={[base.w_100, base.justifyContentCenter, base.px_25, { position: 'absolute', top: 34 }]}>
                <View style={[styles.containerBack]} />
            </View>
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
                    <Input
                        style={styles.value}
                        textStyle={styles.value}
                        placeholder={'R$ 0.00'}
                        placeholderTextColor={colors.red_500}
                        keyboardType="numeric"
                        onChangeText={handleChange}
                        value={formatCurrency(value)}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                </View>
                <View style={[base.mt_15, base.gap_15]}>
                    <Input
                        style={[styles.input, { height: 70 }]}
                        placeholder="Descrição"
                        placeholderTextColor="#F8F1F1"
                        onChangeText={setDescript}
                        value={descript}
                        maxLength={25}
                        overlay={(value: boolean) => setOverley(value)}
                    />
                    {/* Botões de seleção */}
                    <Text style={[styles.text]}>Data Selecionada: {selectedDate}</Text>
                    <View style={[base.flexRow, base.gap_10]}>
                        <TouchableOpacity style={[styles.btnDate]} onPress={handleTodayPress}>
                            <Text style={[styles.textBtnDate]}>Hoje</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnDate]} onPress={handleYesterdayPress}>
                            <Text style={[styles.textBtnDate]}>Ontem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btnDate]} onPress={() => setIsCalendarVisible(true)}>
                            <Text style={[styles.textBtnDate]}>Selecionar data</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Janela do calendário */}
                    {isCalendarVisible && (
                        <View style={styles.calendarWindow}>
                            <View style={styles.calendarContainer}>
                                <Calendar
                                    onDayPress={(day: any) => handleSelectDate(day.dateString)}
                                    markedDates={{
                                        [selectedDate]: { selected: true, selectedColor: 'blue' },
                                    }}
                                />
                                <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                                    <Text style={styles.closeText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
            {overlay && <Overlay style={[styles.overlay]} />}
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
        flex: 0.94,
        borderRadius: 15,
        padding: 20
    },
    containerBack: {
        height: 30,
        backgroundColor: colors.gray_925,
        borderRadius: 20
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
        gap: 5
    },
    value: {
        height: 40,
        fontSize: 28,
        color: colors.red_500,
        fontFamily: 'Outfit_600SemiBold'
    },
    iconContainer: {
        marginLeft: 8,
    },
    input: {
        backgroundColor: colors.gray_800,
        borderRadius: 12,
        textAlignVertical: 'top',
        padding: 15,
        fontFamily: 'Outfit_500Medium',
        color: colors.white,
        fontSize: 15,
    },
    overlay: {
        width,
        height
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
        fontSize: 15,
        fontFamily: 'Outfit_400Regular',
        color: colors.gray_100,
        lineHeight: 16
    },
    btnSelected: {
        backgroundColor: colors.blue_600, // Cor diferente para o botão selecionado
    },
    selectedDateText: {
        fontSize: 18,
        color: colors.blue_600,
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
})

export default NewTransaction;