import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { askEducator } from '../services/geminiService'
import ChatMessage from '../components/ChatMessage'

export default function Chat() {
  const { profile } = useFinance()
  const navigate = useNavigate()

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: `Hi ${profile?.name || 'there'}! 👋 I'm your personal financial educator. Ask me anything about budgeting, debt, saving, or investing!`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!profile) navigate('/')
  }, [profile, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  async function handleSend() {
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      time: getCurrentTime()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await askEducator(input.trim(), profile)
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response,
        time: getCurrentTime()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: 'Sorry, I had trouble connecting. Please try again in a moment.',
        time: getCurrentTime()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const suggestions = [
    'How do I get out of debt faster?',
    'What is an emergency fund?',
    'How do I start investing?',
    'How can I cut my expenses?'
  ]

  return (
    <div className="flex flex-col h-screen bg-bg">

      {/* Header */}
      <div className="px-8 py-4 bg-surface border-b border-border flex-shrink-0 max-md:px-4">
        <h1 className="text-base font-semibold text-text">AI Educator</h1>
        <p className="text-xs text-text-muted">Powered by Gemini</p>
      </div>

      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto px-8 py-5 max-md:px-4">

        {messages.length === 1 && (
          <div className="flex flex-col gap-2 mb-5">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setInput(suggestion)}
                className="text-left px-3.5 py-2.5 bg-surface border border-border rounded-xl text-[13px] text-primary hover:bg-primary-light transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {loading && (
          <div className="flex items-end gap-2 mb-3">
            <div className="text-xl flex-shrink-0">🤖</div>
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-card">
              <div className="flex gap-1.5 items-center">
                <div className="w-[7px] h-[7px] rounded-full bg-primary animate-bounce2" />
                <div className="w-[7px] h-[7px] rounded-full bg-primary animate-bounce2 [animation-delay:0.2s]" />
                <div className="w-[7px] h-[7px] rounded-full bg-primary animate-bounce2 [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Fixed input area */}
      <div className="flex gap-2 px-8 py-4 bg-surface border-t border-border flex-shrink-0 max-md:px-4">
        <input
          type="text"
          placeholder="Ask your financial question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 px-3.5 py-2.5 text-[15px] rounded-xl bg-bg border border-border text-text placeholder:text-text-muted/50 outline-none focus:border-primary transition-colors"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className={`
            w-11 h-11 rounded-xl text-lg flex items-center justify-center transition-colors
            ${!input.trim() || loading
              ? 'bg-border text-text-muted cursor-not-allowed'
              : 'bg-primary text-black hover:bg-primary-dark cursor-pointer'
            }
          `}
        >
          ➤
        </button>
      </div>

    </div>
  )
}