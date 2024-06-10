export interface ITransaction {
    id: number;
    description: string;
    date: string;
    category?: string;
    icon: string;
    is_expense: number;
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