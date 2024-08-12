export interface ITransaction {
    id: number;
    description: string;
    date: string;
    category?: string;
    icon: string;
    isExpense: number;
    value: number;
    wallet: number;
}

export interface IGoal {
    id: number;
    name: string;
    currentValue: number;
    goalValue: number;
    icon: any;
    isCompleted: boolean;
}