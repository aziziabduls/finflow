
import React from 'react';
import { Category, ExpenseItem, Language } from './types';

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Savings]: '#10b981',      // Emerald-500
  [Category.EmergencyFund]: '#f59e0b', // Amber-500
  [Category.Investment]: '#6366f1',    // Indigo-500
  [Category.DailyExpenses]: '#ef4444', // Red-500
  [Category.Lifestyle]: '#ec4899',     // Pink-500
};

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    income: "Income Sources",
    inflows: "Monthly Inflows",
    mainSalary: "Main Salary",
    bonus: "Bonus",
    thr: "Holiday Allowance (THR)",
    freelance: "Freelance",
    wealth: "Wealth & Assets",
    wealthDesc: "Track your bank accounts and total net worth.",
    totalValue: "Total Value",
    addAsset: "Add Asset",
    editAsset: "Edit Asset",
    accountName: "Account Name",
    balance: "Balance",
    confirmAsset: "Confirm Asset",
    allocations: "Monthly Allocations",
    routineItems: "Routine items sync across periods.",
    newEntry: "New Entry",
    editAllocation: "Edit Allocation",
    addAllocation: "Add New Allocation",
    routineDesc: "Routine items reappear every month. Temporary items are for one-time use.",
    routine: "Routine",
    temporary: "Temporary",
    oneTime: "One-time",
    itemName: "Item Name",
    amount: "Amount",
    category: "Category",
    note: "Note",
    save: "Save Allocation",
    update: "Update Allocation",
    paid: "Paid",
    item: "Item",
    type: "Type",
    actions: "Actions",
    noEntries: "No entries for this period.",
    noAssets: "No assets registered yet.",
    availableBalance: "Available Balance",
    expenses: "Expenses",
    saveChanges: "Save Changes",
    resetApp: "Reset App",
    analysis: "Expert AI Insights",
    analysisSub: "Strategic Wealth Planning",
    analysisDesc: "Click below to generate a comprehensive strategy based on your current data.",
    analyzeBtn: "Analyze My Finances",
    viewAnalysis: "View Analysis",
    refreshAnalysis: "Refresh Data & Re-analyze",
    strategyTitle: "Financial Strategy Audit",
    auditFor: "Analysis for",
    closeAudit: "Close Audit",
    reRunAudit: "Re-Run Analysis",
    spendingMix: "Fixed vs Discretionary Mix",
    survivalBaseline: "Routine costs are your \"Survival Baseline\"",
    routineFixed: "Routine (Fixed)",
    discretionary: "Discretionary",
    remaining: "Remaining Balance",
    fixedMonthly: "Fixed monthly obligations",
    variableSpending: "Variable/One-time spending",
    freeCashFlow: "Free Cash Flow",
    unallocated: "Unallocated funds",
    budgetDeficit: "Budget deficit",
    savingsGoal: "Savings goal",
    noEmergency: "No allocation for Emergency Fund.",
    resetConfirm: "Clear ALL locally saved data?",
    globalRoutineActive: "Global Routine Synchronization Active."
  },
  id: {
    income: "Sumber Pendapatan",
    inflows: "Pemasukan Bulanan",
    mainSalary: "Gaji Pokok",
    bonus: "Bonus",
    thr: "THR",
    freelance: "Freelance / Sampingan",
    wealth: "Kekayaan & Aset",
    wealthDesc: "Pantau rekening bank dan total kekayaan bersih Anda.",
    totalValue: "Total Nilai",
    addAsset: "Tambah Aset",
    editAsset: "Edit Aset",
    accountName: "Nama Akun",
    balance: "Saldo",
    confirmAsset: "Konfirmasi Aset",
    allocations: "Alokasi Bulanan",
    routineItems: "Item rutin sinkron di setiap periode.",
    newEntry: "Entri Baru",
    editAllocation: "Edit Alokasi",
    addAllocation: "Tambah Alokasi Baru",
    routineDesc: "Item rutin muncul setiap bulan. Item sementara untuk sekali pakai.",
    routine: "Rutin",
    temporary: "Sementara",
    oneTime: "Sekali Pakai",
    itemName: "Nama Item",
    amount: "Jumlah",
    category: "Kategori",
    note: "Catatan",
    save: "Simpan Alokasi",
    update: "Update Alokasi",
    paid: "Lunas",
    item: "Item",
    type: "Tipe",
    actions: "Aksi",
    noEntries: "Belum ada entri untuk periode ini.",
    noAssets: "Belum ada aset terdaftar.",
    availableBalance: "Saldo Tersedia",
    expenses: "Pengeluaran",
    saveChanges: "Simpan Perubahan",
    resetApp: "Reset Aplikasi",
    analysis: "Wawasan Pakar AI",
    analysisSub: "Perencanaan Kekayaan Strategis",
    analysisDesc: "Klik di bawah untuk membuat strategi komprehensif berdasarkan data Anda.",
    analyzeBtn: "Analisis Keuangan Saya",
    viewAnalysis: "Lihat Analisis",
    refreshAnalysis: "Segarkan Data & Analisis Ulang",
    strategyTitle: "Audit Strategi Keuangan",
    auditFor: "Analisis untuk",
    closeAudit: "Tutup Audit",
    reRunAudit: "Jalankan Ulang Analisis",
    spendingMix: "Bauran Tetap vs Diskresioner",
    survivalBaseline: "Biaya rutin adalah \"Survival Baseline\" Anda",
    routineFixed: "Rutin (Tetap)",
    discretionary: "Diskresioner",
    remaining: "Sisa Saldo",
    fixedMonthly: "Kewajiban bulanan tetap",
    variableSpending: "Pengeluaran variabel/sekali-kali",
    freeCashFlow: "Arus Kas Bebas",
    unallocated: "Dana belum teralokasi",
    budgetDeficit: "Defisit anggaran",
    savingsGoal: "Target tabungan",
    noEmergency: "Belum ada alokasi untuk Dana Darurat.",
    resetConfirm: "Hapus SEMUA data yang tersimpan secara lokal?",
    globalRoutineActive: "Sinkronisasi Rutin Global Aktif."
  }
};

export const INITIAL_EXPENSES: ExpenseItem[] = [
  { id: '1', name: 'Nabung', amount: 1000000, category: Category.Savings, isPaid: false, note: 'Savings', isRoutine: true },
  { id: '2', name: 'Kosan', amount: 1500000, category: Category.DailyExpenses, isPaid: false, note: 'Boarding House', isRoutine: true },
  { id: '3', name: 'Buat Ibu', amount: 500000, category: Category.Lifestyle, isPaid: false, note: 'Gift', isRoutine: true },
  { id: '4', name: 'Buat Mamah', amount: 500000, category: Category.Lifestyle, isPaid: false, note: 'Gift', isRoutine: true },
  { id: '5', name: 'Uang Bulanan Dapur', amount: 2000000, category: Category.DailyExpenses, isPaid: false, note: 'Monthly Use', isRoutine: true },
  { id: '6', name: 'Transportasi', amount: 300000, category: Category.DailyExpenses, isPaid: false, note: 'Transport Accommodation', isRoutine: true },
  { id: '7', name: 'TopUp Emoney', amount: 200000, category: Category.DailyExpenses, isPaid: false, note: 'Electronic Money', isRoutine: true },
  { id: '8', name: 'Listrik Token', amount: 200000, category: Category.DailyExpenses, isPaid: false, note: 'Electricity', isRoutine: true },
  { id: '9', name: 'Subscription: Wifi', amount: 350000, category: Category.DailyExpenses, isPaid: false, note: 'Wifi', isRoutine: true },
  { id: '10', name: 'Subscription: Spotify', amount: 54990, category: Category.Lifestyle, isPaid: false, note: 'Spotify', isRoutine: true },
  { id: '11', name: 'Subscription: Netflix', amount: 186000, category: Category.Lifestyle, isPaid: false, note: 'Netflix', isRoutine: true },
  { id: '12', name: 'Subscription: Apple iCloud', amount: 15000, category: Category.Lifestyle, isPaid: false, note: 'Apple iCloud', isRoutine: true },
  { id: '13', name: 'Subscription: Google One', amount: 26900, category: Category.Lifestyle, isPaid: false, note: 'Google One', isRoutine: true },
  { id: '14', name: 'Gopaylater', amount: 0, category: Category.DailyExpenses, isPaid: false, note: 'Paylater', isRoutine: true },
  { id: '15', name: 'Kredivo', amount: 0, category: Category.DailyExpenses, isPaid: false, note: 'Paylater', isRoutine: true },
  { id: '16', name: 'Shopeepaylater', amount: 0, category: Category.DailyExpenses, isPaid: false, note: 'Paylater', isRoutine: true },
];

export const ICONS = {
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6"/></svg>
  ),
  Alert: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  ),
  TrendingUp: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
  ),
  Wallet: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1"/><path d="M16 12h5"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  )
};
