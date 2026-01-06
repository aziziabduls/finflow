
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { IncomeSection } from './components/IncomeSection';
import { ExpenseSection } from './components/ExpenseSection';
import { AssetSection } from './components/AssetSection';
import { Dashboard } from './components/Dashboard';
import { SmartRules } from './components/SmartRules';
import { AISuggestions } from './components/AISuggestions';
import { PeriodSelector } from './components/PeriodSelector';
import { ComparisonDiff } from './components/ComparisonDiff';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { IncomeState, ExpenseItem, AssetItem, Language } from './types';
import { INITIAL_EXPENSES, TRANSLATIONS } from './constants';
import { Moon, Sun, Monitor, Save, Trash2, LayoutDashboard, Database, Globe, CheckCircle, Loader2, GitCompare, X } from 'lucide-react';

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
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const t = TRANSLATIONS[language];

  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [routineExpenses, setRoutineExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [masterPeriods, setMasterPeriods] = useState<Record<string, PeriodRecord>>({});
  
  const [localDraft, setLocalDraft] = useState<{
    income: IncomeState;
    expenses: ExpenseItem[];
  }>({
    income: { salary: 0, bonus: 0, thr: 0, sideProject: 0 },
    expenses: [],
  });

  const isPeriodSwitching = useRef(false);

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

    isPeriodSwitching.current = true;
    const periodData = masterPeriods[selectedPeriod] || {
      income: { salary: 0, bonus: 0, thr: 0, sideProject: 0 },
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
    
    setTimeout(() => {
      isPeriodSwitching.current = false;
    }, 100);
  }, [selectedPeriod, isLoaded, masterPeriods, routineExpenses]);

  const performSave = useCallback((
    currentDraft: typeof localDraft, 
    currentAssets: AssetItem[], 
    currentPeriods: typeof masterPeriods
  ) => {
    setIsSaving(true);
    
    const newRoutineExpenses = currentDraft.expenses.filter(e => e.isRoutine);
    const newTemporaryExpenses = currentDraft.expenses.filter(e => !e.isRoutine);
    const routinePaidStatus: Record<string, boolean> = {};
    
    newRoutineExpenses.forEach(re => {
      routinePaidStatus[re.id] = re.isPaid;
    });

    const updatedGlobalRoutines = newRoutineExpenses.map(re => ({ ...re, isPaid: false }));
    
    const newPeriodRecord: PeriodRecord = {
      income: currentDraft.income,
      temporaryExpenses: newTemporaryExpenses,
      routinePaidStatus
    };

    const newMasterPeriods = { ...currentPeriods, [selectedPeriod]: newPeriodRecord };
    
    const storageObj: PersistedStorage = {
      assets: currentAssets,
      routineExpenses: updatedGlobalRoutines,
      periods: newMasterPeriods
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageObj));
    
    setMasterPeriods(newMasterPeriods);
    setRoutineExpenses(updatedGlobalRoutines);

    setTimeout(() => setIsSaving(false), 800);
  }, [selectedPeriod]);

  const hasUnsavedChanges = useMemo(() => {
    if (!isLoaded || isPeriodSwitching.current) return false;
    const periodData = masterPeriods[selectedPeriod] || {
      income: { salary: 0, bonus: 0, thr: 0, sideProject: 0 },
      temporaryExpenses: [],
      routinePaidStatus: {}
    };
    
    const savedCombined = [
      ...routineExpenses.map(re => ({
        ...re,
        isPaid: periodData.routinePaidStatus[re.id] || false
      })),
      ...periodData.temporaryExpenses
    ];

    const incomeDirty = JSON.stringify(localDraft.income) !== JSON.stringify(periodData.income);
    const expensesDirty = JSON.stringify(localDraft.expenses) !== JSON.stringify(savedCombined);
    
    return incomeDirty || expensesDirty;
  }, [localDraft, masterPeriods, selectedPeriod, routineExpenses, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !hasUnsavedChanges || isPeriodSwitching.current) return;

    const timer = setTimeout(() => {
      performSave(localDraft, assets, masterPeriods);
    }, 1500);

    return () => clearTimeout(timer);
  }, [localDraft, assets, isLoaded, hasUnsavedChanges, performSave, masterPeriods]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language);
  }, [language]);

  const totalIncome = useMemo(() => 
    (Object.values(localDraft.income) as number[]).reduce((acc, curr) => acc + curr, 0)
  , [localDraft.income]);

  const totalExpenses = useMemo(() => 
    localDraft.expenses.reduce((sum, item) => sum + item.amount, 0)
  , [localDraft.expenses]);

  const balance = totalIncome - totalExpenses;

  const previousMonthExpenses = useMemo(() => {
    const periodKeys = Object.keys(masterPeriods).sort().reverse();
    const currentIndex = periodKeys.indexOf(selectedPeriod);
    const prevKey = periodKeys[currentIndex + 1];
    if (!prevKey) return [];
    
    const prevRecord = masterPeriods[prevKey];
    return [
      ...routineExpenses.map(re => ({
        ...re,
        isPaid: prevRecord.routinePaidStatus[re.id] || false
      })),
      ...prevRecord.temporaryExpenses
    ];
  }, [masterPeriods, selectedPeriod, routineExpenses]);

  const hasPrevMonth = previousMonthExpenses.length > 0;

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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <span className="hidden font-bold sm:inline-block tracking-tight text-xl">FinFlow</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <PeriodSelector 
              selectedPeriod={selectedPeriod} 
              onPeriodChange={setSelectedPeriod} 
              hasUnsavedChanges={false} 
              language={language}
            />

            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}>
                <Globe className="h-4 w-4" />
              </Button>
              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                    {languages.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => { setLanguage(l.id); setIsLangMenuOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent ${language === l.id ? 'bg-accent font-bold' : ''}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Button variant="outline" size="icon" className="rounded-full h-9 w-9" onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}>
                {React.createElement(themes.find(t => t.id === theme)?.icon || Monitor, { className: "h-4 w-4" })}
              </Button>
              {isThemeMenuOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsThemeMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl z-[60] animate-in fade-in zoom-in-95 duration-200">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => { setTheme(t.id); setIsThemeMenuOpen(false); }}
                        className={`flex w-full items-center gap-2 px-4 py-3 text-sm font-medium transition-colors hover:bg-accent ${theme === t.id ? 'bg-accent font-bold' : ''}`}
                      >
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center">
              {isSaving ? (
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-muted-foreground animate-pulse">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{language === 'en' ? 'Saving...' : 'Menyimpan...'}</span>
                </div>
              ) : hasUnsavedChanges ? (
                <Button 
                  onClick={() => performSave(localDraft, assets, masterPeriods)} 
                  className="gap-2 rounded-xl px-5 h-9 sm:h-10 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.saveChanges}</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-600 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{language === 'en' ? 'All Saved' : 'Tersimpan'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-16 pb-32">
        <div className={`grid grid-cols-1 ${totalIncome > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-8`}>
          <Card className={`${totalIncome > 0 ? 'lg:col-span-2' : ''} p-8 sm:p-10 bg-accent/30 rounded-[2rem] border border-border/40 relative overflow-hidden shadow-none`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="flex flex-col md:flex-row justify-between gap-8 h-full relative z-10">
              <div className="space-y-6 flex-1 min-w-0">
                <SmartRules totalIncome={totalIncome} expenses={localDraft.expenses} language={language} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground opacity-80">{t.availableBalance} ({selectedPeriod})</p>
                  <div className={`flex items-baseline gap-2 font-black tracking-tighter text-money ${balance < 0 ? 'text-destructive' : ''}`}>
                    <span className="text-xl sm:text-2xl lg:text-3xl opacity-40">Rp</span>
                    <h2 className="text-3xl sm:text-5xl lg:text-7xl leading-none whitespace-nowrap">
                      {balance.toLocaleString('id-ID')}
                    </h2>
                  </div>
                </div>
                
                {hasPrevMonth && (
                  <Button 
                    variant={isCompareOpen ? 'secondary' : 'outline'} 
                    size="sm" 
                    onClick={() => setIsCompareOpen(!isCompareOpen)}
                    className="gap-2 rounded-xl px-5 border-2 font-bold transition-all active:scale-[0.98]"
                  >
                    {isCompareOpen ? <X className="h-4 w-4" /> : <GitCompare className="h-4 w-4" />}
                    {isCompareOpen ? t.exitComparison : t.compareWithPrev}
                  </Button>
                )}
              </div>
              <div className="flex items-start sm:items-end gap-6 flex-wrap md:flex-nowrap shrink-0 mt-4 md:mt-0">
                <div className="flex flex-col items-start md:items-end space-y-1">
                  <span className="text-xs font-bold text-muted-foreground opacity-60">{t.income}</span>
                  <div className="flex items-baseline gap-1 text-money">
                    <span className="text-[10px] font-bold opacity-40">Rp</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {totalIncome.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block h-12 w-[1px] bg-border/40" />
                <div className="flex flex-col items-start md:items-end space-y-1">
                  <span className="text-xs font-bold text-muted-foreground opacity-60">{t.expenses}</span>
                  <div className="flex items-baseline gap-1 text-money">
                    <span className="text-[10px] font-bold opacity-40">Rp</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {totalExpenses.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {totalIncome > 0 && (
            <div className="h-full min-h-[350px]">
              <AISuggestions income={localDraft.income} expenses={localDraft.expenses} assets={assets} selectedPeriod={selectedPeriod} language={language} />
            </div>
          )}
        </div>

        {isCompareOpen && (
          <ComparisonDiff 
            currentExpenses={localDraft.expenses} 
            previousExpenses={previousMonthExpenses} 
            language={language} 
          />
        )}

        <div className="space-y-24">
          <IncomeSection income={localDraft.income} setIncome={(income) => setLocalDraft(d => ({ ...d, income }))} language={language} />
          <AssetSection assets={assets} setAssets={(newAssets) => {
            setAssets(newAssets);
            performSave(localDraft, newAssets, masterPeriods);
          }} language={language} />
          <Dashboard expenses={localDraft.expenses} totalIncome={totalIncome} language={language} />
          <ExpenseSection expenses={localDraft.expenses} setExpenses={(expenses) => setLocalDraft(d => ({ ...d, expenses }))} language={language} />
        </div>

        <footer className="pt-20 border-t">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col gap-1 items-center md:items-start">
              <p className="text-base font-bold tracking-tight">FinFlow Premium</p>
              <p className="text-xs text-muted-foreground font-medium">{t.globalRoutineActive}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-destructive gap-2 rounded-xl hover:bg-destructive/5 font-bold"
                onClick={() => {
                  if (confirm(t.resetConfirm)) {
                    localStorage.removeItem(STORAGE_KEY);
                    window.location.reload();
                  }
                }}
              >
                <Trash2 className="h-4 w-4" /> {t.resetApp}
              </Button>
              <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold text-secondary-foreground shadow-sm">
                <Database className="h-3.5 w-3.5 opacity-60" /> 
                <span>v1.2.1 • Multi-Lang</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
