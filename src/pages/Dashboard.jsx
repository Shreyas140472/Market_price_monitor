import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { LuPackage as Package, LuMapPin as MapPin, LuDatabase as Database, LuActivity as Activity } from 'react-icons/lu';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import Skeleton from '../components/Skeleton';

export default function Dashboard() {
  const [stats, setStats] = useState({ commodities: 0, markets: 0, prices: 0 });
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    // Set up Realtime Subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'prices' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  async function fetchDashboardData() {
    try {
      const { count: comCount } = await supabase.from('commodities').select('*', { count: 'exact', head: true });
      const { count: mktCount } = await supabase.from('markets').select('*', { count: 'exact', head: true });
      const { count: prcCount } = await supabase.from('prices').select('*', { count: 'exact', head: true });
      
      setStats({
        commodities: comCount || 0,
        markets: mktCount || 0,
        prices: prcCount || 0
      });

      // Latest table rows
      const { data } = await supabase
        .from('prices')
        .select('id, price, date, commodities (name, category), markets (city)')
        .order('created_at', { ascending: false })
        .limit(10);
      if (data) setLatestUpdates(data);

      // Chart data: average price per date
      const { data: trendData } = await supabase
        .from('prices')
        .select('price, date')
        .order('date', { ascending: true });
        
      if (trendData && trendData.length > 0) {
        const groupedByDate = trendData.reduce((acc, row) => {
          if (!acc[row.date]) acc[row.date] = { date: row.date, sum: 0, count: 0 };
          acc[row.date].sum += row.price;
          acc[row.date].count += 1;
          return acc;
        }, {});
        
        const mappedData = Object.values(groupedByDate).map(d => ({
          date: d.date,
          avgPrice: parseFloat((d.sum / d.count).toFixed(2))
        }));
        
        setChartData(mappedData.slice(-15));
      }

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({ icon: Icon, title, value, colorClass }) => (
    <div className="glass-card p-6 flex items-center gap-4 group hover:border-white/20 transition-all">
      <div className={`p-4 rounded-xl bg-surface-lowest border border-white/5 ${colorClass} group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-text-secondary text-sm font-medium">{title}</p>
        <p className="text-3xl font-display font-bold mt-1 tracking-tight">
          {loading ? <Skeleton className="h-8 w-16 mt-1" /> : value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">System Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Global market intelligence and price forecasting.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-neon-green bg-neon-green/5 px-4 py-2 rounded-full border border-neon-green/20">
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></span>
          Sub-nanosecond sync active
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Database} title="Total Price Points" value={stats.prices} colorClass="text-neon-cyan" />
        <StatCard icon={Package} title="Active Commodities" value={stats.commodities} colorClass="text-neon-purple" />
        <StatCard icon={MapPin} title="Tracked Markets" value={stats.markets} colorClass="text-neon-green" />
        <StatCard icon={Activity} title="System Status" value="Online" colorClass="text-neon-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-6 h-[400px]">
          <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
             Analytics Trend <span className="text-xs font-normal text-text-secondary py-1 px-2 bg-white/5 rounded">Live</span>
          </h2>
          {loading ? (
            <Skeleton className="w-full h-[280px]" />
          ) : chartData.length === 0 ? (
            <div className="w-full h-[280px] flex flex-col items-center justify-center text-text-secondary border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-lg font-display">No trend data available.</p>
              <p className="text-xs mt-2 uppercase tracking-widest opacity-50">Initialize system nodes to begin tracking.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="80%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} prefix="₹" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0f1c', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                  cursor={{ stroke: 'rgba(0,240,255,0.3)', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="avgPrice" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="glass-card p-6 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-3xl"></div>
          <div>
            <h2 className="text-xl font-display font-semibold mb-2">Market Sentiment</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Market stability is currently rated <span className="text-neon-green">Optimal</span>. Prices are trending within expected neural parameters.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Volatility Index</span>
              <span className="text-neon-cyan font-bold">12.4%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-neon-cyan h-full w-[12.4%] shadow-[0_0_10px_#00f0ff]"></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Data Confidence</span>
              <span className="text-neon-green font-bold">98.2%</span>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-neon-green h-full w-[98.2%] shadow-[0_0_10px_#00ffa3]"></div>
            </div>
          </div>
          
          <button className="w-full btn-secondary mt-8 text-xs font-bold uppercase tracking-widest">Generate Report</button>
        </div>
      </div>

      <div className="glass-card p-0 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-xl font-display font-semibold">Live Price Feed</h2>
          <Link to="/commodities" className="text-sm text-neon-cyan hover:underline underline-offset-4">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-text-secondary text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Commodity</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Market</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-12 ml-auto" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-20 ml-auto" /></td>
                  </tr>
                ))
              ) : latestUpdates.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-text-secondary">No data available.</td></tr>
              ) : (
                latestUpdates.map(row => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-medium text-white group-hover:text-neon-cyan transition-colors">{row.commodities?.name}</td>
                    <td className="p-4 text-text-secondary text-sm">{row.commodities?.category}</td>
                    <td className="p-4 text-neon-cyan/80 font-medium">{row.markets?.city}</td>
                    <td className="p-4 text-right font-display font-bold text-lg">₹{row.price}</td>
                    <td className="p-4 text-right text-text-secondary text-xs font-mono">{row.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


