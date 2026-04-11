import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fnlhvvsbfnycnnhffjzf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZubGh2dnNiZm55Y25uaGZmanpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3NzE5OTQsImV4cCI6MjA5MDM0Nzk5NH0.iB-NAAFcp5dwnaJmKwbTJj75r8fUOhWO2ruWTEGodyw'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
  const { data, error } = await supabase
    .from('prices')
    .select(`
      id, price, date, created_at,
      commodity_id, market_id,
      commodities (name),
      markets (city)
    `)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) console.error(error)
  else {
    console.log(JSON.stringify(data, null, 2))
  }
}

test()
