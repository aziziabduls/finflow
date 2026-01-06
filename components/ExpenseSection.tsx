
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ResponsiveDialog } from './ResponsiveDialog';
import { ExpenseItem, Category, Language } from '../types';
import { TRANSLATIONS, getCategoryColor } from '../constants';
import { Plus, Trash2, CheckCircle2, PencilLine, RefreshCcw, Zap } from 'lucide-react';

interface ExpenseSectionProps {
  expenses: ExpenseItem[];
  setExpenses: (expenses: ExpenseItem[]) => void;
  language: Language;
}

export const ExpenseSection: React.FC<ExpenseSectionProps> = ({ expenses, setExpenses, language }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<string>(Category.DailyExpenses);
  const [isRoutine, setIsRoutine] = useState(true);

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setAmount(editingItem.amount.toString());
      setNote(editingItem.note);
      setCategory(editingItem.category);
      setIsRoutine(editingItem.isRoutine ?? true);
    } else {
      setName('');
      setAmount('');
      setNote('');
      setCategory(Category.DailyExpenses);
      setIsRoutine(true);
    }
  }, [editingItem, isOpen]);

  const formatDisplay = (val: string | number) => {
    if (val === '' || val === 0) return '';
    const num = typeof val === 'string' ? parseInt(val.replace(/[^0-9]/g, ''), 10) : val;
    if (isNaN(num)) return '';
    return num.toLocaleString('id-ID');
  };

  const handleSave = () => {
    if (!name || !amount || !category) return;
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

    if (editingItem) {
      setExpenses(expenses.map(e => e.id === editingItem.id ? {
        ...e,
        name,
        amount: numericAmount,
        note,
        category: category.trim(),
        isRoutine
      } : e));
    } else {
      setExpenses([...expenses, {
        id: Math.random().toString(36).substr(2, 9),
        name,
        amount: numericAmount,
        category: category.trim(),
        isPaid: false,
        note,
        isRoutine
      }]);
    }
    setIsOpen(false);
    setEditingItem(null);
  };

  const onRemove = (id: string) => setExpenses(expenses.filter(e => e.id !== id));
  const onTogglePaid = (id: string) => 
    setExpenses(expenses.map(e => e.id === id ? { ...e, isPaid: !e.isPaid } : e));

  const routineCount = expenses.filter(e => e.isRoutine).length;

  const quickCategories = Object.values(Category);

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">{t.allocations}</h2>
          <p className="text-muted-foreground text-sm mt-1 font-bold opacity-80 tracking-tight">
            {routineCount} {t.routineItems}
          </p>
        </div>
        <Button size="sm" onClick={() => { setEditingItem(null); setIsOpen(true); }} className="gap-2 rounded-xl h-10 px-6 font-bold shadow-sm">
          <Plus className="h-4 w-4" /> {t.newEntry}
        </Button>
      </div>

      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={editingItem ? t.editAllocation : t.addAllocation}
        description={t.routineDesc}
      >
        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-2 gap-3 p-1 bg-muted/30 rounded-2xl">
            <Button
              type="button"
              variant={isRoutine ? 'default' : 'ghost'}
              className={`gap-2 rounded-xl h-12 font-bold ${isRoutine ? 'shadow-lg' : ''}`}
              onClick={() => setIsRoutine(true)}
            >
              <RefreshCcw className="h-4 w-4" /> {t.routine}
            </Button>
            <Button
              type="button"
              variant={!isRoutine ? 'default' : 'ghost'}
              className={`gap-2 rounded-xl h-12 font-bold ${!isRoutine ? 'shadow-lg' : ''}`}
              onClick={() => setIsRoutine(false)}
            >
              <Zap className="h-4 w-4" /> {t.temporary}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.itemName}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rent, Internet, Spotify..." className="h-12 rounded-xl border-2 focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.amount}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-black">Rp</span>
              <Input 
                className="h-12 pl-11 font-black text-lg rounded-xl border-2 focus:border-primary transition-all"
                type="text" 
                inputMode="numeric" 
                value={formatDisplay(amount)} 
                onChange={(e) => setAmount(e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.category}</label>
            <Input 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              placeholder={t.customCategory}
              className="h-12 rounded-xl border-2 focus:border-primary transition-all mb-3" 
            />
            <div className="grid grid-cols-2 gap-2">
              {quickCategories.map(cat => (
                <Button 
                  key={cat} 
                  type="button"
                  variant={category === cat ? 'default' : 'outline'}
                  className="text-[10px] font-bold h-9 rounded-xl overflow-hidden text-ellipsis whitespace-nowrap"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.note}</label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional details..." className="h-12 rounded-xl border-2 focus:border-primary transition-all" />
          </div>
          <Button onClick={handleSave} className="w-full h-12 mt-2 rounded-xl font-black text-white shadow-xl shadow-primary/20">
            {editingItem ? t.update : t.save}
          </Button>
        </div>
      </ResponsiveDialog>

      <Card className="rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-[80px] text-center font-bold text-[12px] tracking-tight px-8 h-16">{t.paid}</TableHead>
                <TableHead className="font-bold text-[12px] tracking-tight px-8 h-16">{t.item}</TableHead>
                <TableHead className="font-bold text-[12px] tracking-tight px-8 h-16">{t.category}</TableHead>
                <TableHead className="font-bold text-[12px] tracking-tight px-8 h-16">{t.type}</TableHead>
                <TableHead className="text-right font-bold text-[12px] tracking-tight px-8 h-16">{t.amount}</TableHead>
                <TableHead className="w-[120px] text-right font-bold text-[12px] tracking-tight px-8 h-16">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-bold italic opacity-60">
                    {t.noEntries}
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((item) => {
                  const catColor = getCategoryColor(item.category);
                  return (
                    <TableRow key={item.id} className={`${item.isPaid ? 'opacity-40 grayscale-[0.5]' : ''} ${item.isRoutine ? 'bg-primary/[0.01]' : ''} border-b last:border-none transition-all group`}>
                      <TableCell className="text-center px-8 py-6">
                        <button
                          onClick={() => onTogglePaid(item.id)}
                          className={`mx-auto flex h-7 w-7 items-center justify-center rounded-xl border-2 transition-all ${
                            item.isPaid ? 'bg-primary border-primary text-primary-foreground' : 'bg-background border-input hover:border-primary/50'
                          }`}
                        >
                          {item.isPaid && <CheckCircle2 className="h-4 w-4" />}
                        </button>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <span className={`font-bold text-[16px] ${item.isPaid ? 'line-through decoration-1' : ''}`}>
                          {item.name}
                        </span>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        <Badge 
                          variant="outline" 
                          className="w-fit text-[11px] font-bold py-1 px-3 rounded-xl whitespace-nowrap" 
                          style={{ borderColor: `${catColor}30`, color: catColor, backgroundColor: `${catColor}08` }}
                        >
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-8 py-6">
                        {item.isRoutine ? (
                          <div className="flex items-center gap-2 text-[12px] font-bold text-primary/60">
                            <RefreshCcw className="h-3.5 w-3.5" /> {t.routine}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[12px] font-bold text-amber-600/60">
                            <Zap className="h-3.5 w-3.5" /> {t.oneTime}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right px-8 py-6">
                        <div className="flex items-baseline justify-end gap-1 text-money">
                          <span className="text-[10px] font-bold opacity-30">Rp</span>
                          <span className={`font-black text-[17px] tracking-tighter ${item.isPaid ? 'line-through' : ''}`}>
                             {item.amount.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8 py-6">
                        <div className="flex justify-end gap-1.5">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => { setEditingItem(item); setIsOpen(true); }} 
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-primary transition-all hover:bg-primary/5"
                          >
                            <PencilLine className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => onRemove(item.id)} 
                            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive transition-all hover:bg-destructive/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};
