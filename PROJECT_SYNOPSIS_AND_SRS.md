# Market Price Monitor
## Project Synopsis & Software Requirements Specification

---

## 1. Project Synopsis

### 1.1 Project Title
**Market Price Monitor** (also known as Neural Ledger Monitor)

### 1.2 Objective
To build a highly animated, full-stack, futuristic web application that tracks, aggregates, and compares agricultural commodity prices across different regional markets. The platform will serve both end-users (seeking real-time market trends) and administrators (managing price volatility, market nodes, and asset lists) via a centralized "Neural Ledger".

### 1.3 Overview
The Market Price Monitor is engineered as a modern, high-fidelity platform offering "sub-nanosecond" simulated syncing capabilities (via Supabase webhooks/real-time streaming). The application utilizes a dark-mode, glassmorphism-inspired UI ("Luminescent Observatory" design system), projecting a premium, intelligence-oriented aesthetic. Users can visualize data using predictive trend graphs, examine local market node prices, and digest complex market sentiment indicators. 

### 1.4 Scope
- **Data Aggregation:** Consolidate agricultural prices.
- **Visual Analytics:** Present data in interactive chart forms outlining price tracking and historical trends.
- **Real-Time Data Streaming:** Real-time updates delivered globally without user-refresh.
- **Centralized Admin Console:** An interface for adding commodities, deploying market nodes (locations), and maintaining a "Bulk Ledger" of active prices.

### 1.5 Technology Stack
- **Frontend Framework:** React 18, Vite.
- **Styling:** Tailwind CSS (v4.x) with custom theming (Neon cyans/purples/greens).
- **Icons & Graphics:** Lucide-React / React-Icons, Recharts (for graphing).
- **Routing:** React Router v7.
- **Backend/Database:** Supabase (PostgreSQL, Supabase Authentication, Real-time channels).

---

## 2. Software Requirements Specification (SRS)

### 2.1 User Categories
1. **General Visitors / Analysts:** External users analyzing market trends, commodity price differences, and live feeds.
2. **Administrators (SysAdmins):** Authenticated users responsible for deploying geographic nodes, adding asset listings, and managing bulk price ledgers.

### 2.2 Functional Requirements

#### 2.2.1 Authentication System
- The system must provide a secure login and signup portal restricted to Administrative users.
- The system must restrict the `/admin` command console strictly to authenticated personnel via Supabase Auth.

#### 2.2.2 System Dashboard
- The system must display aggregated global statistics (Total Price Points, Active Commodities, Tracked Markets).
- The system must render a temporal trend chart (using Recharts) representing average asset prices correlated over a 15-day/data-point window.
- The system must calculate and display simulated metadata such as "Market Stability", "Volatility Index", and "Data Confidence".
- The system must listen to Supabase Postgres real-time channels and update the Dashboard without requiring page reloads.

#### 2.2.3 Live Price Feed & Market Comparison
- The system must host a continuous feed showcasing the latest logged prices across varying commodities and geographic nodes.
- The system must allow users to view distinct details categorized by Asset (e.g., Tomato, Onion), Category (e.g., Vegetables), Market Node (e.g., Mumbai, Delhi), and recorded Price.
- The system must provide comparisons across diverse markets to expose arbitrage or regional shifts.

#### 2.2.4 Administrator Command Console
- **Asset Registration:** Admin must be able to add a new commodity (Asset Name, Category).
- **Node Deployment:** Admin must be able to add new geographic markets (City, State).
- **Directory Deletion:** Admin must have the power to instantly terminate/delete any commodity or market node from the database.
- **Bulk Asset Ledger:** An advanced spreadsheet-like table where admins can input real-time bulk data updates across all node-to-commodity intersections.
   - The ledger must highlight variance deltas (e.g., a green `-10%` or red `+15%` jump).
   - The ledger must package modified prices into a payload that synchronizes globally to the Supabase database.

### 2.3 Non-Functional Requirements

#### 2.3.1 Performance & Scalability
- The web app must launch gracefully with progressive loading states (using Skeleton loaders).
- Data calls to Supabase should be mapped successfully under optimistic UI updates.

#### 2.3.2 User Interface & Experience
- Must strictly stick to a dark-mode "Luminescent Observatory" aesthetic.
- Glassmorphic panels, animated pulse indicators, neon borders, and gradient typography must exist on all module pages.
- Must be fully responsive across mobile, tablet, and desktop viewports.

#### 2.3.3 Security
- No unauthorized edits can be performed. The Supabase Row Level Security (RLS) policies should strictly align with the Front-End's authenticated Admin lock context.
- Passwords must be handled and encrypted natively by Supabase Auth protocols.

### 2.4 Database Schema Definitions (Supabase)
1. **Commodities Table:** `id`, `name` (e.g., Tomato), `category` (e.g., Vegetables). 
2. **Markets Table:** `id`, `city` (e.g., Mumbai), `state` (e.g., Maharashtra).
3. **Prices Table:** `id`, `commodity_id` (Foreign Key), `market_id` (Foreign Key), `price` (value in ₹), `date`, `created_at`.

### 2.5 Future Scope
- User Portfolio tracking for traders.
- API integration with real-world scraping nodes.
- Machine Learning (AI Oracle) based automated price speculations instead of calculated fixed values.
