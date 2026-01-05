
import React, { useMemo } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ExpenseItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface DashboardProps {
  expenses: ExpenseItem[];
  totalIncome: number;
  language: Language;
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses, totalIncome, language }) => {
  const t = TRANSLATIONS[language];
  // Routine vs Temporary Data
  const routineVsTempData = useMemo(() => {
    const routine = expenses.filter(e => e.isRoutine).reduce((sum, e) => sum + e.amount, 0);
    const temporary = expenses.filter(e => !e.isRoutine).reduce((sum, e) => sum + e.amount, 0);
    const remaining = Math.max(0, totalIncome - (routine + temporary));

    return [
      {
        name: 'Spending Mix',
        routine: routine,
        temporary: temporary,
        savings: remaining
      }
    ];
  }, [expenses, totalIncome]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover/95 backdrop-blur-md border border-border p-3 rounded-xl shadow-2xl text-popover-foreground">
          <p className="text-xs font-bold opacity-60 mb-2">{payload[0].name || payload[0].dataKey}</p>
          <p className="font-bold text-sm text-money">Rp {payload[0].value.toLocaleString('id-ID')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        {/* Routine vs Discretionary Breakdown */}
        <Card className="border-none shadow-sm ring-1 ring-border rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-2 pt-8 px-10">
            <CardTitle className="text-xs font-bold text-muted-foreground">{t.spendingMix}</CardTitle>
            <p className="text-base font-bold mt-1 tracking-tight">{t.survivalBaseline}</p>
          </CardHeader>
          <CardContent className="pt-6 px-10 pb-10">
            <div className="h-[120px] w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  layout="vertical" 
                  data={routineVsTempData} 
                  margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle" 
                    iconSize={8}
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(v) => {
                      const label = v === 'routine' ? t.routineFixed : v === 'temporary' ? t.discretionary : t.remaining;
                      return <span className="text-xs font-bold text-muted-foreground/80 ml-1 mr-4">{label}</span>;
                    }} 
                  />
                  <Bar dataKey="routine" name="routine" stackId="a" fill="hsl(var(--primary))" radius={[8, 0, 0, 8]} barSize={44} />
                  <Bar dataKey="temporary" name="temporary" stackId="a" fill="hsl(var(--accent-foreground))" barSize={44} />
                  <Bar dataKey="savings" name="savings" stackId="a" fill="hsl(var(--muted))" radius={[0, 8, 8, 0]} barSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 pb-2">
               <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                     <span className="text-xs font-bold opacity-60">{t.routineFixed}</span>
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-money mb-1">Rp {routineVsTempData[0].routine.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground font-bold opacity-80">{t.fixedMonthly}</p>
               </div>
               
               <div className="p-6 rounded-3xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-all">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                     <span className="text-xs font-bold opacity-60">{t.discretionary}</span>
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-money mb-1">Rp {routineVsTempData[0].temporary.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-muted-foreground font-bold opacity-80">{t.variableSpending}</p>
               </div>
               
               <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/[0.08] transition-all">
                  <div className="flex items-center gap-2 mb-3">
                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                     <span className="text-xs font-bold text-emerald-600">{t.freeCashFlow}</span>
                  </div>
                  <p className="text-3xl font-black tracking-tighter text-emerald-600 text-money mb-1">Rp {routineVsTempData[0].savings.toLocaleString('id-ID')}</p>
                  <p className="text-xs text-emerald-600/70 font-bold">{t.unallocated}</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
