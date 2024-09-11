export interface ITransaction {
    id: number;
    description: string;
    date: string;
    category?: ICategory;
    icon: string;
    isExpense: number;
    value: number;
    wallet: number;
}

export interface ICategory {
    id: number;
    user: string;
    icon: string;
    name: string;
    color: string;
}

export interface IGoal {
    id: number;
    name: string;
    currentValue: number;
    goalValue: number;
    icon: any;
    isCompleted: boolean;
}