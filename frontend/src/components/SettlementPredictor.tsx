import { useState } from 'react';
import { Target, Activity } from 'lucide-react';

export default function SettlementPredictor() {
  const [balance, setBalance] = useState<number>(200000);
  const [income, setIncome] = useState<number>(45000);
  const [expenses, setExpenses] = useState<number>(30000);
  const [overdueMonths, setOverdueMonths] = useState<number>(4);

  // Simplified AI Mock calculation
  const disposable = income - expenses;
  const hardshipFactor = overdueMonths > 3 ? 0.8 : 1.2;
  const targetRatio = Math.max(0.2, Math.min(0.8, (disposable * 12 / balance) * hardshipFactor));
  
  const settlementOffer = balance * targetRatio;
  const savings = balance - settlementOffer;
  const successProb = Math.min(95, Math.floor(40 + (overdueMonths * 8) - (targetRatio * 20)));

  return (
    <div className="space-y-6 max-w-4xl">
      <header>
        <h1 className="text-3xl font-display font-bold text-white">AI Settlement Simulator</h1>
        <p className="text-zinc-400 mt-1">Simulate lump-sum payouts with live AI prediction parameters.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl space-y-6">
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-500" /> Adjust Parameters
          </h2>
          
          <div className="space-y-6">
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <label className="font-medium text-zinc-300">Outstanding Loan Balance</label>
                 <span className="font-mono text-teal-400">₹{balance.toLocaleString('en-IN')}</span>
               </div>
               <input type="range" min="10000" max="1000000" step="10000" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full accent-teal-500" />
             </div>
             
             <div>
               <div className="flex justify-between text-sm mb-2">
                 <label className="font-medium text-zinc-300">Monthly Income</label>
                 <span className="font-mono text-teal-400">₹{income.toLocaleString('en-IN')}</span>
               </div>
               <input type="range" min="10000" max="200000" step="5000" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full accent-teal-500" />
             </div>

             <div>
               <div className="flex justify-between text-sm mb-2">
                 <label className="font-medium text-zinc-300">Monthly Expenses</label>
                 <span className="font-mono text-teal-400">₹{expenses.toLocaleString('en-IN')}</span>
               </div>
               <input type="range" min="5000" max="150000" step="1000" value={expenses} onChange={(e) => setExpenses(Number(e.target.value))} className="w-full accent-teal-500" />
             </div>

             <div>
               <div className="flex justify-between text-sm mb-2">
                 <label className="font-medium text-zinc-300">Overdue Months</label>
                 <span className="font-mono text-teal-400">{overdueMonths} Months</span>
               </div>
               <input type="range" min="0" max="24" step="1" value={overdueMonths} onChange={(e) => setOverdueMonths(Number(e.target.value))} className="w-full accent-teal-500" />
             </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden bg-gradient-to-br from-[#0F172A] to-teal-900/20">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Target className="w-32 h-32" />
             </div>
             <p className="text-zinc-400 text-sm font-medium mb-1 relative z-10">AI Recommended Offer</p>
             <p className="text-4xl font-display font-bold text-white relative z-10">₹{settlementOffer.toLocaleString('en-IN', {maximumFractionDigits: 0})}</p>
             
             <div className="mt-8 relative z-10 space-y-4">
               <div className="flex justify-between items-center bg-zinc-950/50 rounded-lg p-3">
                 <span className="text-sm text-zinc-300">Estimated Savings</span>
                 <span className="font-bold text-green-400">₹{savings.toLocaleString('en-IN', {maximumFractionDigits: 0})}</span>
               </div>
               <div className="flex justify-between items-center bg-zinc-950/50 rounded-lg p-3">
                 <span className="text-sm text-zinc-300">Success Probability</span>
                 <div className="flex items-center gap-2">
                   <div className="w-16 h-2 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-teal-500 rounded-full" style={{ width: `${successProb}%` }}></div>
                   </div>
                   <span className="font-bold text-teal-400">{successProb}%</span>
                 </div>
               </div>
             </div>

             <button className="w-full btn-gradient py-3 rounded-xl mt-6 relative z-10">
               Generate Negotiation Letter
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
