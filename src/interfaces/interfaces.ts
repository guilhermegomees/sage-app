export interface ITransaction {
    id: string;
    description: string;
    date: Date;
    category: ICategory;
    isExpense: boolean;
    source: number,
    value: number;
    account: number;
    user: string;
}

export interface ICategory {
    id: string;
    user: string;
    icon: string;
    name: string;
    color: string;
    context: number;
}

export interface IGoal {
    id: string;
    name: string;
    currentValue: number;
    goalValue: number;
    icon: any;
    isCompleted: boolean;
}