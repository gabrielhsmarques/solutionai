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
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <div className="bg-surface border border-border rounded-2xl p-8 w-full max-w-[480px] shadow-modal">

        {/* Progress bar */}
        <div className="h-1.5 bg-border rounded-full mb-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[13px] text-text-muted mb-6">
          Step {currentStep + 1} of {questions.length}
        </p>

        {/* Question */}
        <h2 className="text-xl font-medium text-text mb-5 leading-snug">
          {question.label}
        </h2>

        {/* Input — text/number or select options */}
        {question.type === 'select' ? (
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {question.options.map(option => (
              <button
                key={option}
                onClick={() => setCurrentValue(option)}
                className={`
                  p-3 text-sm rounded-lg border text-center transition-all
                  ${currentValue === option
                    ? 'bg-primary text-black border-primary font-medium'
                    : 'bg-bg text-text border-border hover:border-primary'
                  }
                `}
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
            className="
              w-full px-4 py-3 text-base rounded-lg mb-5
              bg-bg border border-border text-text outline-none
              placeholder:text-text-muted/50
              focus:border-primary transition-colors
            "
          />
        )}

        {/* Next / Finish button */}
        <button
          onClick={handleNext}
          disabled={!currentValue}
          className={`
            w-full py-3.5 text-base font-medium rounded-lg transition-colors
            ${currentValue
              ? 'bg-primary text-black cursor-pointer hover:bg-primary-dark'
              : 'bg-border text-text-muted cursor-not-allowed'
            }
          `}
        >
          {currentStep + 1 === questions.length ? 'Finish' : 'Next'}
        </button>

      </div>
    </div>
  )
}