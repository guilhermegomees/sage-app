import React, { useState, useEffect } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { Bar } from 'react-native-progress';
import base from '~/css/base';
import colors from '~/css/colors';
import { db } from "~/config/firebase";
import { collection, addDoc, doc, updateDoc, deleteDoc, getDocs, setDoc, getDoc } from 'firebase/firestore';
import OptionsModal from '~/components/OptionsModal';
import { useGoals } from '~/context/GoalContext';
import { IGoal } from '~/interfaces/interfaces';
import ConfirmationModal from '~/components/ConfirmationModal';
import useUser from '~/hooks/useUser';
import GoalModal from '~/components/GoalModal';
import NoData from '~/components/NoData';
import Modal from "react-native-modal";
import Input from '~/components/Input';

export default function Goals() {
    const user = useUser();
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [selectedGoal, setSelectedGoal] = useState<IGoal | null>(null);
    const [isNewGoalVisible, setIsNewGoalVisible] = useState(false);
    const [isOptionsModalVisible, setIsOptionsModalVisible] = useState<boolean>(false);

    const [name, setName] = useState<string | null>(null);
    const [goalValue, setGoalValue] = useState<number | null>(null);
    const [initialValue, setInitialValue] = useState<number | null>(null);
    const [icon, setIcon] = useState<string>('guitar');
    const [color, setColor] = useState<string>('#FF6347');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] = useState(false);

    const [isIconModalVisible, setIsIconModalVisible] = useState(false);
    const [isColorModalVisible, setIsColorModalVisible] = useState(false);

    const [endDate, setEndDate] = useState<string>('');
    const [tempEndDate, setTempEndDate] = useState<string>('');
    const [formattedDate, setFormattedDate] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const [isDepositModalVisible, setIsDepositModalVisible] = useState<boolean>(false);
    const [currentDepositValue, setCurrentDepositValue] = useState<number | null>(null);

    const goalCollectionRef = collection(db, "goal");

    const { goals, fetchGoals } = useGoals();

    useEffect(() => {
        if(user){
            fetchGoals(user);
        }
    }, [user]);

    const filteredGoals = goals.filter(goal => {
        if (filter === 'completed') return goal.isCompleted;
        if (filter === 'incomplete') return !goal.isCompleted;
        return true;
    });

    const handleEditGoal = () => {
        if (selectedGoal) {
            setName(selectedGoal.name);
            setIcon(selectedGoal.icon);
            setColor(selectedGoal.color);
            setGoalValue(selectedGoal.goalValue);
            setInitialValue(selectedGoal.initialValue);
            setEndDate(selectedGoal.endDate);
            setFormattedDate(formatDate(selectedGoal.endDate));
            setIsNewGoalVisible(true);
            setIsEditing(true);
            setIsOptionsModalVisible(false);
        }
    };

    const formatDate = (date: string) => {
        const [year, month, day] = date.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString('pt-BR');
    }

    const deleteGoal = async () => {
        if (user && selectedGoal) {
            try {
                const goalDocRef = doc(db, "goal", selectedGoal.id);
                await deleteDoc(goalDocRef);

                await fetchGoals(user);
                handleCloseAndReset();
                setIsDeleteConfirmModalVisible(false);
            } catch (error) {
                console.error("Erro ao deletar meta: ", error);
            }
        }
    };

    const confirmDeleteGoal = () => {
        setIsDeleteConfirmModalVisible(true);
        setIsOptionsModalVisible(false);
    };

    const saveGoal = async (): Promise<void> => {
        if (!name || !icon || !goalValue || !endDate) {
            alert("Por favor, preencha todos os campos antes de continuar.");
            return;
        }

        if(initialValue && goalValue){
            if(initialValue > goalValue){
                alert("O valor inicial não pode ser maior que o valor da meta!");
                return;
            }
        }
    
        try {
            if (user) {
                const goal = {
                    uid: user.uid,
                    name: name,
                    icon: icon,
                    color: color,
                    goalValue: goalValue,
                    initialValue: initialValue,
                    endDate: endDate,
                    isCompleted: initialValue == goalValue,
                    currentValue: 0
                };
    
                if (isEditing && selectedGoal) {
                    // Atualizar meta existente
                    const goalDocRef = doc(db, "goal", selectedGoal.id);
                    await setDoc(goalDocRef, goal);
                } else {
                    // Criar nova meta
                    await addDoc(goalCollectionRef, goal);
                }
    
                await fetchGoals(user);
                handleCloseAndReset();
            }
        } catch (error) {
            console.error("Erro ao salvar conta: ", error);
        }
    };

    const handleCloseAndReset = (): void => {
        setIsNewGoalVisible(false);
        setIsEditing(false);
        setSelectedGoal(null);
        resetStates();
    };

    const resetStates = () => {
        setName(null);
        setIcon('guitar');
        setColor('#FF6347');
        setGoalValue(null);
        setInitialValue(null);
        setEndDate('');
        setTempEndDate('');
        setFormattedDate('');
    }

    const handleSelectTempDate = (date: string): void => setTempEndDate(date);

    const handleSelectDate = (): void => {
        setEndDate(tempEndDate);
        setFormattedDate(formatDate(tempEndDate));
        setIsCalendarVisible(false);
    };

    const handleCancelCalendar = (): void => {
        setTempEndDate(endDate);
        setIsCalendarVisible(false);
    };

    const daysUntilTargetDate = (targetDate: string): string => {
        const currentDate = new Date();
        const target = new Date(targetDate);
        target.setHours(target.getHours() + 3);
    
        // Ajusta a data target para o horário local, eliminando o deslocamento UTC
        const targetLocal = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    
        // Calcula a diferença em milissegundos e converte para dias
        const differenceInTime = targetLocal.getTime() - currentDate.setHours(0, 0, 0, 0);
        const differenceInDays = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
    
        // Formata a data de vencimento no estilo desejado (e.g., "05 de nov de 2024")
        const formattedDate = targetLocal.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).replace('.', ''); // Remove ponto final do mês
        
        // Retorna o texto apropriado com base na diferença de dias
        if (differenceInDays > 0) {
            return `Restam: ${differenceInDays} ${differenceInDays === 1 ? 'dia' : 'dias'}`;
        } else {
            return `Venceu em: ${formattedDate}`;
        }
    };

    const formatValueInput = (value: any) => {
        if (!value) return '';

        const parsedValue = parseFloat(value.toString().replace(/[^0-9]/g, ''));
        return `R$ ${!isNaN(parsedValue) ? parsedValue.toLocaleString('pt-BR') : ''}`;
    };

    const addDeposit = async () => {
        try {
            if (selectedGoal && currentDepositValue && user) {
                const documentRef = doc(db, "goal", selectedGoal.id);
                const docSnapshot = await getDoc(documentRef);
        
                if (docSnapshot.exists()) {
                    const documentData = docSnapshot.data();
                    const { initialValue, goalValue, currentValue = 0 } = documentData;

                    // Soma o depósito ao valor atual
                    let newCurrentValue = currentValue + currentDepositValue;

                    if((newCurrentValue + initialValue) > goalValue){
                        newCurrentValue = goalValue - initialValue;
                    }

                    // Calcula se a meta foi atingida ou ultrapassada
                    const isCompleted = newCurrentValue >= goalValue || (newCurrentValue + initialValue) >= goalValue;

                    // Atualiza o documento com newCurrentValue e, se aplicável, isCompleted
                    await updateDoc(documentRef, {
                        currentValue: newCurrentValue,
                        ...(isCompleted && { isCompleted: true })
                    });
                    await fetchGoals(user);
                    setIsDepositModalVisible(false);
                    setCurrentDepositValue(null);
                }
            }
        } catch (error) {
            console.error("Erro ao fazer depósito:", error);
        }
    }

    return (
        <View style={[styles.container, base.flex_1]}>
            <View style={styles.filterContainer}>
                <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filter, filter === 'all' && styles.activeFilter]}>
                    <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>Geral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('completed')} style={[styles.filter, filter === 'completed' && styles.activeFilter]}>
                    <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>Alcançadas</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilter('incomplete')} style={[styles.filter, filter === 'incomplete' && styles.activeFilter]}>
                    <Text style={[styles.filterText, filter === 'incomplete' && styles.activeFilterText]}>Pendentes</Text>
                </TouchableOpacity>
            </View>
            {filteredGoals.length >= 1 ?
                <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {filteredGoals.map((goal) => {
                        if(!goal.initialValue) goal.initialValue = 0;
                        if(!goal?.currentValue) goal.currentValue = 0;
                        
                        const currentValue = goal.initialValue + goal.currentValue;
                        const progress = currentValue / goal.goalValue;
                        const percentage = (progress * 100).toFixed(0);
                        const daysRemaining = daysUntilTargetDate(goal.endDate);

                        return (
                            <TouchableOpacity key={goal.id} onPress={() => {
                                setIsOptionsModalVisible(true);
                                setSelectedGoal(goal);
                            }}>
                                <View style={styles.goalContainer}>
                                    <View style={[base.flexRow, base.gap_13, base.alignItemsCenter]}>
                                        <View style={[styles.icon, {backgroundColor: goal.color}]}>
                                            <FontAwesome6 name={goal.icon} size={20} color={colors.gray_100} />
                                        </View>
                                        <Text style={styles.text}>{goal.name}</Text>
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
                                                color={goal.color}
                                                animated={true}
                                            />
                                            <View style={styles.percentageContainer}>
                                                <Text style={styles.textPercentage}>{percentage}%</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.textValue}>R$ {currentValue.toLocaleString('pt-br')} de R$ {goal.goalValue.toLocaleString('pt-br')}</Text>
                                        <Text style={styles.textValue}>{daysRemaining}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView> : 
                <NoData
                    title="Nenhuma meta encontrada"
                    subTitle="Clique no botão abaixo para adicionar sua primeira meta e começar a alcançar seus objetivos!"
                    buttonText="Adicionar meta"
                    buttonAction={() => {setIsNewGoalVisible(true); setIsEditing(false)}}
                />
            }
            {filteredGoals.length >= 1 && (
                <TouchableOpacity style={styles.floatingButton} onPress={() => {setIsNewGoalVisible(true); setIsEditing(false)}}>
                    <FontAwesome6 name="plus" size={22} color={colors.gray_50} />
                </TouchableOpacity>
            )}
            <GoalModal
                isVisible={isNewGoalVisible}
                name={name}
                icon={icon}
                color={color}
                goalValue={goalValue}
                initialValue={initialValue}
                endDate={endDate}
                tempEndDate={tempEndDate}
                formattedDate={formattedDate}
                setName={setName}
                setIcon={setIcon}
                setColor={setColor}
                setGoalValue={setGoalValue}
                setInitialValue={setInitialValue}
                onClose={() => {
                    setIsNewGoalVisible(false);
                    resetStates();
                }}
                onSave={saveGoal}
                isIconPickerVisible={isIconModalVisible}
                isColorPickerVisible={isColorModalVisible}
                setIsIconPickerVisible={setIsIconModalVisible}
                setIsColorPickerVisible={setIsColorModalVisible}
                isCalendarVisible={isCalendarVisible}
                setIsCalendarVisible={() => setIsCalendarVisible(true)}
                handleSelectDate={handleSelectDate}
                handleSelectTempDate={handleSelectTempDate}
                handleCancelCalendar={handleCancelCalendar}
            />
            <OptionsModal
                isVisible={isOptionsModalVisible}
                onClose={() => setIsOptionsModalVisible(false)}
                options={[
                    { label: 'Adicionar depósito', icon: 'money-bill', color: colors.gray_100, disabled: selectedGoal?.isCompleted, onPress: () => { setIsDepositModalVisible(true) } },
                    { label: 'Editar meta', icon: 'pencil', color: colors.gray_100, onPress: handleEditGoal },
                    { label: 'Excluir meta', icon: 'trash', color: colors.red_500, onPress: confirmDeleteGoal }
                ]}
            />
            <ConfirmationModal
                isVisible={isDeleteConfirmModalVisible}
                onClose={() => setIsDeleteConfirmModalVisible(false)}
                onConfirm={deleteGoal}
                confirmationText="Tem certeza que deseja excluir esta meta?"
                cancelText="Cancelar"
                confirmText="Confirmar"
            />
            <Modal
                isVisible={isDepositModalVisible}
                onBackdropPress={() => { setIsDepositModalVisible(false); setCurrentDepositValue(null); }}
                backdropOpacity={0.5}
                style={[base.justifyContentEnd, base.m_0]}
            >
                <View style={styles.containerModalAddDeposit}>
                    <Text style={styles.modalTitle}>Adicionar depósito</Text>
                    <View style={[base.gap_30]}>
                        <Input
                            styleInput={[base.input, { backgroundColor: colors.gray_800 }]}
                            keyboardType="numeric"
                            placeholder="R$ 0,00"
                            placeholderTextColor={colors.gray_400}
                            onChangeText={(value: string) => { setCurrentDepositValue(parseInt(value.replace(/[^\d]/g, ''))); }}
                            value={formatValueInput(currentDepositValue)}
                            maxLength={14}
                        />
                        <TouchableOpacity style={[base.button, base.btnSave, base.w_100, base.mt_5]} onPress={addDeposit}>
                            <Text style={[base.btnText]}>Salvar</Text>
                        </TouchableOpacity>
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
        fontSize: 16,
    },
    activeFilter: {
        backgroundColor: colors.blue_600
    },
    activeFilterText: {
        color: colors.gray_100
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        gap: 20,
        paddingBottom: 80
    },
    goalContainer: {
        flexDirection: 'column',
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
        padding: 8,
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
    floatingButton: {
        position: 'absolute',
        bottom: 80,
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
    containerModalAddDeposit: {
        backgroundColor: colors.gray_900,
        padding: 30,
        gap: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 22,
        color: colors.gray_100,
        width: '100%',
        borderBottomColor: colors.gray_700,
        borderBottomWidth: 1,
        paddingBottom: 20
    },
});
