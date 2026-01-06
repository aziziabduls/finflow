
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ResponsiveDialog } from './ResponsiveDialog';
import { AssetItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Plus, Trash2, Wallet, PencilLine } from 'lucide-react';

interface AssetSectionProps {
  assets: AssetItem[];
  setAssets: (assets: AssetItem[]) => void;
  language: Language;
}

export const AssetSection: React.FC<AssetSectionProps> = ({ assets, setAssets, language }) => {
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AssetItem | null>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setAmount(editingItem.amount.toString());
    } else {
      setName('');
      setAmount('');
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
      setAssets(assets.map(a => a.id === editingItem.id ? { ...a, name, amount: numericAmount } : a));
    } else {
      setAssets([...assets, {
        id: Math.random().toString(36).substr(2, 9),
        name,
        amount: numericAmount,
      }]);
    }
    setIsOpen(false);
    setEditingItem(null);
  };

  const onRemove = (id: string) => setAssets(assets.filter(a => a.id !== id));
  const totalAssets = assets.reduce((sum, item) => sum + item.amount, 0);

  return (
    <section className="space-y-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-end px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-foreground">{t.wealth}</h2>
          <p className="text-muted-foreground text-sm mt-1 font-bold opacity-80 tracking-tight">{t.wealthDesc}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-muted-foreground leading-none mb-1 opacity-70">{t.totalValue}</p>
            <div className="flex items-baseline justify-end gap-1 text-money">
              <span className="text-[10px] font-bold text-emerald-600 opacity-40">Rp</span>
              <p className="text-2xl font-black text-emerald-600 tracking-tighter">{totalAssets.toLocaleString('id-ID')}</p>
            </div>
          </div>
          
          <Button size="sm" variant="outline" onClick={() => { setEditingItem(null); setIsOpen(true); }} className="gap-2 rounded-xl h-10 px-6 font-bold">
            <Wallet className="h-4 w-4" /> {t.addAsset}
          </Button>
        </div>
      </div>

      <ResponsiveDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={editingItem ? t.editAsset : t.addAsset}
        description={t.wealthDesc}
      >
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.accountName}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="BCA, Bank Mandiri, GoPay..." className="h-12 rounded-xl border-2 focus:border-primary transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">{t.balance}</label>
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
          <Button onClick={handleSave} className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 font-black text-white">
            {editingItem ? t.confirmAsset : t.confirmAsset}
          </Button>
        </div>
      </ResponsiveDialog>

      <Card className="rounded-[2rem] border border-border shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="font-bold text-[12px] tracking-tight px-8 h-16">{t.accountName}</TableHead>
                <TableHead className="text-right font-bold text-[12px] tracking-tight px-8 h-16">{t.balance}</TableHead>
                <TableHead className="w-[100px] text-right font-bold text-[12px] tracking-tight px-8 h-16">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-40 text-center text-muted-foreground font-bold italic opacity-60">
                    {t.noAssets}
                  </TableCell>
                </TableRow>
              ) : (
                assets.map((item) => (
                  <TableRow key={item.id} className="group transition-colors border-b last:border-none">
                    <TableCell className="font-bold text-[15px] px-8 py-6">{item.name}</TableCell>
                    <TableCell className="text-right px-8 py-6">
                      <div className="flex items-baseline justify-end gap-1 text-money">
                        <span className="text-[10px] font-bold text-emerald-600 opacity-30">Rp</span>
                        <span className="font-black text-emerald-600 text-[18px] tracking-tighter">
                          {item.amount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8 py-6">
                      <div className="flex justify-end gap-1">
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
