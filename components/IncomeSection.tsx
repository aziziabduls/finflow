
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { IncomeState, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Briefcase, Sparkles, Gift, Rocket, Check } from 'lucide-react';

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

  const fields: { key: keyof IncomeState; label: string; icon: any }[] = [
    { key: 'salary', label: t.mainSalary, icon: Briefcase },
    { key: 'bonus', label: t.bonus, icon: Sparkles },
    { key: 'thr', label: t.thr, icon: Gift },
    { key: 'sideProject', label: t.freelance, icon: Rocket },
  ];

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">{t.income}</h2>
          <p className="text-muted-foreground text-sm mt-1 font-bold opacity-80 tracking-tight">{t.inflows}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-4xl sm:text-6xl font-black text-foreground tracking-tighter transition-all flex items-baseline gap-2">
            <span className="text-muted-foreground text-xl font-extrabold opacity-40">Rp</span>
            {totalIncome.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {fields.map((field) => {
          const hasValue = income[field.key] > 0;
          const Icon = field.icon;

          return (
            <Card 
              key={field.key} 
              className={`relative overflow-hidden border transition-all duration-500 group cursor-text rounded-[2rem]
                ${hasValue 
                  ? 'border-zinc-200 bg-background shadow-[0_20px_50px_rgba(0,0,0,0.04)]' 
                  : 'border-zinc-100 bg-zinc-50/50 ring-1 ring-black/[0.01] shadow-sm opacity-95'
                }
                focus-within:ring-8 focus-within:ring-primary/5 focus-within:border-zinc-400 focus-within:-translate-y-1
              `}
              onClick={() => {
                const input = document.getElementById(`input-${field.key}`);
                input?.focus();
              }}
            >
              <CardHeader className="p-6 pb-5 flex-row items-center justify-between space-y-0">
                 <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-[1.15rem] transition-all duration-500 shadow-xl ${hasValue ? 'bg-zinc-900 text-white shadow-zinc-900/30' : 'bg-white text-zinc-300 shadow-sm border border-zinc-100'}`}>
                        <Icon className="h-5 w-5 stroke-[2.5]" />
                    </div>
                    <CardTitle className={`text-[14px] font-black tracking-tight transition-colors ${hasValue ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {field.label}
                    </CardTitle>
                 </div>
                 
                 <div className={`transition-all duration-500 rounded-full h-2.5 w-2.5 ${hasValue ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'bg-zinc-200'}`} />
              </CardHeader>

              <div className="mx-6 border-t border-zinc-100" />

              <CardContent className="p-6 pt-7">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor={`input-${field.key}`} className={`text-[11px] font-black tracking-tight transition-colors ${hasValue ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      Entry Amount
                    </label>
                    {hasValue && (
                       <span className="text-[11px] font-black text-emerald-600 animate-in fade-in slide-in-from-right-2">Active</span>
                    )}
                  </div>
                  
                  <div className="relative flex items-center justify-between min-h-[44px]">
                    <div className="flex items-center w-full group-focus-within:scale-[1.01] transition-transform origin-left">
                      <span className={`transition-all duration-300 font-black mr-2 text-xl ${hasValue ? 'text-zinc-900' : 'text-zinc-300'}`}>
                        Rp
                      </span>
                      <input
                        id={`input-${field.key}`}
                        type="text"
                        inputMode="numeric"
                        value={formatDisplay(income[field.key])}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder="0,00"
                        className={`w-full bg-transparent focus:outline-none text-2xl font-black tracking-tighter transition-colors placeholder:text-zinc-200 selection:bg-zinc-900 selection:text-white ${hasValue ? 'text-zinc-950' : 'text-zinc-300'}`}
                      />
                    </div>
                    
                    {hasValue && (
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 animate-in zoom-in duration-500 shadow-sm border border-emerald-100">
                        <Check className="h-3.5 w-3.5 stroke-[4]" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
