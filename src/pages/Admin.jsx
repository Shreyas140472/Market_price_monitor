import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuLock as Lock, LuLogIn as LogIn, LuDatabase as Database, LuPlus as Plus, LuTrash2 as Trash2, LuUsers as Users, LuActivity as Activity, LuMapPin as Map, LuList as List, LuSave as Save, LuRefreshCw as Refresh } from 'react-icons/lu';
import { useAuth } from '../context/AuthContext';
import Skeleton from '../components/Skeleton';

export default function Admin() {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('assets');

  // Form states
  const [commName, setCommName] = useState('');
  const [commCat, setCommCat] = useState('Vegetables');
  const [marketCity, setMarketCity] = useState('');
  const [marketState, setMarketState] = useState('');
  
  // Bulk update states
  const [bulkPrices, setBulkPrices] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Data states for dropdowns
  const [commodities, setCommodities] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  async function fetchData() {
    setLoading(true);
    const { data: cData } = await supabase.from('commodities').select('*').order('name');
    if (cData) setCommodities(cData);

    const { data: mData } = await supabase.from('markets').select('*').order('city');
    if (mData) setMarkets(mData);

    const { count } = await supabase.from('prices').select('*', { count: 'exact', head: true });
    setTotalEntries(count || 0);

    // Initialize bulk update table with latest prices
    if (cData && mData) {
      const { data: pData } = await supabase.from('prices').select('*').order('date', { ascending: false });
      const ledger = [];
      cData.forEach(c => {
        mData.forEach(m => {
          const latest = pData?.find(p => p.commodity_id === c.id && p.market_id === m.id);
          ledger.push({
            commodity: c,
            market: m,
            currentPrice: latest?.price || 0,
            newPrice: latest?.price || 0,
            status: 'Synced'
          });
        });
      });
      setBulkPrices(ledger);
    }
    
    setLoading(false);
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      if (authMode === 'login') {
        const { error } = await login(email, password);
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage("Signup successful. Check your email or try logging in.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpdateChange = (index, val) => {
    const next = [...bulkPrices];
    next[index].newPrice = parseFloat(val) || 0;
    next[index].status = next[index].newPrice === next[index].currentPrice ? 'Synced' : 'Pending Update';
    setBulkPrices(next);
  };

  const commitBulkUpdates = async () => {
    const updates = bulkPrices.filter(p => p.status === 'Pending Update');
    if (updates.length === 0) return;
    
    setSyncing(true);
    try {
      const inserts = updates.map(u => ({
        commodity_id: u.commodity.id,
        market_id: u.market.id,
        price: u.newPrice,
        date: new Date().toISOString().split('T')[0]
      }));
      
      const { error } = await supabase.from('prices').insert(inserts);
      if (error) throw error;
      
      alert(`Ledger Synchronized: ${inserts.length} price updates published.`);
      fetchData();
    } catch (err) {
      alert("Ledger Error: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    try {
      const { data: cData } = await supabase.from('commodities').upsert([
        { name: 'Tomato', category: 'Vegetables' },
        { name: 'Onion', category: 'Vegetables' },
        { name: 'Rice', category: 'Grains' }
      ], { onConflict: 'name' }).select();

      const { data: mData } = await supabase.from('markets').upsert([
        { city: 'Mumbai', state: 'Maharashtra' },
        { city: 'Delhi', state: 'Delhi' }
      ], { onConflict: 'city' }).select();

      if (cData && mData) {
         fetchData();
         alert("Node data initialized.");
      }
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-6">
        <div className="glass-card p-10 w-full max-w-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Lock className="w-40 h-40" />
          </div>
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="p-5 bg-neon-purple/10 rounded-[2.5rem] border border-neon-purple/20 mb-6 group hover:shadow-[0_0_40px_rgba(176,0,255,0.2)] transition-all">
              <Lock className="w-10 h-10 text-neon-purple group-hover:scale-110 transition-transform" />
            </div>
            <h2 className="text-4xl font-display font-bold">Restricted <span className="neon-text-purple">Access</span></h2>
            <p className="text-text-secondary mt-2">Identify yourself to manage the neural ledger.</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <input type="email" placeholder="ADMIN_IDENTITY" value={email} onChange={e=>setEmail(e.target.value)} className="w-full input-ghost" required />
            <input type="password" placeholder="ENCRYPTION_KEY" value={password} onChange={e=>setPassword(e.target.value)} className="w-full input-ghost" required />
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 flex justify-center items-center gap-3">
              <LogIn className="w-5 h-5" /> {loading ? 'DECRYPTING...' : authMode === 'login' ? 'PROCEED TO CONSOLE' : 'INITIALIZE ADMIN'}
            </button>
            {message && <div className="p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl text-neon-cyan text-center text-sm">{message}</div>}
            <p className="text-center text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] cursor-pointer hover:text-neon-purple transition-colors pt-4"
               onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
              {authMode === 'login' ? "REQUEST PERMISSIONS (SIGN UP)" : "LOAD CREDENTIALS (LOG IN)"}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Admin Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10 border-b border-white/5 pb-10">
        <div className="flex gap-6 items-center">
          <div className="p-5 bg-neon-purple/10 rounded-2xl border border-neon-purple/20">
             <Database className="w-10 h-10 text-neon-purple" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold">Admin <span className="neon-text-purple">Command</span></h1>
            <p className="text-text-secondary text-lg mt-1 font-medium italic">Synchronizing truth with the global asset ledger.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <button onClick={handleSeed} className="btn-secondary text-[10px] tracking-[0.2em] font-black uppercase text-neon-cyan border-neon-cyan/20">Init Node Data</button>
          <div className="h-10 w-px bg-white/10 hidden md:block"></div>
          <div className="flex items-center gap-4 bg-surface-lowest p-3 rounded-2xl border border-white/5">
             <div className="w-3 h-3 rounded-full bg-neon-green animate-pulse"></div>
             <div>
                <p className="text-[10px] font-bold text-text-secondary uppercase leading-none mb-1">Session</p>
                <p className="text-xs font-mono text-white">SECURE_ACTIVE_ID</p>
             </div>
          </div>
          <button onClick={logout} className="btn-secondary text-[10px] tracking-[0.2em] font-black uppercase hover:text-neon-red border-white/5">Terminate</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 p-1.5 bg-surface-lowest/50 border border-white/5 rounded-2xl w-fit">
         <button onClick={()=>setActiveTab('assets')} className={`px-8 py-3 rounded-xl font-display font-bold text-sm transition-all ${activeTab === 'assets' ? 'bg-surface text-white shadow-xl border border-white/5' : 'text-text-secondary hover:text-white'}`}>Asset Management</button>
         <button onClick={()=>setActiveTab('ledger')} className={`px-8 py-3 rounded-xl font-display font-bold text-sm transition-all ${activeTab === 'ledger' ? 'bg-surface text-white shadow-xl border border-white/5' : 'text-text-secondary hover:text-white'}`}>Asset Ledger (Bulk)</button>
      </div>

      {activeTab === 'assets' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Add Forms */}
          <div className="lg:col-span-4 space-y-10">
             <div className="glass-card p-8">
                <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3"><Plus className="text-neon-cyan"/> Register Asset</h3>
                <form onSubmit={async(e)=>{e.preventDefault(); await supabase.from('commodities').insert([{name:commName, category:commCat}]); setCommName(''); fetchData();}} className="space-y-6">
                   <input value={commName} onChange={e=>setCommName(e.target.value)} placeholder="Asset Name" className="w-full input-ghost" />
                   <select value={commCat} onChange={e=>setCommCat(e.target.value)} className="w-full input-ghost bg-surface">
                      <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Pulses</option>
                   </select>
                   <button className="w-full btn-primary">BROADCAST ASSET</button>
                </form>
             </div>
             
             <div className="glass-card p-8 border-neon-green/10">
                <h3 className="text-xl font-display font-bold mb-8 flex items-center gap-3"><Map className="text-neon-green"/> Deploy Node</h3>
                <form onSubmit={async(e)=>{e.preventDefault(); await supabase.from('markets').insert([{city:marketCity, state:marketState}]); setMarketCity(''); fetchData();}} className="space-y-6">
                   <input value={marketCity} onChange={e=>setMarketCity(e.target.value)} placeholder="Regional Node (City)" className="w-full input-ghost" />
                   <input value={marketState} onChange={e=>setMarketState(e.target.value)} placeholder="Region (State)" className="w-full input-ghost" />
                   <button className="w-full btn-primary from-neon-green to-emerald-600 shadow-[0_0_20px_rgba(0,255,150,0.1)]">ACTIVATE NODE</button>
                </form>
             </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="glass-card p-8 h-[720px] flex flex-col">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xs font-black text-neon-cyan uppercase tracking-[0.4em]">Asset Directory</h3>
                   <span className="px-3 py-1 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full text-[10px] text-neon-cyan font-bold">{commodities.length} NODES</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 divide-y divide-white/5">
                   {commodities.map(c=>(
                     <div key={c.id} className="py-6 flex justify-between items-center group">
                        <div>
                           <p className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors">{c.name}</p>
                           <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">{c.category}</p>
                        </div>
                        <button onClick={async()=>{await supabase.from('commodities').delete().eq('id', c.id); fetchData();}} className="p-3 bg-red-500/10 rounded-xl text-neon-red opacity-0 group-hover:opacity-100 hover:bg-neon-red hover:text-white transition-all">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   ))}
                </div>
             </div>

             <div className="glass-card p-8 h-[720px] flex flex-col border-neon-green/10">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xs font-black text-neon-green uppercase tracking-[0.4em]">Network Nodes</h3>
                   <span className="px-3 py-1 bg-neon-green/10 border border-neon-green/20 rounded-full text-[10px] text-neon-green font-bold">{markets.length} ACTIVE</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 divide-y divide-white/5">
                   {markets.map(m=>(
                     <div key={m.id} className="py-6 flex justify-between items-center group">
                        <div>
                           <p className="text-xl font-display font-bold text-white group-hover:text-neon-green transition-colors">{m.city}</p>
                           <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-1">{m.state}</p>
                        </div>
                        <button onClick={async()=>{await supabase.from('markets').delete().eq('id', m.id); fetchData();}} className="p-3 bg-red-500/10 rounded-xl text-neon-red opacity-0 group-hover:opacity-100 hover:bg-neon-red hover:text-white transition-all">
                           <Trash2 className="w-5 h-5" />
                        </button>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 animate-in slide-in-from-right-4 duration-500">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b border-white/5">
              <div>
                 <h3 className="text-xl font-display font-bold">Admin <span className="neon-text-purple">Asset Ledger</span></h3>
                 <p className="text-text-secondary text-sm">Perform high-priority bulk updates across the network.</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={fetchData} className="btn-secondary flex items-center gap-2"><Refresh className="w-4 h-4"/> REFRESH</button>
                 <button onClick={commitBulkUpdates} disabled={syncing} className="btn-primary flex items-center gap-3">
                    {syncing ? <Refresh className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>} 
                    {syncing ? 'SYNCING LEDGER...' : 'COMMIT ALL UPDATES'}
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left font-sans">
                 <thead>
                    <tr className="text-[10px] font-black text-neon-purple uppercase tracking-[0.3em] border-b border-white/5">
                       <th className="pb-6 px-4">Asset Class</th>
                       <th className="pb-6 px-4">Active Node</th>
                       <th className="pb-6 px-4 text-center">Current Value</th>
                       <th className="pb-6 px-4 text-center">Neural Input (₹)</th>
                       <th className="pb-6 px-4 text-center">Variance Delta</th>
                       <th className="pb-6 px-4 text-right">Ledger Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {bulkPrices.map((item, i) => {
                       const delta = ((item.newPrice - item.currentPrice) / (item.currentPrice || 1) * 100).toFixed(1);
                       const isPending = item.status === 'Pending Update';

                       return (
                          <tr key={i} className={`group hover:bg-white/[0.02] transition-colors ${isPending ? 'bg-neon-purple/[0.03]' : ''}`}>
                             <td className="py-6 px-4">
                                <p className="font-display font-bold text-white uppercase tracking-wider">{item.commodity.name}</p>
                                <p className="text-[10px] text-text-secondary font-bold">ID: {item.commodity.id?.slice(0,8)}</p>
                             </td>
                             <td className="py-6 px-4 font-semibold text-text-secondary">{item.market.city}</td>
                             <td className="py-6 px-4 text-center font-mono">₹{item.currentPrice}</td>
                             <td className="py-6 px-4">
                                <div className="flex justify-center">
                                   <input 
                                      type="number" 
                                      value={item.newPrice} 
                                      onChange={(e)=>handleBulkUpdateChange(i, e.target.value)}
                                      className="w-24 bg-surface-lowest border border-white/10 rounded-lg p-2 text-center text-neon-purple font-display font-bold focus:border-neon-purple outline-none transition-all"
                                   />
                                </div>
                             </td>
                             <td className="py-6 px-4 text-center">
                                <span className={`font-mono font-bold ${parseFloat(delta) > 0 ? 'text-neon-red' : parseFloat(delta) < 0 ? 'text-neon-green' : 'text-text-secondary opacity-30'}`}>
                                   {parseFloat(delta) > 0 ? '+' : ''}{delta}%
                                </span>
                             </td>
                             <td className="py-6 px-4 text-right">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPending ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(176,0,255,0.4)]' : 'border border-white/10 text-text-secondary'}`}>
                                   {item.status}
                                </span>
                             </td>
                          </tr>
                       );
                    })}
                 </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
}
