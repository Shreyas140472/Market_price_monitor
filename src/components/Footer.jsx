import { LuTrendingUp as TrendingUp, LuShieldCheck as ShieldCheck, LuGlobe as Globe } from 'react-icons/lu';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface-lowest pt-16 pb-8 relative overflow-hidden z-10 mt-auto">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-emerald-600 flex items-center justify-center">
                <TrendingUp className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold tracking-tight leading-none text-white">
                  Market <span className="neon-text-green">Monitor</span>
                </span>
              </div>
            </div>
            <p className="text-text-secondary text-sm max-w-sm font-sans mb-6">
              Advanced neural pricing ledger and intelligence suite for global commodity tracking. Empowering transparent and data-driven markets.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-text-secondary">
               <div className="flex items-center gap-2 bg-surface-container border border-white/5 px-3 py-1.5 rounded-lg">
                 <ShieldCheck className="w-4 h-4 text-neon-purple" />
                 <span>Verified Node</span>
               </div>
               <div className="flex items-center gap-2 bg-surface-container border border-white/5 px-3 py-1.5 rounded-lg">
                 <Globe className="w-4 h-4 text-neon-cyan" />
                 <span>Global Sync</span>
               </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-display font-semibold mb-6">Intelligence</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Market Analytics</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Predictive Modeling</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">Historical Ledger</a></li>
              <li><a href="#" className="hover:text-neon-cyan transition-colors">API Access <span className="text-[9px] uppercase tracking-wider bg-neon-purple/20 text-neon-purple px-1.5 py-0.5 rounded ml-2">Pro</span></a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-display font-semibold mb-6">System</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-neon-green transition-colors">Node Status</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Data Integrity</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Security Audit</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Documentation</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Market Price Monitor via Global Intelligence Ledger. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Terms of Validation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Ledger</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
