
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ExpenseItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { GitCompare, PlusCircle, MinusCircle, RefreshCcw, TrendingUp, TrendingDown } from 'lucide-react';

interface ComparisonDiffProps {
  currentExpenses: ExpenseItem[];
  previousExpenses: ExpenseItem[];
  language: Language;
}

export const ComparisonDiff: React.FC<ComparisonDiffProps> = ({ currentExpenses, previousExpenses, language }) => {
  const t = TRANSLATIONS[language];

  // Logic to calculate diff
  const added = currentExpenses.filter(curr => !previousExpenses.find(prev => prev.id === curr.id || (prev.name === curr.name && prev.category === curr.category)));
  const removed = previousExpenses.filter(prev => !currentExpenses.find(curr => curr.id === prev.id || (curr.name === prev.name && curr.category === prev.category)));
  
  const modified = currentExpenses.filter(curr => {
    const prev = previousExpenses.find(p => p.id === curr.id || (p.name === curr.name && p.category === curr.category));
    return prev && prev.amount !== curr.amount;
  }).map(curr => {
    const prev = previousExpenses.find(p => p.id === curr.id || (p.name === curr.name && p.category === curr.category))!;
    return {
      ...curr,
      oldAmount: prev.amount,
      delta: curr.amount - prev.amount
    };
  });

  const totalDelta = added.reduce((s, i) => s + i.amount, 0) - removed.reduce((s, i) => s + i.amount, 0) + modified.reduce((s, i) => s + i.delta, 0);

  const hasChanges = added.length > 0 || removed.length > 0 || modified.length > 0;

  if (!hasChanges) {
    return (
      <Card className="rounded-[2rem] border-dashed bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <GitCompare className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-bold italic">{t.noChanges}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2rem] border-primary/20 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <CardHeader className="bg-primary/[0.02] border-b border-primary/5 px-8 pt-10 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg">
              <GitCompare className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight">{t.comparisonTitle}</CardTitle>
              <p className="text-xs text-muted-foreground font-bold opacity-70 mt-1">{t.comparisonDesc}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-1">{t.delta}</p>
             <div className={`flex items-baseline gap-1 text-2xl font-black tracking-tighter ${totalDelta > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                {totalDelta > 0 ? '+' : ''}Rp {totalDelta.toLocaleString('id-ID')}
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/5">
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-wider">{t.type}</TableHead>
              <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-wider">{t.item}</TableHead>
              <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-wider text-right">{t.amount}</TableHead>
              <TableHead className="px-8 h-14 font-bold text-xs uppercase tracking-wider text-right">{t.delta}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {added.map(item => (
              <TableRow key={item.id} className="bg-emerald-500/[0.04] border-b hover:bg-emerald-500/[0.08] transition-colors">
                <TableCell className="px-8 py-6">
                  <Badge className="bg-emerald-500 text-white border-none rounded-lg h-7 font-bold text-[10px] uppercase gap-1.5">
                    <PlusCircle className="h-3 w-3" /> {t.added}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-6 font-bold text-[15px]">{item.name}</TableCell>
                <TableCell className="px-8 py-6 text-right font-black text-money">Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                <TableCell className="px-8 py-6 text-right font-black text-emerald-600">
                  <div className="flex items-center justify-end gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +Rp {item.amount.toLocaleString('id-ID')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {modified.map(item => (
              <TableRow key={item.id} className="bg-indigo-500/[0.02] border-b hover:bg-indigo-500/[0.05] transition-colors">
                <TableCell className="px-8 py-6">
                  <Badge className="bg-indigo-500 text-white border-none rounded-lg h-7 font-bold text-[10px] uppercase gap-1.5">
                    <RefreshCcw className="h-3 w-3" /> {t.modified}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-6">
                  <p className="font-bold text-[15px]">{item.name}</p>
                  <p className="text-[10px] font-bold text-muted-foreground">was Rp {item.oldAmount.toLocaleString('id-ID')}</p>
                </TableCell>
                <TableCell className="px-8 py-6 text-right font-black text-money">Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                <TableCell className={`px-8 py-6 text-right font-black ${item.delta > 0 ? 'text-destructive' : 'text-emerald-600'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {item.delta > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {item.delta > 0 ? '+' : ''}Rp {item.delta.toLocaleString('id-ID')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {removed.map(item => (
              <TableRow key={item.id} className="bg-destructive/[0.04] border-b hover:bg-destructive/[0.08] transition-colors">
                <TableCell className="px-8 py-6">
                  <Badge className="bg-destructive text-white border-none rounded-lg h-7 font-bold text-[10px] uppercase gap-1.5">
                    <MinusCircle className="h-3 w-3" /> {t.removed}
                  </Badge>
                </TableCell>
                <TableCell className="px-8 py-6 font-bold text-[15px] opacity-60 italic">{item.name}</TableCell>
                <TableCell className="px-8 py-6 text-right font-black text-money opacity-60 italic">Rp {item.amount.toLocaleString('id-ID')}</TableCell>
                <TableCell className="px-8 py-6 text-right font-black text-destructive">
                  <div className="flex items-center justify-end gap-1">
                    <TrendingDown className="h-3 w-3" />
                    -Rp {item.amount.toLocaleString('id-ID')}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
