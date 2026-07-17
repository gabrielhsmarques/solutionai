import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { askEducator } from '../services/geminiService'
import InvestingCard from '../components/InvestingCard'

const contentLibrary = {
  debt: [
    {
      icon: '🔴',
      title: 'Why you should pay off debt first',
      description: 'Debt interest rates are almost always higher than investment returns. Paying off debt is the safest "investment" you can make right now.',
      level: 'Beginner',
      levelColor: '#F0605F'
    },
    {
      icon: '⚡',
      title: 'Snowball vs Avalanche method',
      description: 'Snowball: pay the smallest debt first for motivation. Avalanche: pay the highest interest debt first to save money. Both work — pick the one that fits your personality.',
      level: 'Beginner',
      levelColor: '#F0605F'
    },
    {
      icon: '🛡️',
      title: 'Emergency fund while in debt',
      description: 'Even while paying off debt, keep a small emergency fund of $500–$1,000. Without it, any unexpected expense pushes you deeper into debt.',
      level: 'Beginner',
      levelColor: '#F0605F'
    }
  ],
  emergency: [
    {
      icon: '🏦',
      title: 'What is an emergency fund?',
      description: 'An emergency fund is 3 to 6 months of your expenses saved in a liquid account. It protects you from going into debt when life surprises you.',
      level: 'Beginner',
      levelColor: '#E0A93E'
    },
    {
      icon: '📊',
      title: 'Where to keep your emergency fund',
      description: 'Keep it in a high-yield savings account or money market fund — somewhere safe, liquid, and earning at least the inflation rate.',
      level: 'Intermediate',
      levelColor: '#E0A93E'
    },
    {
      icon: '🎯',
      title: 'How to build it faster',
      description: 'Automate a fixed transfer on payday. Treat it like a bill you must pay. Even $50/month adds up to $600 in a year.',
      level: 'Beginner',
      levelColor: '#E0A93E'
    }
  ],
  investing: [
    {
      icon: '📈',
      title: 'Compound interest — the 8th wonder',
      description: 'Money invested early grows exponentially. $100 invested at 10% per year becomes $1,745 in 30 years — without adding anything extra.',
      level: 'Beginner',
      levelColor: '#2ECC8F'
    },
    {
      icon: '🏛️',
      title: 'Index funds for beginners',
      description: 'Instead of picking individual stocks, index funds let you invest in hundreds of companies at once. Lower risk, lower fees, proven long-term returns.',
      level: 'Intermediate',
      levelColor: '#2ECC8F'
    },
    {
      icon: '⚖️',
      title: 'Diversification explained',
      description: 'Never put all your money in one place. Spreading investments across stocks, bonds and real estate reduces the impact of any single loss.',
      level: 'Intermediate',
      levelColor: '#2ECC8F'
    }
  ],
  budget: [
    {
      icon: '📋',
      title: 'The 50/30/20 rule',
      description: '50% of income for needs, 30% for wants, 20% for savings and debt. A simple framework to organize your money without complicated spreadsheets.',
      level: 'Beginner',
      levelColor: '#D4AF37'
    },
    {
      icon: '🔍',
      title: 'Fixed vs variable expenses',
      description: 'Fixed expenses (rent, subscriptions) are predictable. Variable expenses (food, entertainment) are where you have the most control to cut.',
      level: 'Beginner',
      levelColor: '#D4AF37'
    },
    {
      icon: '🤖',
      title: 'Automating your finances',
      description: 'Set up automatic payments for bills and automatic transfers for savings. Automation removes willpower from the equation — it just happens.',
      level: 'Intermediate',
      levelColor: '#D4AF37'
    }
  ]
}

function getStageFromGoal(goal) {
  if (!goal) return 'budget'
  const lower = goal.toLowerCase()
  if (lower.includes('debt')) return 'debt'
  if (lower.includes('emergency')) return 'emergency'
  if (lower.includes('invest')) return 'investing'
  return 'budget'
}

function getStageInfo(stage) {
  const info = {
    debt: { label: '🔴 Focus: Get out of debt first', color: '#F0605F' },
    emergency: { label: '🟡 Focus: Build your safety net', color: '#E0A93E' },
    investing: { label: '🟢 Focus: Grow your wealth', color: '#2ECC8F' },
    budget: { label: '🟡 Focus: Master your budget', color: '#D4AF37' }
  }
  return info[stage]
}

export default function Investing() {
  const { profile } = useFinance()
  const navigate = useNavigate()
  const [geminiInsight, setGeminiInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(true)

  useEffect(() => {
    if (!profile) {
      navigate('/')
      return
    }

    async function fetchInsight() {
      try {
        const question = `Based on my profile, what is the single most important financial action I should take this month? Be specific and encouraging. Max 3 sentences.`
        const insight = await askEducator(question, profile)
        setGeminiInsight(insight)
      } catch (error) {
        setGeminiInsight('Focus on one financial goal at a time. Small consistent actions build lasting wealth.')
      } finally {
        setLoadingInsight(false)
      }
    }

    fetchInsight()
  }, [profile, navigate])

  if (!profile) return null

  const stage = getStageFromGoal(profile.goal)
  const stageInfo = getStageInfo(stage)
  const content = contentLibrary[stage]

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold text-text mb-6">Investing</h1>

      {/* User stage card */}
      <div
        className="bg-surface border border-border rounded-xl p-5 mb-4 shadow-card border-l-4"
        style={{ borderLeftColor: stageInfo.color }}
      >
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-1.5">
          Your Current Stage
        </p>
        <p className="text-[15px] font-semibold" style={{ color: stageInfo.color }}>
          {stageInfo.label}
        </p>
      </div>

      {/* Gemini insight */}
      <div className="bg-primary-light border border-border rounded-xl p-5 mb-6 shadow-card">
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2.5">
          🤖 Your Personalized Next Step
        </p>
        {loadingInsight ? (
          <p className="text-sm text-primary">Generating your recommendation...</p>
        ) : (
          <p className="text-sm text-primary leading-relaxed">{geminiInsight}</p>
        )}
      </div>

      {/* Educational content */}
      <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2.5">
        📚 Recommended For You
      </p>
      <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
        {content.map((item, index) => (
          <InvestingCard key={index} {...item} />
        ))}
      </div>

    </div>
  )
}