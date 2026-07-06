import { useState } from 'react';
import { FileText, Loader2, Copy, Download } from 'lucide-react';

export default function LetterGenerator() {
  const [creditor, setCreditor] = useState('');
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [type, setType] = useState('Hardship Declaration');
  const [tone, setTone] = useState('Formal');
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLetter = async () => {
    if (!creditor || !amount || !reason) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, creditor, amount, hardshipReason: reason, tone })
      });
      const data = await res.json();
      setLetter(data.letter);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-8rem)]">
      <div className="flex flex-col h-full glass-card rounded-2xl p-6 overflow-y-auto">
        <h2 className="text-2xl font-display font-bold text-white mb-2">AI Letter Generator</h2>
        <p className="text-zinc-400 text-sm mb-6">Generate professional negotiation and hardship correspondence.</p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Proposal Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors">
                <option>Hardship Declaration</option>
                <option>Settlement Offer</option>
                <option>Interest Reduction Request</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Tone</label>
              <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors">
                <option>Formal</option>
                <option>Friendly</option>
                <option>Legal</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Creditor Name</label>
            <input value={creditor} onChange={e => setCreditor(e.target.value)} type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="e.g. Chase Bank" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Outstanding Balance</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} type="text" className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 transition-colors" placeholder="₹1,50,000" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">Hardship Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-teal-500 resize-none transition-colors" placeholder="Briefly describe your situation..." />
          </div>
          
          <button onClick={generateLetter} disabled={loading} className="w-full btn-gradient rounded-xl px-4 py-3 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
            {loading ? 'Drafting with Gemini...' : 'Generate AI Draft'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col h-full glass-card rounded-2xl overflow-hidden relative">
        <div className="p-4 border-b border-zinc-800 bg-[#0F172A]/80 flex justify-between items-center">
          <h3 className="font-medium text-zinc-200">Generated Correspondence</h3>
          {letter && (
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Copy to clipboard">
                {copied ? <span className="text-xs text-green-400 font-medium px-1">Copied!</span> : <Copy className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors" title="Download PDF">
                <Download className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap bg-zinc-950/50">
          {letter ? letter : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-50">
              <FileText className="w-12 h-12 mb-4" />
              <p>Fill out the form to generate a draft.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
