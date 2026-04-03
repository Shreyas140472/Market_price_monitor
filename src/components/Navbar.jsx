import { Link, useLocation } from 'react-router-dom';
import { LuTrendingUp as TrendingUp, LuLayoutDashboard as LayoutDashboard, LuMap as Map, LuChartBar as ChartBar, LuSettings as Settings, LuLogOut as LogOut } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: TrendingUp },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Compare', path: '/compare', icon: Map },
    { name: 'Commodities', path: '/commodities', icon: ChartBar },
    { name: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <nav className="glass-card rounded-none border-t-0 border-l-0 border-r-0 border-b-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-emerald-600 flex items-center justify-center">
            <TrendingUp className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-display font-bold tracking-tight">
            Market <span className="neon-text-green">Monitor</span>
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-1 bg-surface-lowest px-2 py-1 rounded-2xl border border-white/5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-white/10 neon-text-cyan shadow-[0_0_15px_rgba(0,240,255,0.15)]' 
                  : 'text-text-secondary hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-neon-cyan' : ''}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary hidden lg:inline">Admin: {user.email}</span>
            <button 
              onClick={logout}
              className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center cursor-pointer hover:border-neon-red group transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-text-secondary group-hover:text-neon-red" />
            </button>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-surface border border-white/10 flex items-center justify-center cursor-pointer hover:border-neon-cyan transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan opacity-80"></div>
          </div>
        )}
      </div>
    </nav>
  );
}
