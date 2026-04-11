import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuArrowRight as ArrowRight, LuTrendingUp as TrendingUp, LuTrendingDown as TrendingDown, LuZap as Zap, LuGlobe as Globe } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

export default function Landing() {
  const [latestPrices, setLatestPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrices() {
      const { data, error } = await supabase
        .from('prices')
        .select(`
          id, price, date, created_at,
          commodity_id, market_id,
          commodities (name),
          markets (city)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        const unique = [];
        const seen = new Set();
        
        for (const row of data) {
          const key = `${row.commodity_id}-${row.market_id}`;
          if (!seen.has(key)) {
            seen.add(key);
            const history = data.filter(r => r.commodity_id === row.commodity_id && r.market_id === row.market_id);
            const prevPrice = history.length > 1 ? history[1].price : row.price;
            unique.push({...row, prevPrice});
            if (unique.length === 4) break;
          }
        }
        setLatestPrices(unique);
      }
      setLoading(false);
    }

    fetchPrices();

    const channel = supabase
      .channel('landing-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prices' }, () => {
        fetchPrices();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-73px)] overflow-hidden">
      {/* Background Animated Gradient / Bloom */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-neon-cyan/5 blur-[180px] rounded-full mix-blend-screen pointer-events-none opacity-40 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[140px] rounded-full mix-blend-screen pointer-events-none opacity-30"></div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass-surface mb-10 border-white/10 animate-in slide-in-from-top duration-1000">
          <Globe className="w-4 h-4 text-neon-cyan animate-spin-slow" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-text-secondary">Global Asset Network Live</span>
        </div>

        <h1 className="text-7xl md:text-9xl font-display font-bold mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          <span className="relative inline-block">
             Market Price
             <div className="absolute -inset-1 bg-neon-cyan/20 blur-2xl opacity-20"></div>
          </span>
          <br />
          <span className="neon-text-cyan">Intelligence</span>
        </h1>

        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mb-16 font-sans font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
           A high-precision information system for real-time commodity pricing. Empowering the global trade ecosystem with centralized transparency.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          <Link to="/dashboard" className="btn-primary flex items-center justify-center gap-3 text-lg px-10 py-5 group">
            Launch Console <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/compare" className="btn-secondary text-lg px-10 py-5 flex items-center justify-center hover:border-neon-purple/30 transition-all">
            Cross-Node Comparison
          </Link>
        </div>

        {/* Live Terminal Feed */}
        <div className="mt-32 w-full text-left animate-in fade-in slide-in-from-bottom-12 duration-1200 delay-500">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-[10px] uppercase font-black tracking-[0.4em] text-text-secondary">RMC Neural Feed</h3>
            <div className="h-px flex-1 mx-10 bg-white/5 hidden md:block"></div>
            <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></div>
                 <span className="text-[10px] font-black text-neon-green uppercase tracking-widest">Active Link</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-8 min-h-[160px] flex flex-col justify-between">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))
            ) : latestPrices.length > 0 ? (
              latestPrices.map(item => (
                <div key={item.id} className="glass-surface p-8 flex flex-col hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)] transition-all duration-500 group relative">
                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                      <Zap className="w-16 h-16 text-neon-cyan" />
                   </div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-text-secondary font-black text-[10px] uppercase tracking-widest">{item.commodities?.name}</span>
                    <span className="bg-surface-lowest border border-white/10 text-white text-[10px] px-3 py-1 rounded-full uppercase font-black tracking-widest">
                      {item.markets?.city}
                    </span>
                  </div>
                  <div className="text-5xl font-display font-bold mt-2 flex items-center justify-between text-white group-hover:text-neon-cyan transition-all duration-500">
                    ₹{item.price}
                    {item.price > item.prevPrice ? (
                      <TrendingUp className="w-8 h-8 text-neon-red opacity-40 group-hover:opacity-100 transition-opacity" />
                    ) : item.price < item.prevPrice ? (
                      <TrendingDown className="w-8 h-8 text-neon-green opacity-40 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <TrendingUp className="w-8 h-8 text-neon-green opacity-40 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] text-text-secondary font-mono tracking-tighter">
                    <span className="group-hover:text-neon-cyan transition-colors">NODE_SYNC_COMPLETE</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full glass-card p-20 text-center text-text-secondary border-dashed border-white/10 flex flex-col items-center gap-8">
                <div className="p-6 bg-white/5 rounded-full">
                   <LuGlobe className="w-12 h-12 opacity-20" />
                </div>
                <div>
                   <p className="text-2xl font-display font-bold text-white mb-2 tracking-tight">System Node Dormant</p>
                   <p className="text-sm font-sans font-medium">Initialize the global price ledger to start real-time monitoring.</p>
                </div>
                <Link to="/admin" className="btn-primary py-4 px-12 text-sm uppercase tracking-[0.2em]">Enter Admin Terminal</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
