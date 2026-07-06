/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, Calculator, Target, FileText, MessageSquare, History, PieChart, LogIn, Wallet, Workflow, Sun, Moon } from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect, createContext, useContext } from 'react';
import Dashboard from './components/Dashboard';
import EMICalculator from './components/EMICalculator';
import SettlementPredictor from './components/SettlementPredictor';
import LetterGenerator from './components/LetterGenerator';
import ChatAssistant from './components/ChatAssistant';
import HistoryTimeline from './components/HistoryTimeline';
import Reports from './components/Reports';
import AuthPage from './components/AuthPage';
import BudgetPlanner from './components/BudgetPlanner';
import Architecture from './components/Architecture';

const ThemeContext = createContext<{ isLightMode: boolean; toggleTheme: () => void }>({
  isLightMode: false,
  toggleTheme: () => {},
});

function Sidebar() {
  const location = useLocation();
  const userName = localStorage.getItem('userName');
  const { isLightMode, toggleTheme } = useContext(ThemeContext);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/calculator', label: 'EMI Calculator', icon: Calculator },
    { path: '/budget', label: 'Budget Planner', icon: Wallet },
    { path: '/settlement', label: 'Settlement Simulator', icon: Target },
    { path: '/letters', label: 'AI Letters', icon: FileText },
    { path: '/assistant', label: 'AI Advisor', icon: MessageSquare },
    { path: '/history', label: 'History', icon: History },
    { path: '/reports', label: 'Reports', icon: PieChart },
    { path: '/architecture', label: 'Architecture', icon: Workflow },
  ];

  return (
    <div className="w-64 bg-[#0F172A] h-screen text-zinc-300 p-4 flex flex-col fixed border-r border-zinc-800 z-50">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight font-display">FinRelief AI</h1>
      </div>
      
      <button 
        onClick={toggleTheme}
        className="flex items-center gap-3 px-3 py-2.5 mb-4 rounded-lg hover:bg-zinc-800/50 hover:text-white border border-zinc-800 transition-colors"
      >
        {isLightMode ? (
          <>
            <Moon className="w-5 h-5 text-teal-500" />
            <span className="text-sm font-medium">Dark Mode</span>
          </>
        ) : (
          <>
            <Sun className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium">Light Mode</span>
          </>
        )}
      </button>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-teal-600/10 text-teal-400 font-medium border border-teal-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                  : 'hover:bg-zinc-800/50 hover:text-white border border-transparent'
              )}
            >
              <Icon className={clsx("w-5 h-5", isActive ? "text-teal-500" : "text-zinc-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 border-t border-zinc-800">
        {userName ? (
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-sm font-medium text-zinc-300 truncate max-w-[120px]">{userName}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('userName');
                window.location.href = '/auth';
              }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 hover:text-white transition-colors">
            <LogIn className="w-5 h-5 text-zinc-400" />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const userName = localStorage.getItem('userName');
  if (!userName) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Sync with local storage or system preference if desired, keeping it simple for now
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsLightMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const next = !prev;
      localStorage.setItem('theme', next ? 'light' : 'dark');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      <Router>
        <div className={clsx(
          "flex min-h-screen text-zinc-100 font-sans selection:bg-teal-500/30",
          isLightMode ? "light-theme bg-white text-zinc-900" : "bg-zinc-950"
        )}>
          <Routes>
            <Route path="/auth" element={
              <div className="w-full relative">
                <AuthPage />
              </div>
            } />
            <Route path="*" element={
              <>
                <Sidebar />
                <main 
                  className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative"
                  style={{ backgroundColor: isLightMode ? '#ffffff' : '#141212' }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none" />
                  <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
                  
                  <div className="max-w-6xl mx-auto relative z-10">
                    <Routes>
                      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/calculator" element={<ProtectedRoute><EMICalculator /></ProtectedRoute>} />
                      <Route path="/budget" element={<ProtectedRoute><BudgetPlanner /></ProtectedRoute>} />
                      <Route path="/settlement" element={<ProtectedRoute><SettlementPredictor /></ProtectedRoute>} />
                      <Route path="/letters" element={<ProtectedRoute><LetterGenerator /></ProtectedRoute>} />
                      <Route path="/assistant" element={<ProtectedRoute><ChatAssistant /></ProtectedRoute>} />
                      <Route path="/history" element={<ProtectedRoute><HistoryTimeline /></ProtectedRoute>} />
                      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                      <Route path="/architecture" element={<ProtectedRoute><Architecture /></ProtectedRoute>} />
                    </Routes>
                  </div>
                </main>
              </>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}
