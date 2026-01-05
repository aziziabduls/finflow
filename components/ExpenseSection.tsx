
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { ResponsiveDialog } from './ResponsiveDialog';
import { ExpenseItem, Category, Language } from '../types';
import { CATEGORY_COLORS, TRANSLATIONS } from '../constants';
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
  const [category, setCategory] = useState<Category>(Category.DailyExpenses);
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
    if (!name || !amount) return;
    const numericAmount = parseInt(amount.replace(/[^0-9]/g, ''), 10) || 0;

    if (editingItem) {
      setExpenses(expenses.map(e => e.id === editingItem.id ? {
        ...e,
        name,
        amount: numericAmount,
        note,
        category,
        isRoutine
      } : e));
    } else {
      setExpenses([...expenses, {
        id: Math.random().toString(36).substr(2, 9),
        name,
        amount: numericAmount,
        category,
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

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter">{t.allocations}</h2>
          <p className="text-sm text-muted-foreground font-medium">
            {expenses.filter(e => e.isRoutine).length} {t.routineItems}
          </p>
        </div>
        
        <Button size="sm" onClick={() => { setEditingItem(null); setIsOpen(true); }} className="gap-2 rounded-xl h-10 px-6 font-bold">
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
            <div className="grid grid-cols-2 gap-2">
              {Object.values(Category).map(cat => (
                <Button 
                  key={cat} 
                  type="button"
                  variant={category === cat ? 'default' : 'outline'}
                  className="text-xs font-bold h-10 rounded-xl"
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

      <Card className="border-none shadow-sm ring-1 ring-border rounded-2xl overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-none">
                <TableHead className="w-[80px] text-center font-bold text-xs">{t.paid}</TableHead>
                <TableHead className="font-bold text-xs">{t.item}</TableHead>
                <TableHead className="hidden md:table-cell font-bold text-xs">{t.type}</TableHead>
                <TableHead className="text-right font-bold text-xs">{t.amount}</TableHead>
                <TableHead className="w-[120px] text-right font-bold text-xs pr-8">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold italic opacity-60">
                    {t.noEntries}
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((item) => (
                  <TableRow key={item.id} className={`${item.isPaid ? 'opacity-40 grayscale-[0.5]' : ''} ${item.isRoutine ? 'bg-primary/[0.02]' : ''} border-b last:border-none transition-all group`}>
                    <TableCell className="text-center">
                      <button
                        onClick={() => onTogglePaid(item.id)}
                        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-xl border-2 transition-all ${
                          item.isPaid ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-background border-input hover:border-primary/50'
                        }`}
                      >
                        {item.isPaid && <CheckCircle2 className="h-4 w-4" />}
                      </button>
                    </TableCell>
                    <TableCell className="py-5">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-[15px] ${item.isPaid ? 'line-through decoration-2' : ''}`}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outline" 
                            className="w-fit text-[9px] font-bold py-0.5 px-2 rounded-lg" 
                            style={{ borderColor: `${CATEGORY_COLORS[item.category]}40`, color: CATEGORY_COLORS[item.category] }}
                          >
                            {item.category}
                          </Badge>
                          {!item.isRoutine && (
                             <Badge variant="secondary" className="text-[9px] px-2 py-0.5 font-bold bg-amber-500/10 text-amber-600 border-none rounded-lg">{t.oneTime}</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell py-5">
                      {item.isRoutine ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-primary/60">
                          <RefreshCcw className="h-3 w-3" /> {t.routine}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600/60">
                          <Zap className="h-3 w-3" /> {t.oneTime}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-black text-money text-base tracking-tighter py-5">
                      Rp {item.amount.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right py-5 pr-8">
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};
