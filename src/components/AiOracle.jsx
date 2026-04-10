import { useState } from 'react';
import { LuBot as Bot, LuX as X, LuZap as Zap, LuSparkles as Sparkles, LuSend as Send } from 'react-icons/lu';

export default function AiOracle() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'system', content: 'Neural connection established. I am your Market Oracle. How can I assist with your predictive modeling today?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: inputMsg }]);
    setInputMsg('');
    
    // Simulate premium AI typing
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: `Analyzing neural pathways for relevant market trends... Processing massive commodity ledger. Note: This is an exclusive Pro feature visualization.`
      }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-neon-purple to-neon-cyan shadow-[0_0_20px_rgba(176,0,255,0.4)] flex items-center justify-center hover:scale-110 transition-transform z-50 ${isOpen ? 'scale-0 opacity-0 relative z-[-1]' : 'scale-100 opacity-100'}`}
      >
        <Bot className="w-6 h-6 text-white" />
        <div className="absolute top-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-background"></div>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-80 md:w-96 glass-card shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.2)] border-neon-cyan/20 flex flex-col overflow-hidden transition-all duration-500 z-50 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}>
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-surface-lowest flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-green"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
              <Bot className="w-5 h-5 text-neon-cyan" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neon-green rounded-full"></div>
            </div>
            <div>
              <h4 className="text-white font-display font-bold text-sm flex items-center gap-2">Market Oracle <span className="text-[8px] bg-neon-purple text-white px-1.5 py-0.5 rounded uppercase tracking-widest font-black">Pro</span></h4>
              <p className="text-[10px] text-neon-green uppercase tracking-widest font-mono flex items-center gap-1"><Zap className="w-3 h-3"/> Neural Interlinked</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white transition-colors relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="h-80 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-surface/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-white/10 text-white rounded-br-sm' : 'bg-surface-lowest border border-white/5 text-text-secondary rounded-bl-sm shadow-[0_0_10px_rgba(0,240,255,0.05)]'}`}>
                {msg.role === 'system' && i === 0 && <Sparkles className="w-4 h-4 text-neon-cyan mb-2" />}
                {msg.content}
              </div>
              <span className="text-[10px] text-text-secondary/50 mt-1 uppercase font-mono">{msg.role === 'user' ? 'You' : 'Oracle AI'}</span>
            </div>
          ))}
        </div>

        {/* Input Footer */}
        <div className="p-3 bg-surface-lowest border-t border-white/10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input 
              type="text" 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Query predictive models..." 
              className="w-full bg-surface border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder:text-text-secondary/50 focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all"
            />
            <button type="submit" className="absolute right-2 w-8 h-8 rounded-full bg-white/5 hover:bg-neon-cyan/20 flex items-center justify-center text-text-secondary hover:text-neon-cyan transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
