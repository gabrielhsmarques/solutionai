# 💰 Financial Educator — AI-Powered Personal Finance Assistant

> An intelligent financial education platform that helps people manage debt, track expenses, and build healthy money habits — powered by Google's Gemini AI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Gemini API](https://img.shields.io/badge/Gemini-2.5--flash--lite-4285F4?logo=google&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📖 About the Project

**Financial Educator** was built as part of a **Digital Innovation One (DIO)** learning project, with a clear mission: help people who struggle to manage debt and income build real financial literacy — not through generic advice, but through **personalized, AI-driven guidance** based on their actual financial profile.

Every recommendation, tip, and piece of educational content adapts to the user's income, debt level, dependents, and goals — making financial education feel relevant instead of generic.

This project was developed with an **explanation-first, incremental approach**: every architectural decision was deliberately understood before implementation, rather than copy-pasted. It reflects a real learning journey — including debugging, refactoring, and iterative product decisions along the way.

---

## ✨ Features

### 🧭 Onboarding
A guided, step-by-step questionnaire that builds the user's financial profile — name, income, debt, dependents, and primary goal — without overwhelming a first-time user.

### 📊 Dashboard
A live financial command center featuring:
- **Real-time metrics** — total income, total spent, and leftover balance (including negative balances, shown transparently instead of clamped to zero)
- **Debt payoff progress bar** — automatically calculated from registered debt payments
- **Expense breakdown by category**
- **AI-generated daily tip**, personalized to the user's profile
- **Editable financial goal** — users can update their goal at any time without losing their profile history; new debt amounts are **added** to the existing debt rather than overwriting it

### 💸 Expenses
Track real spending across categories (Housing, Food, Transport, Health, Entertainment, Other) — deliberately separated from income and debt payments to avoid distorting the financial summary.

### 💰 Income & Payments
A dedicated module for extra income (freelance work, gifts, sales) **and** debt payments — kept separate from expenses since paying off debt is a transfer of wealth, not a cost.

### 🤖 AI Educator (Chat)
A conversational financial advisor powered by Gemini, aware of the user's full profile. Includes:
- Suggested starter questions
- Persistent conversation history within the session
- Retry logic to gracefully handle API rate limits

### 📈 Investing
Educational content that **adapts to the user's financial stage** — someone focused on debt sees different material than someone ready to invest. Includes a Gemini-generated personalized "next step" recommendation.

### 🔐 Security
All financial data persisted in `localStorage` is **AES-encrypted** before being written to disk — protecting sensitive information (income, debt, spending habits) from being read in plain text via browser dev tools or malicious extensions.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS v4 (with custom design tokens) |
| Routing | React Router DOM |
| State Management | React Context API |
| Persistence | localStorage (AES-encrypted via `crypto-js`) |
| AI | Google Gemini API (`gemini-2.5-flash-lite`) |
| Package Manager | pnpm |
| Font | Inter (Google Fonts) |

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── Navbar.jsx           # Responsive sidebar (desktop) / bottom nav (mobile)
│   ├── ExpenseForm.jsx
│   ├── ExpenseList.jsx
│   ├── IncomeForm.jsx
│   ├── IncomeList.jsx
│   ├── ChatMessage.jsx
│   └── InvestingCard.jsx
├── pages/
│   ├── Onboarding.jsx
│   ├── Dashboard.jsx
│   ├── Expenses.jsx
│   ├── Income.jsx
│   ├── Chat.jsx
│   └── Investing.jsx
├── context/
│   └── FinanceContext.jsx   # Global state + encrypted persistence
├── services/
│   └── geminiService.js     # Gemini API integration with retry logic
├── utils/
│   └── crypto.js            # AES encryption/decryption helpers
├── App.jsx                  # Routing + layout composition
├── main.jsx                 # App entry point
└── index.css                # Tailwind config + design tokens (@theme)
```

### Key Architectural Decisions

- **Separation of financial concerns**: Expenses, Income, and Debt Payments are tracked independently to keep the financial summary mathematically honest — debt repayment is never counted as a monthly "expense."
- **Encrypted local persistence**: All `FinanceContext` state is encrypted with AES before hitting `localStorage`, and transparently decrypted on load.
- **Resilient AI integration**: `geminiService.js` implements a retry-with-backoff strategy (`generateWithRetry`) to handle the free tier's rate limits (`429`) and transient server overload (`503`) gracefully.
- **Design system via Tailwind `@theme`**: All colors, shadows, and typography are defined once as CSS custom properties, giving the whole app a single source of visual truth.
- **Responsive-first navigation**: A single `Navbar` component adapts from a fixed sidebar (desktop) to a bottom tab bar (mobile) using Tailwind's responsive variants — no separate mobile component needed.

---

## 🎨 Design

The interface uses a custom **dark + gold** visual identity:

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#0D0D0F` | App background |
| `--color-surface` | `#1A1A1D` | Cards, panels |
| `--color-primary` | `#D4AF37` | Accent, CTAs, active states |
| `--color-success` | `#2ECC8F` | Positive balances, income |
| `--color-danger` | `#F0605F` | Negative balances, expenses |

Desktop-first, fully responsive down to mobile breakpoints.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org) (LTS recommended)
- [pnpm](https://pnpm.io)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/financial-educator.git
cd financial-educator

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> Get a free API key at [Google AI Studio](https://aistudio.google.com).

### Run locally

```bash
pnpm dev
```

Visit `http://localhost:5173`.

---

## 🧠 What I Learned

This project was built with a strong focus on **understanding**, not just shipping. Some highlights:

- Designing state architecture with React Context and `localStorage` persistence
- Handling real-world API constraints (rate limits, retries, model versioning) with the Gemini API
- Implementing client-side encryption to protect sensitive financial data
- Migrating an entire inline-styled React app to Tailwind CSS v4 incrementally, without breaking functionality
- Making product decisions based on user experience reasoning (e.g., why debt payments shouldn't count as expenses, why leftover balance shouldn't be clamped to zero)
- Debugging real-world issues: encoding mismatches, stale Vite caches, case-sensitive file conflicts on Windows, and API versioning errors

---

## 📌 Roadmap

- [ ] Data visualization with charts (spending trends over time)
- [ ] Export financial summary as PDF
- [ ] Multi-currency support
- [ ] Backend integration for cross-device sync

---

## 👤 Author

**Gabriel** — built as part of the [Digital Innovation One](https://www.dio.me) learning community.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
