
import React from 'react';
import { Language } from '../types';

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  hasUnsavedChanges: boolean;
  language: Language;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange, hasUnsavedChanges, language }) => {
  const [year, month] = selectedPeriod.split('-');
  
  const monthsEN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthsID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const months = language === 'id' ? monthsID : monthsEN;

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  const handlePeriodChange = (newPeriod: string) => {
    if (hasUnsavedChanges) {
      const confirmMsg = language === 'en' 
        ? "Unsaved changes detected. Switch anyway? Data for this month will not be saved."
        : "Perubahan belum disimpan. Tetap pindah? Data bulan ini tidak akan tersimpan.";
      if (!confirm(confirmMsg)) {
        return;
      }
    }
    onPeriodChange(newPeriod);
  };

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-2xl border border-border/50">
      <select
        value={month}
        onChange={(e) => handlePeriodChange(`${year}-${e.target.value}`)}
        className="bg-transparent py-1.5 px-3 text-sm font-bold focus:outline-none cursor-pointer hover:bg-primary/5 rounded-xl transition-colors appearance-none text-center"
      >
        {months.map((m, i) => (
          <option key={m} value={(i + 1).toString().padStart(2, '0')} className="bg-background text-foreground">
            {m}
          </option>
        ))}
      </select>
      <div className="w-[1px] h-3 bg-muted-foreground/30 mx-0.5"></div>
      <select
        value={year}
        onChange={(e) => handlePeriodChange(`${e.target.value}-${month}`)}
        className="bg-transparent py-1.5 px-3 text-sm font-bold focus:outline-none cursor-pointer hover:bg-primary/5 rounded-xl transition-colors appearance-none text-center"
      >
        {years.map((y) => (
          <option key={y} value={y.toString()} className="bg-background text-foreground">
            {y}
          </option>
        ))}
      </select>
    </div>
  );
};
