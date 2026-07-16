import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { askEducator } from '../services/geminiService'
import InvestingCard from '../components/InvestingCard'

// Content library organized by financial stage.
// Each stage maps to a user goal from the onboarding.
const contentLibrary = {
  debt: [
    {
      icon: '🔴',
      title: 'Why you should pay off debt first',
      description: 'Debt interest rates are almost always higher than investment returns. Paying off debt is the safest "investment" you can make right now.',
      level: 'Beginner',
      levelColor: '#E24B4A'
    },
    {
      icon: '⚡',
      title: 'Snowball vs Avalanche method',
      description: 'Snowball: pay the smallest debt first for motivation. Avalanche: pay the highest interest debt first to save money. Both work — pick the one that fits your personality.',
      level: 'Beginner',
      levelColor: '#E24B4A'
    },
    {
      icon: '🛡️',
      title: 'Emergency fund while in debt',
      description: 'Even while paying off debt, keep a small emergency fund of $500–$1,000. Without it, any unexpected expense pushes you deeper into debt.',
      level: 'Beginner',
      levelColor: '#E24B4A'
    }
  ],
  emergency: [
    {
      icon: '🏦',
      title: 'What is an emergency fund?',
      description: 'An emergency fund is 3 to 6 months of your expenses saved in a liquid account. It protects you from going into debt when life surprises you.',
      level: 'Beginner',
      levelColor: '#BA7517'
    },
    {
      icon: '📊',
      title: 'Where to keep your emergency fund',
      description: 'Keep it in a high-yield savings account or money market fund — somewhere safe, liquid, and earning at least the inflation rate.',
      level: 'Intermediate',
      levelColor: '#BA7517'
    },
    {
      icon: '🎯',
      title: 'How to build it faster',
      description: 'Automate a fixed transfer on payday. Treat it like a bill you must pay. Even $50/month adds up to $600 in a year.',
      level: 'Beginner',
      levelColor: '#BA7517'
    }
  ],
  investing: [
    {
      icon: '📈',
      title: 'Compound interest — the 8th wonder',
      description: 'Money invested early grows exponentially. $100 invested at 10% per year becomes $1,745 in 30 years — without adding anything extra.',
      level: 'Beginner',
      levelColor: '#1D9E75'
    },
    {
      icon: '🏛️',
      title: 'Index funds for beginners',
      description: 'Instead of picking individual stocks, index funds let you invest in hundreds of companies at once. Lower risk, lower fees, proven long-term returns.',
      level: 'Intermediate',
      levelColor: '#1D9E75'
    },
    {
      icon: '⚖️',
      title: 'Diversification explained',
      description: 'Never put all your money in one place. Spreading investments across stocks, bonds and real estate reduces the impact of any single loss.',
      level: 'Intermediate',
      levelColor: '#1D9E75'
    }
  ],
  budget: [
    {
      icon: '📋',
      title: 'The 50/30/20 rule',
      description: '50% of income for needs, 30% for wants, 20% for savings and debt. A simple framework to organize your money without complicated spreadsheets.',
      level: 'Beginner',
      levelColor: '#534AB7'
    },
    {
      icon: '🔍',
      title: 'Fixed vs variable expenses',
      description: 'Fixed expenses (rent, subscriptions) are predictable. Variable expenses (food, entertainment) are where you have the most control to cut.',
      level: 'Beginner',
      levelColor: '#534AB7'
    },
    {
      icon: '🤖',
      title: 'Automating your finances',
      description: 'Set up automatic payments for bills and automatic transfers for savings. Automation removes willpower from the equation — it just happens.',
      level: 'Intermediate',
      levelColor: '#534AB7'
    }
  ]
}

// Maps the user goal from onboarding to a content stage
function getStageFromGoal(goal) {
  if (!goal) return 'budget'
  const lower = goal.toLowerCase()
  if (lower.includes('debt')) return 'debt'
  if (lower.includes('emergency')) return 'emergency'
  if (lower.includes('invest')) return 'investing'
  return 'budget'
}

// Returns a label and color for each stage
function getStageInfo(stage) {
  const info = {
    debt: { label: '🔴 Focus: Get out of debt first', color: '#E24B4A' },
    emergency: { label: '🟡 Focus: Build your safety net', color: '#BA7517' },
    investing: { label: '🟢 Focus: Grow your wealth', color: '#1D9E75' },
    budget: { label: '🔵 Focus: Master your budget', color: '#534AB7' }
  }
  return info[stage]
}

export default function Investing() {
  const { profile } = useFinance()
  const navigate = useNavigate()
  const [geminiInsight, setGeminiInsight] = useState('')
  const [loadingInsight, setLoadingInsight] = useState(true)

  // Redirects to onboarding if there is no profile
  useEffect(() => {
    if (!profile) {
      navigate('/')
      return
    }

    // Asks Gemini for a personalized next step recommendation
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
    <div style={styles.container}>
      <div style={styles.content}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Investing</h1>
        </div>

        {/* User stage card */}
        <div style={{
          ...styles.stageCard,
          borderLeft: `4px solid ${stageInfo.color}`
        }}>
          <p style={styles.stageLabel}>YOUR CURRENT STAGE</p>
          <p style={{ ...styles.stageText, color: stageInfo.color }}>
            {stageInfo.label}
          </p>
        </div>

        {/* Gemini personalized insight */}
        <div style={styles.insightCard}>
          <p style={styles.sectionTitle}>🤖 YOUR PERSONALIZED NEXT STEP</p>
          {loadingInsight ? (
            <p style={styles.loadingText}>Generating your recommendation...</p>
          ) : (
            <p style={styles.insightText}>{geminiInsight}</p>
          )}
        </div>

        {/* Educational content cards */}
        <p style={styles.sectionTitle}>📚 RECOMMENDED FOR YOU</p>
        {content.map((item, index) => (
          <InvestingCard key={index} {...item} />
        ))}

      </div>
    </div>
  )
}

const styles = {
  container: {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: '1.5rem 3rem'
  },
  content: {
    width: '100%'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.25rem'
  },
  title: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  stageCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  stageLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    letterSpacing: '0.06em',
    marginBottom: '6px'
  },
  stageText: {
    fontSize: '15px',
    fontWeight: '600'
  },
  insightCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: '12px',
    padding: '1rem 1.25rem',
    marginBottom: '1.25rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  sectionTitle: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#888',
    letterSpacing: '0.06em',
    marginBottom: '10px'
  },
  loadingText: {
    fontSize: '14px',
    color: '#534AB7'
  },
  insightText: {
    fontSize: '14px',
    color: '#534AB7',
    lineHeight: '1.6'
  }
}