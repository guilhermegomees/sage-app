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

export type IRevenue = {
  id: string;
  label: string;
  value: number;
  color: string;
  date: string;
};