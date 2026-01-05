
import React from 'react';
import { ExpenseItem, Category, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SmartRulesProps {
  totalIncome: number;
  expenses: ExpenseItem[];
  language: Language;
}

export const SmartRules: React.FC<SmartRulesProps> = ({ totalIncome, expenses, language }) => {
  const t = TRANSLATIONS[language];
  const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
  const savingsAmount = expenses.filter(e => e.category === Category.Savings).reduce((sum, item) => sum + item.amount, 0);
  const emergencyAmount = expenses.filter(e => e.category === Category.EmergencyFund).reduce((sum, item) => sum + item.amount, 0);

  const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;

  const rules = [
    { 
      condition: totalExpenses > totalIncome, 
      type: 'danger', 
      message: `${t.budgetDeficit}: -Rp ${(totalExpenses - totalIncome).toLocaleString('id-ID')}` 
    },
    { 
      condition: totalIncome > 0 && savingsRate < 10, 
      type: 'warning', 
      message: `${t.savingsGoal}: ${language === 'en' ? 'Current rate is' : 'Rasio saat ini'} ${savingsRate.toFixed(1)}% (Target: 15%+)` 
    },
    { 
      condition: emergencyAmount === 0 && totalIncome > 0, 
      type: 'warning', 
      message: t.noEmergency 
    }
  ].filter(rule => rule.condition);

  if (rules.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {rules.map((rule, idx) => (
        <div key={idx} className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500 ${
          rule.type === 'danger' ? 'bg-red-50/50 border-red-200 text-red-600' : 'bg-amber-50/50 border-amber-200 text-amber-600'
        }`}>
          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
          {rule.message}
        </div>
      ))}
    </div>
  );
};
