import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import { LayoutDashboard, MessageSquare, Zap, Settings, Menu, X, Crown } from 'lucide-react';
import AdPlaceholder from './components/AdPlaceholder';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Area */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight">DevSolvr</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-600/10 text-brand-400 rounded-xl border border-brand-600/20 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">New Chat</span>
          </button>
          
          <div className="pt-6 pb-2">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">History</p>
          </div>
          <div className="space-y-1">
             {/* Mock History Items */}
            <button className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg truncate transition-colors">
              React useEffect help...
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg truncate transition-colors">
              Python list comprehension
            </button>
          </div>
        </nav>

        {/* Monetization / Ad Area in Sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-gradient-to-br from-brand-600 to-indigo-700 rounded-xl p-4 shadow-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-300 fill-current" />
              <h3 className="text-sm font-bold text-white">Go Pro</h3>
            </div>
            <p className="text-xs text-brand-100 mb-3 leading-relaxed">
              Get unlimited fast queries, GPT-4 access, and zero ads.
            </p>
            <button className="w-full py-2 bg-white text-brand-700 text-xs font-bold rounded-lg hover:bg-brand-50 transition-colors">
              Upgrade Now ($19/mo)
            </button>
          </div>
          
          <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative w-full">
        {/* Mobile Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:hidden z-10">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500">
             <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-slate-700">DevSolvr</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Top Ad Banner (Monetization) */}
        <div className="hidden sm:block p-4 pb-0 bg-slate-50">
            <AdPlaceholder format="horizontal" />
        </div>

        {/* Chat Application */}
        <main className="flex-1 overflow-hidden relative">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}

export default App;