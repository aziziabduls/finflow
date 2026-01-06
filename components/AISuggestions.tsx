
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { IncomeState, ExpenseItem, AssetItem, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { Sparkles, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';

interface AISuggestionsProps {
  income: IncomeState;
  expenses: ExpenseItem[];
  assets: AssetItem[];
  selectedPeriod: string;
  language: Language;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ income, expenses, assets, selectedPeriod, language }) => {
  const t = TRANSLATIONS[language];
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateAdvice = async () => {
    if (!process.env.API_KEY) {
      console.error("API Key is missing from environment.");
      setError(language === 'en' ? "Service unavailable: API Key missing." : "Layanan tidak tersedia: API Key hilang.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const totalIncome = Object.values(income).reduce((a, b) => a + b, 0);
      const totalExpenses = expenses.reduce((a, b) => a + b.amount, 0);
      const totalAssets = assets.reduce((a, b) => a + b.amount, 0);

      const prompt = `
        Act as a world-class senior financial planner. 
        Analyze the following financial data for the period ${selectedPeriod}:
        
        INCOME:
        - Total Monthly Income: Rp ${totalIncome.toLocaleString('id-ID')}

        EXPENSES:
        ${expenses.map(e => `- ${e.name} (${e.category}): Rp ${e.amount.toLocaleString('id-ID')}`).join('\n')}

        CURRENT ASSETS/WEALTH:
        ${assets.map(a => `- ${a.name}: Rp ${a.amount.toLocaleString('id-ID')}`).join('\n')}
        - Total Net Worth (Liquid): Rp ${totalAssets.toLocaleString('id-ID')}

        Please provide:
        1. A brief executive summary of their financial health.
        2. 3-4 highly specific, actionable suggestions to optimize their wealth.
        3. A "Pro Tip" for long-term growth.

        Tone: Professional, encouraging, and elite. 
        MANDATORY: Provide the entire response in ${language === 'en' ? 'English' : 'Bahasa Indonesia'}.
        Use Markdown for formatting. 
        IMPORTANT: Use **bold** text for emphasis on key numbers or insights. 
        Formatting rule: Ensure all headings and sub-headings use "Title Case" (Only First Letters Capitalized). 
        Do not use generic advice; be specific to the numbers provided.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "Failed to generate advice.";
      setSuggestion(text);
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      setError(language === 'en' ? "Financial insights temporarily unavailable." : "Wawasan keuangan sementara tidak tersedia.");
    } finally {
      setLoading(false);
    }
  };

  const parseInlineStyles = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-foreground">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed === '---' || trimmed === '--') return <div key={i} className="h-4" />;

      if (line.startsWith('###')) return <h4 key={i} className="text-base font-bold mt-6 mb-3 text-foreground">{parseInlineStyles(line.replace('###', '').trim())}</h4>;
      if (line.startsWith('##')) return <h3 key={i} className="text-lg font-bold mt-8 mb-4 text-foreground border-b pb-2">{parseInlineStyles(line.replace('##', '').trim())}</h3>;
      if (line.startsWith('#')) return <h2 key={i} className="text-xl font-black mt-10 mb-6 text-primary">{parseInlineStyles(line.replace('#', '').trim())}</h2>;

      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        const content = line.trim().substring(1).trim();
        if (!content || content === '--') return null;
        return (
          <div key={i} className="flex gap-3 mb-3 items-start pl-2">
            <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
            <span className="text-[15px] leading-relaxed text-foreground/90">{parseInlineStyles(content)}</span>
          </div>
        );
      }

      const numberMatch = trimmed.match(/^\d+\./);
      if (numberMatch) {
        const number = numberMatch[0];
        const content = trimmed.substring(number.length).trim();
        return (
          <div key={i} className="flex gap-3 mb-4 items-start font-medium">
            <span className="text-primary font-black text-lg min-w-[1.5rem]">{number}</span>
            <span className="text-[15px] leading-relaxed pt-0.5 text-foreground/90">{parseInlineStyles(content)}</span>
          </div>
        );
      }

      return <p key={i} className="mb-5 text-[15px] leading-relaxed text-muted-foreground font-medium">{parseInlineStyles(line)}</p>;
    });
  };

  return (
    <>
      <Card className="rounded-[2rem] bg-gradient-to-br from-indigo-500/[0.08] via-background to-emerald-500/[0.08] flex flex-col justify-center border-border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-8 pt-8">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-sm">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold tracking-tight">{t.analysis}</CardTitle>
              <p className="text-xs text-muted-foreground font-semibold opacity-70">{t.analysisSub}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center text-center px-8 pb-8">
          <div className="mb-8 space-y-3">
            <p className="text-base font-bold">{language === 'en' ? 'Personalized Financial Audit' : 'Audit Keuangan Personal'}</p>
            <p className="text-sm text-muted-foreground max-w-[240px] font-medium leading-relaxed opacity-80">
              {t.analysisDesc}
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-2 text-xs font-bold text-destructive bg-destructive/5 px-4 py-2.5 rounded-xl border border-destructive/10">
              <AlertCircle className="h-3.5 w-3.5" />
              {error}
            </div>
          )}

          <Button
            onClick={suggestion ? () => setIsDialogOpen(true) : generateAdvice}
            disabled={loading}
            className="w-full rounded-[1.25rem] bg-primary hover:bg-primary/90 gap-2 shadow-xl shadow-primary/10 h-14 font-bold text-base transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {language === 'en' ? 'Analyzing...' : 'Menganalisis...'}
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                {suggestion ? t.viewAnalysis : t.analyzeBtn}
              </>
            )}
          </Button>

          {suggestion && !loading && (
            <button
              onClick={generateAdvice}
              className="mt-5 text-xs text-muted-foreground hover:text-primary underline underline-offset-4 font-bold transition-colors opacity-70 hover:opacity-100"
            >
              {t.refreshAnalysis}
            </button>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[750px] max-h-[92vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl bg-background rounded-[2.5rem]">
          <DialogHeader className="p-10 border-b bg-muted/10 relative">
            <div className="flex items-center gap-5 mb-1">
              <div className="p-3 bg-primary rounded-2xl text-primary-foreground shadow-2xl shadow-primary/20">
                <BrainCircuit className="h-7 w-7" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-black tracking-tight leading-none mb-1.5">{t.strategyTitle}</DialogTitle>
                <DialogDescription className="text-sm font-bold opacity-50">
                  {t.auditFor} {selectedPeriod}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 sm:p-12 relative z-10 bg-card/30">
            <div className="max-w-none mx-auto bg-white dark:bg-zinc-900/40 p-10 rounded-[2rem] border border-border/50 shadow-inner ring-1 ring-black/5">
              {suggestion && renderMarkdown(suggestion)}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-[2rem] border bg-emerald-500/[0.04] border-emerald-500/10 transition-all hover:bg-emerald-500/[0.07] group">
                <p className="text-xs font-bold text-emerald-600 mb-3 opacity-70 group-hover:opacity-100 transition-opacity">{language === 'en' ? 'Wealth Health' : 'Kesehatan Aset'}</p>
                <p className="text-sm text-emerald-950/80 leading-relaxed font-bold">{language === 'en' ? 'Current distribution shows active movement towards long-term goals.' : 'Distribusi saat ini menunjukkan pergerakan aktif menuju tujuan jangka panjang.'}</p>
              </div>
              <div className="p-8 rounded-[2rem] border bg-indigo-500/[0.04] border-indigo-500/10 transition-all hover:bg-indigo-500/[0.07] group">
                <p className="text-xs font-bold text-indigo-600 mb-3 opacity-70 group-hover:opacity-100 transition-opacity">{language === 'en' ? 'Strategic Goal' : 'Target Strategis'}</p>
                <p className="text-sm text-indigo-950/80 leading-relaxed font-bold">{language === 'en' ? 'Prioritize unallocated balance for emergency liquidity building.' : 'Prioritaskan saldo yang belum teralokasi untuk membangun likuiditas darurat.'}</p>
              </div>
            </div>
          </div>

          <div className="p-8 border-t bg-muted/30 flex flex-col sm:flex-row justify-end gap-4 backdrop-blur-md">
            <Button variant="outline" size="lg" onClick={() => setIsDialogOpen(false)} className="rounded-2xl px-10 h-14 font-bold border-2">
              {t.closeAudit}
            </Button>
            <Button size="lg" onClick={generateAdvice} className="rounded-2xl px-10 h-14 gap-2 font-black shadow-2xl shadow-primary/10 transition-all active:scale-[0.98]">
              <Sparkles className="h-5 w-5" />
              {t.reRunAudit}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
