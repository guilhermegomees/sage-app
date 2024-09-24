import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Dimensions, Modal, ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Bar } from 'react-native-progress';
import base from '~/css/base';
import colors from '~/css/colors';
import { IGoal } from '~/interfaces/interfaces';

export default function Goals() {
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [selectedGoal, setSelectedGoal] = useState<number | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [goalToDelete, setGoalToDelete] = useState<number | null>(null);
    
    const goalsData : IGoal[] = [{
        id: 1,
        name: "Viagem",
        currentValue: 6000,
        goalValue: 6000,
        icon: "airplanemode-active",
        isCompleted: false
    },{
        id: 2,
        name: "Comprar um carro",
        currentValue: 25000,
        goalValue: 30000,
        icon: "directions-car",
        isCompleted: false
    },{
        id: 3,
        name: "Reformar a casa",
        currentValue: 12200,
        goalValue: 20000,
        icon: "home",
        isCompleted: false
    },{
        id: 4,
        name: "Abrir um negócio",
        currentValue: 50000,
        goalValue: 100000,
        icon: "store",
        isCompleted: false
    },{
        id: 5,
        name: "Abrir um negócio",
        currentValue: 50000,
        goalValue: 100000,
        icon: "store",
        isCompleted: false
    }];

    // Filtra as metas com base no filtro selecionado
    const filteredGoals = goalsData.filter(goal => {
        if (filter === 'completed') return goal.currentValue >= goal.goalValue;
        if (filter === 'incomplete') return goal.currentValue < goal.goalValue;
        return true; // 'all' mostra todas as metas
    });

    const toggleTooltip = (id: number) => {
        if (selectedGoal === id) {
            setSelectedGoal(null); // Fecha a tooltip se já estiver aberta
        } else {
            setSelectedGoal(id); // Abre a tooltip para o item clicado
        }
    };

    const handleEdit = (id: number) => {
        console.log(`Editar meta com id: ${id}`);
        setSelectedGoal(null);
    };

    const handleDelete = (id: number) => {
        setGoalToDelete(id);
        setIsModalVisible(true);
        setSelectedGoal(null);
    };

    const confirmDelete = () => {
        if (goalToDelete !== null) {
            console.log(`Excluir meta com id: ${goalToDelete}`);
            setGoalToDelete(null);
            setIsModalVisible(false);
        }
    };

    const cancelDelete = () => {
        setGoalToDelete(null);
        setIsModalVisible(false);
    };

    return (
        <View style={[styles.container, base.flex_1]}>
            {/* <View style={[styles.containerTitle]}>
                <Text style={[styles.title]}>Metas</Text>
            </View> */}
            {/* Menu de Filtros */}
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filter, filter === 'all' && styles.activeFilter]}>
                    <Text style={[styles.filterText]}>Geral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('completed')} style={[styles.filter, filter === 'completed' && styles.activeFilter]}>
                    <Text style={[styles.filterText]}>Alcançadas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('incomplete')} style={[styles.filter, filter === 'incomplete' && styles.activeFilter]}>
                    <Text style={[styles.filterText]}>Pendentes</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
            >
                {filteredGoals.map((goal) => {
                    const progress = goal.currentValue / goal.goalValue;
                    const percentage = (progress * 100).toFixed(0);

                    return (
                        <View key={goal.id} style={styles.goalContainer}>
                            <View style={[styles.infoContainer]}>
                                <View style={[base.flexRow, base.gap_13, base.alignItemsCenter]}>
                                    <View style={[styles.icon]}>
                                        <MaterialIcons
                                            name={goal.icon}
                                            size={28}
                                            color={colors.gray_900}
                                        />
                                    </View>
                                    <Text style={styles.text}>{goal.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => toggleTooltip(goal.id)} style={{marginBottom: 5}}>
                                    <MaterialIcons
                                        name="more-vert"
                                        size={19}
                                        color={colors.gray_300}
                                    />
                                </TouchableOpacity>
                                {selectedGoal === goal.id && (
                                    <View style={styles.tooltip}>
                                        <TouchableOpacity onPress={() => handleEdit(goal.id)} style={styles.tooltipOption}>
                                            <Text style={styles.tooltipText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => handleDelete(goal.id)} style={styles.tooltipOption}>
                                            <Text style={styles.tooltipText}>Excluir</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                            <View style={[base.gap_8]}>
                                <View style={[styles.progressContainer]}>
                                    <Bar
                                        progress={progress}
                                        width={Dimensions.get('window').width * 0.9 - 15}
                                        height={18}
                                        unfilledColor={colors.gray_750}
                                        borderWidth={0}
                                        borderRadius={20}
                                        color={colors.blue_600}
                                        animated={true}
                                    />
                                    <View style={styles.percentageContainer}>
                                        <Text style={styles.textPercentage}>
                                            {percentage}%
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.textValue}>
                                    R$ {goal.currentValue.toLocaleString('pt-BR')} de R$ {goal.goalValue.toLocaleString('pt-BR')}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
            <TouchableOpacity style={styles.fabButton} onPress={() => console.log('Adicionar nova meta')}>
                <MaterialIcons name="add" size={28} color={colors.gray_50} />
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={cancelDelete}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Deseja realmente apagar essa meta?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
                                <Text style={styles.modalButtonText}>Sim</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={cancelDelete}>
                                <Text style={styles.modalButtonText}>Não</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.gray_900,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    containerTitle: {
        marginTop: 5,
        marginBottom: 20,
    },
    title: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 20,
        marginLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: colors.gray_800,
        borderRadius: 50,
    },
    filter: {
        borderRadius: 50,
        padding: 15,
        width: 115,
        alignItems: 'center'
    },
    filterText: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_200,
        fontSize: 14,
    },
    activeFilter: {
        backgroundColor: colors.blue_600
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        gap: 20,
        paddingBottom: 80
    },
    goalContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 20,
        backgroundColor: colors.gray_800,
        width: '100%'
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    text: {
        fontFamily: 'Outfit_600SemiBold',
        color: colors.gray_50,
        fontSize: 15,
    },
    textBtn: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 14,
    },
    textValue: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_200,
        fontSize: 14,
        width: '100%'
    },
    icon: {
        borderRadius: 40,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.blue_600
    },
    progressContainer: {
        position: 'relative',
        justifyContent: 'center',
    },
    percentageContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10,
    },
    textPercentage: {
        fontFamily: 'Outfit_500Medium',
        color: colors.gray_50,
        fontSize: 12,
    },
    tooltip: {
        position: 'absolute',
        right: 0,
        top: 30,
        backgroundColor: colors.gray_700,
        borderRadius: 8,
        paddingVertical: 5,
        width: 100,
        zIndex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    tooltipOption: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    tooltipText: {
        color: colors.gray_200,
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.gray_800,
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'flex-start'
    },
    modalText: {
        color: colors.gray_50,
        fontSize: 14,
        fontFamily: 'Outfit_600SemiBold',
        marginBottom: 20,
        textAlign: 'center'
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 15,
        justifyContent: 'flex-end',
        width: '100%',
    },
    modalButton: {
        backgroundColor: colors.blue_600,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    modalButtonText: {
        color: colors.gray_50,
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 12,
    },
    fabButton: {
        position: 'absolute',
        bottom: 90,
        right: 10,
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
});
