import { useState, useEffect } from 'react';
import { Target, TrendingDown, AlertTriangle, ShieldCheck, Wallet, ArrowUpRight, ArrowDownRight, Activity, Lightbulb, CheckCircle2, Plus, RefreshCw, BarChart3, LineChart, Info, ChevronRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, LineChart as RechartsLineChart, Line, Legend } from 'recharts';
import OCRAnalyzer from './OCRAnalyzer';
import Achievements from './Achievements';

const incomeData = [
  { name: 'Jan', income: 2000000, expense: 500000, emi: 0 },
  { name: 'Feb', income: 2000000, expense: 500000, emi: 0 },
  { name: 'Mar', income: 2000000, expense: 500000, emi: 0 },
  { name: 'Apr', income: 2000000, expense: 500000, emi: 0 },
  { name: 'May', income: 2000000, expense: 500000, emi: 0 },
  { name: 'Jun', income: 2000000, expense: 500000, emi: 0 },
];

const projectionsData = [
  { month: 'Jul', activeEmi: 0, safeThreshold: 800000 },
  { month: 'Aug', activeEmi: 0, safeThreshold: 800000 },
  { month: 'Sep', activeEmi: 0, safeThreshold: 800000 },
  { month: 'Oct', activeEmi: 0, safeThreshold: 800000 },
  { month: 'Nov', activeEmi: 0, safeThreshold: 800000 },
  { month: 'Dec', activeEmi: 0, safeThreshold: 800000 },
];

export default function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [simBalance, setSimBalance] = useState(452000);
  const [simIncome, setSimIncome] = useState(2000000);
  const [simExpenses, setSimExpenses] = useState(500000);
  const [simOverdue, setSimOverdue] = useState(6);
  const [userName, setUserName] = useState('');
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showDebtModal, setShowDebtModal] = useState(false);
  const [editableIncome, setEditableIncome] = useState(2000000);
  const [editableExpenses, setEditableExpenses] = useState(500000);
  
  useEffect(() => {
    fetch('/api/loans').then(res => res.json()).then(setLoans).catch(console.error);
  }, []);

  const totalDebt = loans.reduce((acc: number, l: any) => acc + (l.balance || 0), 0);
  const totalEMI = loans.reduce((acc: number, l: any) => acc + (l.emi || 0), 0);
  const numAccounts = loans.length;
  
  const income = editableIncome;
  const expenses = editableExpenses;
  const surplus = income - expenses;
  const dti = income > 0 ? (totalEMI / income) * 100 : 0;
  
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const simTargetRatio = 0.41;
  const simOffer = simBalance * simTargetRatio;
  const simSavings = simBalance - simOffer;
  const simChance = 35;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 
            className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white tracking-tight whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              fontSize: '26px',
              color: '#efeae2',
              fontFamily: 'Arial',
              fontWeight: 'bold',
              fontStyle: 'normal',
              textDecorationLine: 'none',
              textAlign: 'left',
              lineHeight: '35px'
            }}
          >
            Welcome{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-zinc-400 mt-1">Track active liability metrics, test settlements via live sliders, and analyze recovery notice clauses.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowIncomeModal(true)}
            className="bg-[#0F172A] hover:bg-zinc-800 border border-zinc-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-zinc-300 font-medium transition-colors flex-1 md:flex-none whitespace-nowrap"
          >
            <RefreshCw className="w-4 h-4" /> Update Income & Surplus
          </button>
          <button 
            onClick={() => setShowDebtModal(true)}
            className="btn-gradient px-4 py-2 rounded-lg flex items-center justify-center gap-2 flex-1 md:flex-none whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Debt Account
          </button>
        </div>
      </header>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-xl -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
               <Wallet className="w-4 h-4 text-teal-400" /> Total Outstanding Debt
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-white">₹{totalDebt.toLocaleString('en-IN')}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">Across {numAccounts} Credit Accounts</span>
            <div className="flex items-center gap-1 text-red-400 text-xs font-medium bg-red-400/10 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> 3%
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-xl -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
               <TrendingDown className="w-4 h-4 text-green-400" /> Monthly Net Income
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-white">₹{income.toLocaleString('en-IN')}</p>
          <div className="flex flex-col mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Dispo:</span>
              <span className="text-green-400 font-medium">₹{surplus.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-zinc-500">Survival Expense:</span>
              <span className="text-zinc-300 font-medium">₹{expenses.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
               <Activity className="w-4 h-4 text-amber-400" /> DTI (EMI Ratio)
            </div>
          </div>
          <p className="text-2xl font-display font-bold text-white">{dti.toFixed(1)}%</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-zinc-500">Total EMIs: ₹{totalEMI.toLocaleString('en-IN')}</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-2 overflow-hidden">
             <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(dti, 100)}%` }}></div>
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-xl -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
             <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-green-400" /> Financial Health
            </div>
            <span className="text-[10px] font-bold text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded uppercase tracking-wide">Excellent</span>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-display font-bold text-white">95</p>
            <span className="text-zinc-500 text-xs">/ 100</span>
          </div>
          <div className="text-xs text-zinc-500 mt-2">AI Credit Relief Index</div>
        </div>
        
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start mb-2">
             <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
               <Target className="w-4 h-4 text-teal-400" /> Settlement Chance
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-display font-bold text-white">{simChance}%</p>
          </div>
          <div className="flex items-center gap-1 text-xs text-teal-400 mt-2 font-medium">
             <Target className="w-3 h-3" /> AI Prediction
          </div>
          <div className="text-[10px] text-zinc-500 mt-1">Based on default age</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Financial Health Score Explanation */}
         <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start mb-6">
               <h3 className="text-lg font-display font-bold text-white">Financial Health Score Explanation</h3>
               <div className="text-center">
                 <div className="text-3xl font-display font-bold text-green-400">95</div>
                 <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Index Rating</div>
               </div>
             </div>
             
             <div className="flex text-yellow-500 text-lg mb-6">★★★★★</div>
             
             <div className="space-y-4">
               <div className="flex gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-medium text-white mb-0.5">Debt ratio under control</h4>
                   <p className="text-xs text-zinc-400">Your EMI commitment consumes 0% of monthly net intake.</p>
                 </div>
               </div>
               <div className="flex gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-medium text-white mb-0.5">Net income profile stable</h4>
                   <p className="text-xs text-zinc-400">Monthly salary of ₹2,000,000 acts as vital recovery leverage.</p>
                 </div>
               </div>
               <div className="flex gap-3">
                 <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-medium text-white mb-0.5">Default litigation risk low</h4>
                   <p className="text-xs text-zinc-400">Lenders delay severe prosecution actions when overdue under 3-4 months.</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
         
         {/* Income vs Expenses */}
         <div className="glass-card p-6 rounded-2xl lg:col-span-2">
           <h3 className="text-lg font-display font-bold text-white mb-1">Income vs Expenses Analysis</h3>
           <p className="text-xs text-zinc-400 mb-6">Durable monthly surplus allocation: ₹1,500,000</p>
           
           <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={incomeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                 <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => (v/100000) + 'L'} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#fff' }} cursor={{fill: '#1e293b', opacity: 0.4}} />
                 <Legend wrapperStyle={{ fontSize: '12px' }} />
                 <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} barSize={20} />
                 <Bar dataKey="expense" name="Expenses" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={20} />
                 <Bar dataKey="emi" name="EMIs" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={20} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 6-Month Projections */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
           <h3 className="text-lg font-display font-bold text-white mb-1">6-Month EMI Commit Projections</h3>
           <p className="text-xs text-zinc-400 mb-6">Dims to safer levels through proactive settlement plans.</p>
           
           <div className="h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
               <RechartsLineChart data={projectionsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                 <XAxis dataKey="month" stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                 <YAxis stroke="#64748b" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(v) => (v/100000) + 'L'} />
                 <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#fff' }} />
                 <Legend wrapperStyle={{ fontSize: '12px' }} />
                 <Line type="monotone" dataKey="activeEmi" name="Active EMI Commitment" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6'}} />
                 <Line type="stepAfter" dataKey="safeThreshold" name="Safe Threshold (40% DTI)" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
               </RechartsLineChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Customized AI Action Suggestions */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full">
           <h3 className="text-lg font-display font-bold text-white flex items-center gap-2 mb-6">
             <Lightbulb className="w-5 h-5 text-yellow-500" /> Customized AI Action Suggestions
           </h3>
           
           <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
             <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Interest Saver</span>
               </div>
               <h4 className="text-teal-100 font-medium text-sm mb-2">Increase payment capacity by ₹1,000 monthly</h4>
               <p className="text-teal-200/70 text-xs mb-3">Allocating ₹1,000 extra to your highest APR loan can shorten tenure by 4 months, saving ₹15,400 in accrued penal interest.</p>
               <button className="text-xs text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1 transition-colors">Explore avalanche schedule <ChevronRight className="w-3 h-3" /></button>
             </div>

             <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Settle Prospect</span>
               </div>
               <h4 className="text-emerald-100 font-medium text-sm mb-2">Propose 35% Lump-Sum to Creditors now</h4>
               <p className="text-emerald-200/70 text-xs mb-3">Your accounts are deeply past-due. Launching a settlement request today has an 89% AI acceptance rate, shaving ₹0 off principal.</p>
               <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors">Analyze concession curves <ChevronRight className="w-3 h-3" /></button>
             </div>

             <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
               <div className="flex items-center gap-2 mb-1">
                 <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Urgent Risk</span>
               </div>
               <h4 className="text-red-100 font-medium text-sm mb-2">Claim financial hardship protections</h4>
               <p className="text-red-200/70 text-xs mb-3">Avoid missed payment defaults. Request a 3-month moratorium from HDFC using custom documentation templates with medical or employment proofs.</p>
               <button className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 transition-colors">Draft hardship file <ChevronRight className="w-3 h-3" /></button>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Settlement Probability Simulator Mini */}
        <div className="glass-card p-6 rounded-2xl border-t-4 border-t-teal-500 flex flex-col">
          <h3 className="text-xl font-display font-bold text-white mb-1">AI Settlement Probability Simulator</h3>
          <p className="text-xs text-zinc-400 mb-6">Drag parameters below to visualize live lender concession trends and success odds.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
             <div className="space-y-5">
               <div>
                 <div className="flex justify-between text-xs mb-1.5 text-zinc-300">
                   <label>Total Loan Principal:</label>
                   <span className="font-mono text-teal-400">₹{simBalance.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="10000" max="1000000" step="10000" value={simBalance} onChange={(e) => setSimBalance(Number(e.target.value))} className="w-full accent-teal-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
               </div>
               <div>
                 <div className="flex justify-between text-xs mb-1.5 text-zinc-300">
                   <label>Monthly Net Income:</label>
                   <span className="font-mono text-green-400">₹{simIncome.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="10000" max="3000000" step="10000" value={simIncome} onChange={(e) => setSimIncome(Number(e.target.value))} className="w-full accent-green-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
               </div>
               <div>
                 <div className="flex justify-between text-xs mb-1.5 text-zinc-300">
                   <label>Living Expenses:</label>
                   <span className="font-mono text-amber-400">₹{simExpenses.toLocaleString('en-IN')}</span>
                 </div>
                 <input type="range" min="10000" max="2000000" step="10000" value={simExpenses} onChange={(e) => setSimExpenses(Number(e.target.value))} className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
               </div>
               <div>
                 <div className="flex justify-between text-xs mb-1.5 text-zinc-300">
                   <label>Overdue Duration:</label>
                   <span className="font-mono text-emerald-400">{simOverdue} Months Default</span>
                 </div>
                 <input type="range" min="0" max="24" step="1" value={simOverdue} onChange={(e) => setSimOverdue(Number(e.target.value))} className="w-full accent-emerald-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
               </div>
             </div>
             
             <div className="bg-zinc-950 rounded-xl p-5 border border-zinc-700/50 flex flex-col justify-center">
               <div className="flex items-center gap-2 mb-4 text-teal-400">
                 <Activity className="w-4 h-4" /> <span className="text-xs font-bold uppercase tracking-wider">Live AI Prognosis</span>
               </div>
               <div className="space-y-4">
                 <div>
                   <div className="text-xs text-zinc-400 mb-1">Target Settlement Settle:</div>
                   <div className="text-2xl font-display font-bold text-white">₹{simOffer.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                   <div className="text-[10px] text-teal-400">({(simTargetRatio*100).toFixed(0)}% Settle Offer)</div>
                 </div>
                 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800">
                   <div>
                     <div className="text-[10px] text-zinc-500 mb-1">Potential Liability Savings:</div>
                     <div className="text-sm font-bold text-green-400">₹{simSavings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</div>
                   </div>
                   <div>
                     <div className="text-[10px] text-zinc-500 mb-1">Lender Acceptance Odds:</div>
                     <div className="text-sm font-bold text-amber-400">{simChance}% Chance</div>
                   </div>
                 </div>
               </div>
               <div className="mt-4 text-[10px] text-zinc-500 leading-relaxed bg-zinc-800/50 p-2 rounded flex gap-2 items-start">
                 <Info className="w-3 h-3 shrink-0 mt-0.5 text-zinc-400" /> Outstanding is highly overdue! Success probability is elevated as lenders seek loss-mitigation over total write-off.
               </div>
             </div>
          </div>
        </div>

        {/* OCR Analyzer */}
        <OCRAnalyzer />
      </div>

      {/* Gamification */}
      <Achievements />
      
      {/* Registered Liabilities Ledger */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-display font-bold text-white">Registered Liabilities Ledger</h3>
            <p className="text-sm text-zinc-400 mt-1">Registered: {numAccounts} Accounts</p>
          </div>
          <button className="bg-[#0F172A] hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg border border-zinc-700 transition-colors">
            View All
          </button>
        </div>
        
        {loans.length === 0 ? (
          <div className="bg-zinc-950/50 border border-zinc-800 border-dashed rounded-xl p-10 text-center">
            <Wallet className="w-10 h-10 text-zinc-700 mx-auto mb-4" />
            <h4 className="text-zinc-300 font-medium mb-2">No active debt liabilities registered on recovery desk yet.</h4>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">Click the "Add Debt Account" button above to populate your portfolio metrics and enable personalized AI strategies.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
                   <tr>
                      <th className="px-4 py-3 rounded-tl-lg font-medium">Creditor</th>
                      <th className="px-4 py-3 font-medium">Outstanding Balance</th>
                      <th className="px-4 py-3 font-medium">Interest (APR)</th>
                      <th className="px-4 py-3 font-medium">Monthly EMI</th>
                      <th className="px-4 py-3 rounded-tr-lg font-medium text-right">Status</th>
                   </tr>
                </thead>
                <tbody>
                   {loans.map((loan: any) => (
                     <tr key={loan.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-4 py-4 font-medium text-zinc-200">{loan.creditor}</td>
                        <td className="px-4 py-4 font-mono text-white">₹{loan.balance.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-4">{loan.interestRate}%</td>
                        <td className="px-4 py-4 font-mono">₹{loan.emi.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-4 text-right">
                           <span className="bg-green-500/10 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full border border-green-500/20">Active</span>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showIncomeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Update Income & Surplus</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Monthly Income (₹)</label>
                <input 
                  type="number" 
                  value={editableIncome}
                  onChange={(e) => setEditableIncome(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Monthly Expenses (₹)</label>
                <input 
                  type="number" 
                  value={editableExpenses}
                  onChange={(e) => setEditableExpenses(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowIncomeModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowIncomeModal(false)}
                className="flex-1 btn-gradient py-2 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showDebtModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Add Debt Account</h2>
            <p className="text-zinc-400 text-sm mb-4">This is a mock form for demonstration purposes.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Creditor Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. HDFC Bank"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Outstanding Balance (₹)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowDebtModal(false)}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowDebtModal(false)}
                className="flex-1 btn-gradient py-2 rounded-lg transition-colors"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

