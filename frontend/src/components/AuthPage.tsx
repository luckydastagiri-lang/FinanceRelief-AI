import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
    } else {
      localStorage.removeItem('userName');
    }
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mx-8 -my-8 px-8 py-8 bg-zinc-950">
      <div className="w-full max-w-5xl h-[600px] flex rounded-3xl overflow-hidden glass-card">
        {/* Left Side: Animated Illustration */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-teal-700 via-emerald-700 to-[#0F172A] relative items-center justify-center overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-teal-500/30 rounded-full blur-3xl mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl mix-blend-screen" />
          
          <div className="relative z-10 p-12 text-center text-white">
            <h2 className="text-4xl font-display font-bold mb-4">Take Control of Your Financial Future</h2>
            <p className="text-teal-100/80 text-lg">AI-powered debt relief and financial recovery platform.</p>
            
            {/* Floating cards graphic */}
            <div className="mt-12 relative w-64 h-64 mx-auto">
              <div className="absolute inset-0 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm transform rotate-[-5deg] flex flex-col p-4 shadow-2xl">
                 <div className="w-1/2 h-3 bg-white/30 rounded mb-2"></div>
                 <div className="w-3/4 h-3 bg-white/20 rounded"></div>
              </div>
              <div className="absolute inset-0 border border-white/20 rounded-2xl bg-gradient-to-br from-teal-500/40 to-emerald-500/40 backdrop-blur-md transform rotate-[5deg] tranzinc-x-4 tranzinc-y-4 p-4 shadow-2xl flex items-end">
                 <div className="w-full h-1/2 bg-white/20 rounded-t-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side: Login Card */}
        <div className="w-full lg:w-1/2 bg-[#0F172A] p-12 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <h2 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-zinc-400 mb-8">Sign in to your FinRelief AI account</p>
            
            <form onSubmit={handleSignIn} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-600" 
                  placeholder="John Doe" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
                <input type="email" className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-600" placeholder="user@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
                <input type="password" className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-zinc-600" placeholder="••••••••" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-zinc-700 bg-zinc-800 text-teal-600 focus:ring-teal-600 focus:ring-offset-zinc-900" />
                  <span className="text-zinc-400">Remember me</span>
                </label>
                <a href="#" className="text-teal-400 hover:text-teal-300 transition-colors">Forgot password?</a>
              </div>

              <button type="submit" className="w-full btn-gradient rounded-xl px-4 py-3 mt-2">
                Sign In securely
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
