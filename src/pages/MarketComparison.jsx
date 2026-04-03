import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuMap as Map, LuArrowUpRight as ArrowUpRight, LuArrowDownRight as ArrowDownRight, LuBox as Box, LuZap as Zap, LuActivity as Activity } from 'react-icons/lu';
import Skeleton from '../components/Skeleton';

export default function MarketComparison() {
  const [dataByCity, setDataByCity] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [selectedComm, setSelectedComm] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from('prices')
      .select(`
        id, price,
        commodities (name),
        markets (city)
      `)
      .order('date', { ascending: false });

    if (data) {
      const comms = ['All', ...new Set(data.map(d => d.commodities?.name).filter(Boolean))];
      setCommodities(comms);

      const grouped = data.reduce((acc, row) => {
        const city = row.markets?.city;
        if (!city) return acc;
        if (!acc[city]) acc[city] = [];
        
        const existing = acc[city].find(c => c.commodity === row.commodities?.name);
        if (!existing) {
          acc[city].push({
            commodity: row.commodities?.name,
            price: row.price
          });
        }
        return acc;
      }, {});
      
      setDataByCity(grouped);
    }
    setLoading(false);
  }

  const getCityPricesForComm = () => {
    if (selectedComm === 'All') return null;
    return Object.entries(dataByCity).map(([city, items]) => {
      const match = items.find(i => i.commodity === selectedComm);
      return { city, price: match ? match.price : null };
    }).filter(d => d.price !== null);
  };

  const commStats = getCityPricesForComm();

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-1000">
      {/* Header Section: Editorial & Asymmetric */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-white/5 pb-10">
        <div className="lg:col-span-8 flex items-center gap-6">
          <div className="p-4 bg-neon-cyan/5 rounded-2xl border border-neon-cyan/20 relative group">
            <div className="absolute inset-0 bg-neon-cyan/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Map className="w-10 h-10 text-neon-cyan relative z-10" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              Neural <span className="neon-text-cyan">Comparison</span>
            </h1>
            <p className="text-text-secondary text-lg mt-2 font-sans font-medium">Analyze global price variance across distributed regional nodes.</p>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-2">
          <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.4em]">Filter Intelligence Node</span>
          <select 
            value={selectedComm} 
            onChange={e => setSelectedComm(e.target.value)}
            className="input-ghost w-full font-display font-medium text-lg"
          >
            {commodities.map(c => <option key={c} value={c} className="bg-surface text-white">{c}</option>)}
          </select>
        </div>
      </div>

      {/* Main Analysis Architecture */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Left Column: Asymmetric Weighted Primary View */}
        <div className="xl:col-span-8 space-y-10">
          
          {selectedComm !== 'All' && commStats && (
            <div className="glass-surface p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-40 h-40 text-neon-cyan" />
              </div>
              
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-sm font-black text-neon-cyan uppercase tracking-[0.3em]">Cross-Node Price Spread</h2>
                  <p className="text-2xl font-display font-bold mt-1">{selectedComm} Intelligence</p>
                </div>
                <div className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full flex items-center gap-2">
                  <div className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest">Live Sync</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {commStats.map(stat => (
                  <div key={stat.city} className="bg-surface-lowest/50 p-6 rounded-2xl border border-white/5 hover:border-neon-cyan/30 transition-all group/stat">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-text-secondary text-xs font-bold uppercase tracking-widest">{stat.city}</span>
                      <ArrowUpRight className="w-4 h-4 text-text-secondary opacity-20 group-hover/stat:opacity-100 group-hover/stat:text-neon-cyan transition-all" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-display font-bold">₹{stat.price}</span>
                      <span className="text-[10px] text-neon-green font-bold">PER UNIT</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-neon-cyan/50 to-neon-cyan transition-all duration-1000 ease-out" 
                         style={{ width: `${(stat.price/200)*100}%` }}
                       ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Node Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="glass-card p-8 h-[350px]">
                  <Skeleton className="h-8 w-1/2 mb-4" />
                  <Skeleton className="h-4 w-full mb-8" />
                  <div className="space-y-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                </div>
              ))
            ) : Object.keys(dataByCity).length === 0 ? (
              <div className="col-span-full py-20 text-center glass-card border-dashed">
                <p className="text-text-secondary font-display text-xl">No active market entries detected in the database.</p>
              </div>
            ) : (
              Object.entries(dataByCity).map(([city, items]) => (
                <div key={city} className="glass-card overflow-hidden hover:border-white/20 transition-all group relative">
                  <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                      <h2 className="text-3xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors">{city}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Activity className="w-3 h-3 text-neon-green" />
                        <span className="text-[10px] text-text-secondary font-bold tracking-[0.2em] uppercase">{items.length} Tracking Channels</span>
                      </div>
                    </div>
                    <Box className="w-6 h-6 text-text-secondary opacity-10 group-hover:opacity-40 transition-opacity" />
                  </div>
                  
                  <div className="p-8 space-y-4 bg-gradient-to-b from-transparent to-surface-lowest/20">
                    {items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-lowest/40 hover:bg-surface-lowest transition-all group/item border border-transparent hover:border-white/5">
                        <span className="font-sans font-semibold text-text-secondary group-hover/item:text-white transition-colors">
                          {item.commodity}
                        </span>
                        <span className={`font-display font-bold text-xl ${item.price < 50 ? 'text-neon-green' : item.price > 120 ? 'text-neon-red' : 'text-white'}`}>
                          ₹{item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Asymmetric Sidebar Widgets */}
        <div className="xl:col-span-4 space-y-10">
          
          <div className="glass-card p-8 border-neon-purple/20 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-neon-purple/20 blur-[80px] rounded-full"></div>
            <h3 className="text-xs font-black text-neon-purple uppercase tracking-[0.4em] mb-6">Arbitrage Monitor</h3>
            
            <div className="space-y-6 relative z-10">
              <div className="p-5 rounded-2xl bg-surface-lowest/50 border border-white/5">
                <p className="text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-widest">Highest Variance</p>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-display font-bold">Mumbai → Delhi</span>
                  <span className="text-neon-red font-bold">+24%</span>
                </div>
              </div>
              
              <div className="p-5 rounded-2xl bg-surface-lowest/50 border border-white/5">
                <p className="text-[10px] font-bold text-text-secondary mb-2 uppercase tracking-widest">Optimal Pipeline</p>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-display font-bold">Pune node stable</span>
                  <span className="text-neon-green font-bold">±2%</span>
                </div>
              </div>

              <button className="w-full py-4 text-[10px] font-black text-neon-purple uppercase tracking-[0.4em] border border-neon-purple/30 rounded-xl hover:bg-neon-purple/10 transition-all">
                Download Delta Report
              </button>
            </div>
          </div>

          <div className="glass-surface p-8 relative overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-neon-green"></div>
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Network Confidence</h3>
             </div>
             <p className="text-3xl font-display font-bold text-white">99.8%</p>
             <p className="text-xs text-text-secondary mt-2">Data verified across 14 redundancy nodes.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
