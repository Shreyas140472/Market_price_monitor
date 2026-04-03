import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuFilter as Filter, LuSearch as Search, LuLeaf as Leaf, LuTrendingUp as TrendingUp } from 'react-icons/lu';
import Skeleton from '../components/Skeleton';

export default function Commodities() {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchComms() {
      const { data, error } = await supabase
        .from('prices')
        .select('price, commodities(id, name, category), markets(city)')
        .order('date', { ascending: false });

      if (data) {
        // Group by commodity ID to get latest stats
        const uniqueComms = {};
        data.forEach(p => {
          const cId = p.commodities?.id;
          if (!cId) return;
          if (!uniqueComms[cId]) {
            uniqueComms[cId] = {
              ...p.commodities,
              history: [],
              min: p.price,
              max: p.price,
              latestCity: p.markets?.city
            };
          }
          uniqueComms[cId].history.push(p.price);
          if (p.price < uniqueComms[cId].min) uniqueComms[cId].min = p.price;
          if (p.price > uniqueComms[cId].max) uniqueComms[cId].max = p.price;
        });

        const formatted = Object.values(uniqueComms).map(c => ({
          ...c,
          avgPrice: (c.history.reduce((a,b)=>a+b, 0) / c.history.length).toFixed(2),
          count: c.history.length
        }));

        setCommodities(formatted);
      }
      setLoading(false);
    }
    fetchComms();
  }, []);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses'];
  
  const filtered = commodities.filter(c => {
    const matchesFilter = filter === 'All' || c.category === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                         c.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-display font-bold flex items-center gap-3">
            <Leaf className="text-neon-green" /> Commodity <span className="neon-text-green">Intelligence</span>
          </h1>
          <p className="text-text-secondary mt-2">Explore daily market prices across {commodities.length} regional markets.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search commodities..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full input-ghost pl-10" 
            />
          </div>
          
          <div className="flex items-center gap-2 bg-surface-lowest p-1 rounded-xl border border-white/5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-tight transition-all ${
                  filter === cat 
                    ? 'bg-neon-green/20 text-neon-green shadow-[0_0_15px_rgba(0,255,150,0.2)]' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[200px]">
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-8 w-3/4 mb-10" />
              <Skeleton className="h-10 w-full mt-auto" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full glass-card p-24 text-center text-text-secondary border-dashed border-2 border-white/5">
            <div className="text-5xl mb-4 opacity-20">📡</div>
            <p className="text-xl font-display">No commodities found in the current region.</p>
            <button onClick={() => {setFilter('All'); setSearch('')}} className="text-neon-green mt-4 hover:underline">Reset Filters</button>
          </div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="glass-card p-6 flex flex-col justify-between group hover:border-white/20 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                <Leaf className="w-12 h-12 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-black text-neon-green tracking-widest bg-neon-green/5 px-2 py-0.5 rounded border border-neon-green/10">
                    {c.category}
                  </span>
                  <span className="text-[10px] text-text-secondary font-mono">{c.latestCity}</span>
                </div>
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-neon-green transition-colors">{c.name}</h3>
              </div>
              
              <div className="relative z-10 pt-6 mt-6 border-t border-white/5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">Current Market Value</p>
                  <div className="text-3xl font-display font-bold text-white leading-none mt-1">₹{c.avgPrice}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs font-bold ${c.avgPrice > 100 ? 'text-neon-red' : 'text-neon-green'}`}>
                    {c.avgPrice > 100 ? 'HIGH' : 'STABLE'}
                  </div>
                  <div className="text-[10px] text-text-secondary font-mono flex items-center justify-end gap-1">
                    <TrendingUp className="w-2 h-2" /> DATA_TRUST: 99%
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
