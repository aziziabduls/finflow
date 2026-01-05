
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { IncomeState, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface IncomeSectionProps {
  income: IncomeState;
  setIncome: (income: IncomeState) => void;
  language: Language;
}

export const IncomeSection: React.FC<IncomeSectionProps> = ({ income, setIncome, language }) => {
  const t = TRANSLATIONS[language];
  const formatDisplay = (val: number) => {
    if (val === 0) return '';
    return val.toLocaleString('id-ID');
  };

  const handleInputChange = (field: keyof IncomeState, rawValue: string) => {
    const numericValue = rawValue.replace(/[^0-9]/g, '');
    const numValue = parseInt(numericValue, 10) || 0;
    setIncome({ ...income, [field]: numValue });
  };

  const totalIncome = (Object.values(income) as number[]).reduce((acc, curr) => acc + curr, 0);

  const fields: { key: keyof IncomeState; label: string; icon: string }[] = [
    { key: 'salary', label: t.mainSalary, icon: '💼' },
    { key: 'bonus', label: t.bonus, icon: '✨' },
    { key: 'thr', label: t.thr, icon: '🎁' },
    { key: 'sideProject', label: t.freelance, icon: '🚀' },
  ];

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">{t.income}</h2>
          <p className="text-muted-foreground text-xs mt-1 font-bold">{t.inflows}</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-black text-money tracking-tighter">
            <span className="text-muted-foreground text-sm mr-1 font-bold">Rp</span>
            {totalIncome.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fields.map((field) => (
          <Card key={field.key} className="overflow-hidden border-none shadow-sm ring-1 ring-border rounded-2xl hover:shadow-md transition-shadow">
            <CardHeader className="p-4 border-b bg-muted/20 flex-row items-center gap-3 space-y-0">
               <span className="p-1.5 bg-primary/10 rounded-xl text-base">{field.icon}</span>
               <CardTitle className="text-xs font-bold text-muted-foreground/80">{field.label}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative flex items-center">
                <span className="text-muted-foreground font-black mr-2 text-sm">Rp</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatDisplay(income[field.key])}
                  onChange={(e) => handleInputChange(field.key, e.target.value)}
                  placeholder="0"
                  className="w-full bg-transparent focus:outline-none text-2xl font-black tracking-tighter text-money placeholder:text-muted/30"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
