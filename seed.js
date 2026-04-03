import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding data...");

  // 1. Add Commodities
  const { data: commodities, error: cErr } = await supabase.from('commodities').insert([
    { name: 'Tomato', category: 'Vegetables' },
    { name: 'Onion', category: 'Vegetables' },
    { name: 'Rice', category: 'Grains' },
    { name: 'Gold', category: 'Metals' },
    { name: 'Apple', category: 'Fruits' }
  ]).select();

  if (cErr) {
    console.error("Error seeding commodities:", cErr);
    return;
  }
  console.log("Joined commodities.");

  // 2. Add Markets
  const { data: markets, error: mErr } = await supabase.from('markets').insert([
    { city: 'Mumbai', state: 'Maharashtra' },
    { city: 'Delhi', state: 'Delhi' },
    { city: 'Bangalore', state: 'Karnataka' },
    { city: 'Chennai', state: 'Tamil Nadu' }
  ]).select();

  if (mErr) {
    console.error("Error seeding markets:", mErr);
    return;
  }
  console.log("Joined markets.");

  // 3. Add Prices (randomized)
  const prices = [];
  const now = new Date();
  
  commodities.forEach(c => {
    markets.forEach(m => {
      // Create a few price points for each
      for (let i = 0; i < 5; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 2); // Spread them out
        prices.push({
          commodity_id: c.id,
          market_id: m.id,
          price: Math.floor(Math.random() * 80) + 30,
          date: date.toISOString().split('T')[0]
        });
      }
    });
  });

  const { error: pErr } = await supabase.from('prices').insert(prices);
  if (pErr) console.error("Error seeding prices:", pErr);
  else console.log("Seeded prices successfully!");
}

seed();
