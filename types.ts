
export enum Category {
  Savings = 'Savings',
  EmergencyFund = 'Emergency Fund',
  Investment = 'Investment',
  DailyExpenses = 'Daily Expenses',
  Lifestyle = 'Lifestyle'
}

export type Language = 'en' | 'id';

export interface IncomeState {
  salary: number;
  bonus: number;
  thr: number;
  sideProject: number;
}

export interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  isPaid: boolean;
  note: string;
  isRoutine: boolean;
}

export interface AssetItem {
  id: string;
  name: string;
  amount: number;
}

export interface MonthData {
  income: IncomeState;
  expenses: ExpenseItem[];
  assets: AssetItem[];
}

export interface AllocationStats {
  name: string;
  value: number;
  color: string;
}
