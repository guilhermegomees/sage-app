export interface ITransaction {
    ID: number;
    DESCRIPTION: string;
    DATE: string;
    CATEGORY: string;
    ICON: string;
    IS_EXPENSE: number;
    VALUE: number;
    WALLET: number;
}

export type IRevenue = {
  id: string;
  label: string;
  value: number;
  color: string;
  date: string;
};