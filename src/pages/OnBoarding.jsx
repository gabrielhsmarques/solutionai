import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'

const questions = [
  {
    id: 'name',
    label: 'What is your name?',
    type: 'text',
    placeholder: 'Ex: John Smith'
  },
  {
    id: 'income',
    label: 'What is your monthly income?',
    type: 'number',
    placeholder: 'Ex: 3200'
  },
  {
    id: 'debt',
    label: 'What is your total debt amount?',
    type: 'number',
    placeholder: 'Ex: 8400'
  },
  {
    id: 'dependents',
    label: 'How many people depend on you financially?',
    type: 'number',
    placeholder: 'Ex: 2'
  },
  {
    id: 'goal',
    label: 'What is your main financial goal?',
    type: 'select',
    options: [
      'Get out of debt',
      'Build an emergency fund',
      'Start investing',
      'Organize my budget'
    ]
  }
]

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [currentValue, setCurrentValue] = useState('')
  const { saveProfile } = useFinance()
  const navigate = useNavigate()

  const question = questions[currentStep]
  const progress = (currentStep / questions.length) * 100

  function handleNext() {
    if (!currentValue) return

    const updatedAnswers = { ...answers, [question.id]: currentValue }
    setAnswers(updatedAnswers)
    setCurrentValue('')

    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1)
    } else {
      saveProfile(updatedAnswers)
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.progressTrack}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
        <p style={styles.stepText}>
          Step {currentStep + 1} of {questions.length}
        </p>

        <h2 style={styles.question}>{question.label}</h2>

        {question.type === 'select' ? (
          <div style={styles.optionsGrid}>
            {question.options.map(option => (
              <button
                key={option}
                onClick={() => setCurrentValue(option)}
                style={{
                  ...styles.optionBtn,
                  ...(currentValue === option ? styles.optionSelected : {})
                }}
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <input
            type={question.type}
            placeholder={question.placeholder}
            value={currentValue}
            onChange={e => setCurrentValue(e.target.value)}
            style={styles.input}
          />
        )}

        <button
          onClick={handleNext}
          disabled={!currentValue}
          style={{
            ...styles.nextButton,
            ...(!currentValue ? styles.buttonDisabled : {})
          }}
        >
          {currentStep + 1 === questions.length ? 'Finish' : 'Next'}
        </button>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: '1rem'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
  },
  progressTrack: {
    height: '6px',
    backgroundColor: '#e0e0e0',
    borderRadius: '99px',
    marginBottom: '8px',
    overflow: 'hidden'
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#534AB7',
    borderRadius: '99px',
    transition: 'width 0.4s ease'
  },
  stepText: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '1.5rem'
  },
  question: {
    fontSize: '20px',
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: '1.25rem',
    lineHeight: '1.4'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '1.25rem',
    outline: 'none'
  },
  optionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '1.25rem'
  },
  optionBtn: {
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s'
  },
  optionSelected: {
    backgroundColor: '#534AB7',
    color: '#fff',
    borderColor: '#534AB7'
  },
  nextButton: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '500',
    backgroundColor: '#534AB7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
}