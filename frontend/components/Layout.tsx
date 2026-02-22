
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Users, Briefcase, Settings, LogOut, Home } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Command Center' },
    { path: '/dashboard', icon: LayoutDashboard, label: 'PMO Dashboard' },
    { path: '/new-project', icon: PlusCircle, label: 'New Project' },
    { path: '/projects', icon: Briefcase, label: 'Portfolio' },
    { path: '/resources', icon: Users, label: 'Resources' },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 text-blue-600 font-black text-2xl tracking-tighter">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">L</div>
            <span>Linkare AI</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600 text-white font-bold shadow-xl shadow-blue-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={22} />
                <span className="text-sm uppercase tracking-widest font-black">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100">
          <button className="flex items-center gap-4 px-5 py-4 w-full text-slate-400 hover:text-red-600 transition-colors font-bold uppercase tracking-widest text-xs">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-30">
          <h1 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">
            {navItems.find(i => i.path === location.pathname)?.label || 'Linkare Project AI'}
          </h1>
          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"><Settings size={22} /></button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <div className="text-sm font-black text-slate-900">Ana Gaspar</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</div>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-200 overflow-hidden shadow-sm ring-2 ring-white">
                <img src="https://picsum.photos/seed/ana/40/40" alt="User" />
              </div>
            </div>
          </div>
        </header>
        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
