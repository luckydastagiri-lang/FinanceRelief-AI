import { useState } from 'react';

export default function EMICalculator() {
  const [balance, setBalance] = useState<number>(10000);
  const [rate, setRate] = useState<number>(18);
  const [months, setMonths] = useState<number>(36);

  const monthlyRate = (rate / 100) / 12;
  const emi = monthlyRate === 0 
    ? balance / months 
    : (balance * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalInterest = (emi * months) - balance;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-white">EMI Calculator</h1>
      <p className="text-zinc-400">Simulate payoff acceleration and savings by adjusting terms.</p>
      
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 space-y-6">
        <div className="space-y-4">
           <div>
             <label className="block text-sm font-medium text-zinc-400 mb-2">Total Loan Balance (₹)</label>
             <input type="range" min="1000" max="100000" step="1000" value={balance} onChange={(e) => setBalance(Number(e.target.value))} className="w-full accent-emerald-500" />
             <div className="text-right font-mono text-emerald-400 mt-1">₹{balance.toLocaleString()}</div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-zinc-400 mb-2">Interest Rate (% APR)</label>
             <input type="range" min="0" max="40" step="0.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-emerald-500" />
             <div className="text-right font-mono text-emerald-400 mt-1">{rate}%</div>
           </div>
           
           <div>
             <label className="block text-sm font-medium text-zinc-400 mb-2">Duration (Months)</label>
             <input type="range" min="6" max="120" step="6" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-emerald-500" />
             <div className="text-right font-mono text-emerald-400 mt-1">{months} months</div>
           </div>
        </div>
        
        <div className="pt-6 border-t border-zinc-800 grid grid-cols-2 gap-6">
           <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
             <p className="text-zinc-400 text-sm mb-1">Monthly Payment</p>
             <p className="text-2xl font-display font-bold text-emerald-500">₹{emi.toFixed(2)}</p>
           </div>
           <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
             <p className="text-zinc-400 text-sm mb-1">Total Interest</p>
             <p className="text-2xl font-display font-bold text-red-400">₹{totalInterest.toFixed(2)}</p>
           </div>
        </div>
      </div>
    </div>
  );
}
