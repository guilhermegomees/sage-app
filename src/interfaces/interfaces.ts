export interface ITransaction {
    id?: string;
    description: string;
    date: Date;
    category: ICategory | any;
    isExpense: boolean;
    source: number,
    value: number;
    account?: string;
    creditCard?: string;
    uid: string;
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
    initialValue: number;
    goalValue: number;
    currentValue: number;
    icon: string;
    color: string;
    isCompleted: boolean;
    endDate: string;
}

export interface IUser {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
}

export interface IAccount {
    id: string;
    uid: string;
    name: string;
    bankName: string;
    balance: number;
    includeInSum: boolean;
}

export interface ICreditCard {
    id: string;
    uid: string;
    name: string;
    bankName: string;
    limit: number;
    availableLimit: number;
    closingDay: number;
    dueDay: number;
    invoices: IInvoice[];
}

export interface IInvoice {
    id: string;
    isPaid: boolean;
    month: string;
    totalAmount: number;
    paymentDate: Date | null;
}