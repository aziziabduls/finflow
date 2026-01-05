
import React, { useState, useEffect, useMemo } from 'react';
import { IncomeSection } from './components/IncomeSection';
import { ExpenseSection } from './components/ExpenseSection';
import { AssetSection } from './components/AssetSection';
import { Dashboard } from './components/Dashboard';
import { SmartRules } from './components/SmartRules';
import { AISuggestions } from './components/AISuggestions';
import { PeriodSelector } from './components/PeriodSelector';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { IncomeState, ExpenseItem, AssetItem, Language } from './types';
import { INITIAL_EXPENSES, TRANSLATIONS } from './constants';
import { Moon, Sun, Monitor, Save, Trash2, LayoutDashboard, Database, Globe } from 'lucide-react';

const STORAGE_KEY = 'finflow_v1_data_master_v2';
const THEME_KEY = 'finflow_v1_theme_master';
const LANG_KEY = 'finflow_v1_lang_master';

type Theme = 'light' | 'dark' | 'midnight';

const getInitialPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

interface PeriodRecord {
  income: IncomeState;
  temporaryExpenses: ExpenseItem[];
  routinePaidStatus: Record<string, boolean>;
}

interface PersistedStorage {
  assets: AssetItem[];
  routineExpenses: ExpenseItem[];
  periods: Record<string, PeriodRecord>;
}

const App: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState(getInitialPeriod());
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const t = TRANSLATIONS[language];

  // Global State
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [routineExpenses, setRoutineExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [masterPeriods, setMasterPeriods] = useState<Record<string, PeriodRecord>>({});
  
  const [localDraft, setLocalDraft] = useState<{
    income: IncomeState;
    expenses: ExpenseItem[];
  }>({
    income: { salary: 8000000, bonus: 0, thr: 0, sideProject: 0 },
    expenses: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme;
    const savedLang = localStorage.getItem(LANG_KEY) as Language;
    
    if (saved) {
      try {
        const parsed: PersistedStorage = JSON.parse(saved);
        setAssets(parsed.assets || []);
        setRoutineExpenses(parsed.routineExpenses || INITIAL_EXPENSES);
        setMasterPeriods(parsed.periods || {});
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    if (savedLang) {
      setLanguage(savedLang);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const periodData = masterPeriods[selectedPeriod] || {
      income: { salary: 8000000, bonus: 0, thr: 0, sideProject: 0 },
      temporaryExpenses: [],
      routinePaidStatus: {}
    };

    const combinedExpenses: ExpenseItem[] = [
      ...routineExpenses.map(re => ({
        ...re,
        isPaid: periodData.routinePaidStatus[re.id] || false
      })),
      ...periodData.temporaryExpenses
    ];

    setLocalDraft({
      income: periodData.income,
      expenses: combinedExpenses
    });
  }, [selectedPeriod, isLoaded, masterPeriods, routineExpenses]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  const handleSave = () => {
    const newRoutineExpenses = localDraft.expenses.filter(e => e.isRoutine);
    const newTemporaryExpenses = localDraft.expenses.filter(e => !e.isRoutine);
    const routinePaidStatus: Record<string, boolean> = {};
    newRoutineExpenses.forEach(re => {
      routinePaidStatus[re.id] = re.isPaid;
    });

    const updatedGlobalRoutines = newRoutineExpenses.map(re => ({ ...re, isPaid: false }));
    setRoutineExpenses(updatedGlobalRoutines);

    const newPeriodRecord: PeriodRecord = {
      income: localDraft.income,
      temporaryExpenses: newTemporaryExpenses,
      routinePaidStatus
    };

    const newMasterPeriods = { ...masterPeriods, [selectedPeriod]: newPeriodRecord };
    setMasterPeriods(newMasterPeriods);
    
    const storageObj: PersistedStorage = {
      assets: assets,
      routineExpenses: updatedGlobalRoutines,
      periods: newMasterPeriods
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageObj));
    alert(language === 'en' ? "Data saved!" : "Data berhasil disimpan!");
  };

  const totalIncome = useMemo(() => 
    (Object.values(localDraft.income) as number[]).reduce((acc, curr) => acc + curr, 0)
  , [localDraft.income]);

  const totalExpenses = useMemo(() => 
    localDraft.expenses.reduce((sum, item) => sum + item.amount, 0)
  , [localDraft.expenses]);

  const balance = totalIncome - totalExpenses;

  const themes: { id: Theme; label: string; icon: any }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'midnight', label: 'Midnight', icon: Monitor },
  ];

  const languages: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'id', label: 'Bahasa Indonesia' },
  ];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block tracking-tight">FinFlow</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <PeriodSelector 
              selectedPeriod={selectedPeriod} 
              onPeriodChange={setSelectedPeriod} 
              hasUnsavedChanges={false} 
              language={language}
            />

            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>
                <Globe className="h-4 w-4" />
              </Button>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg z-[60]">
                    {languages.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setLanguage(l.id); setIsLangMenuOpen(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent ${language === l.id ? 'bg-accent font-bold' : ''}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}>
                {React.createElement(themes.find(t => t.id === theme)?.icon || Monitor, { className: "h-4 w-4" })}
              </Button>
              {isThemeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsThemeMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg z-[60]">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setIsThemeMenuOpen(false); }}
                        className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent ${theme === t.id ? 'bg-accent font-bold' : ''}`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Button onClick={handleSave} className="gap-2 rounded-xl">
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">{t.saveChanges}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-8 px-4 space-y-12 pb-32">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <Card className="xl:col-span-2 p-8 border-none shadow-none bg-accent/30 rounded-[2rem]">
            <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
              <div className="space-y-4 flex-1">
                <SmartRules totalIncome={totalIncome} expenses={localDraft.expenses} language={language} />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">{t.availableBalance} ({selectedPeriod})</p>
                  <h2 className={`text-5xl sm:text-6xl font-black tracking-tighter text-money mt-1 ${balance < 0 ? 'text-destructive' : ''}`}>
                    Rp {balance.toLocaleString('id-ID')}
                  </h2>
                </div>
              </div>
              <div className="flex items-end gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-muted-foreground">{t.income}</span>
                  <span className="text-xl font-bold text-money">Rp {totalIncome.toLocaleString('id-ID')}</span>
                </div>
                <div className="h-10 w-[1px] bg-border/50" />
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-muted-foreground">{t.expenses}</span>
                  <span className="text-xl font-bold text-money">Rp {totalExpenses.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </Card>
          <AISuggestions income={localDraft.income} expenses={localDraft.expenses} assets={assets} selectedPeriod={selectedPeriod} language={language} />
        </div>

        <div className="space-y-20">
          <IncomeSection income={localDraft.income} setIncome={(income) => setLocalDraft(d => ({ ...d, income }))} language={language} />
          <AssetSection assets={assets} setAssets={setAssets} language={language} />
          <Dashboard expenses={localDraft.expenses} totalIncome={totalIncome} language={language} />
          <ExpenseSection expenses={localDraft.expenses} setExpenses={(expenses) => setLocalDraft(d => ({ ...d, expenses }))} language={language} />
        </div>

        <footer className="pt-20 border-t">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-bold tracking-tight">FinFlow Premium</p>
              <p className="text-xs text-muted-foreground font-medium">{t.globalRoutineActive}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive gap-2 rounded-xl"
                onClick={() => {
                  if (confirm(t.resetConfirm)) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" /> {t.resetApp}
              </Button>
              <div className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-secondary-foreground">
                <Database className="h-3 w-3" /> v1.2.0-Multi-Lang
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
