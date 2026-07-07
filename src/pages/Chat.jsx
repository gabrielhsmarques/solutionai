import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { askEducator } from '../services/geminiService'
import ChatMessage from '../components/ChatMessage'

export default function Chat() {
  const { profile } = useFinance()
  const navigate = useNavigate()

  // messages stores the full conversation history
  // We start with a welcome message from the AI
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: `Hi ${profile?.name || 'there'}! 👋 I'm your personal financial educator. Ask me anything about budgeting, debt, saving, or investing!`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ])

  // Controls the input field value
  const [input, setInput] = useState('')

  // Controls the loading state while waiting for Gemini
  const [loading, setLoading] = useState(false)

  // This ref points to the bottom of the message list
  // so we can auto-scroll when a new message arrives
  const bottomRef = useRef(null)

  // Redirects to onboarding if there is no profile
  useEffect(() => {
    if (!profile) navigate('/')
  }, [profile, navigate])

  // Auto-scrolls to the latest message every time
  // the messages array changes
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
    // Prevents sending empty messages or sending while loading
    if (!input.trim() || loading) return

    // Builds the user message object
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      time: getCurrentTime()
    }

    // Adds user message to the conversation
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Sends the question to Gemini along with the user profile
      const response = await askEducator(input.trim(), profile)

      // Builds the AI response message object
      const aiMessage = {
        id: Date.now() + 1,
        role: 'ai',
        content: response,
        time: getCurrentTime()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      // Shows a fallback message if Gemini fails
      console.error('Gemini chat error:', error)
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

  // Allows sending the message by pressing Enter
  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Suggestion chips — quick questions the user can tap
  const suggestions = [
    'How do I get out of debt faster?',
    'What is an emergency fund?',
    'How do I start investing?',
    'How can I cut my expenses?'
  ]

  return (
    <div style={styles.container}>

      {/* Fixed header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate('/dashboard')}
          style={styles.backBtn}
        >
          ← Back
        </button>
        <div>
          <h1 style={styles.title}>AI Educator</h1>
          <p style={styles.subtitle}>Powered by Gemini</p>
        </div>
      </div>

      {/* Scrollable message area */}
      <div style={styles.messagesArea}>

        {/* Suggestion chips — shown only at the start */}
        {messages.length === 1 && (
          <div style={styles.suggestions}>
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                style={styles.chip}
                onClick={() => {
                  setInput(suggestion)
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Renders each message using the ChatMessage component */}
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Loading indicator while waiting for Gemini */}
        {loading && (
          <div style={styles.loadingWrapper}>
            <div style={styles.avatar}>🤖</div>
            <div style={styles.loadingBubble}>
              <div style={styles.loadingDots}>
                <div style={styles.dot} />
                <div style={{ ...styles.dot, animationDelay: '0.2s' }} />
                <div style={{ ...styles.dot, animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        {/* Invisible element at the bottom for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* Fixed input area at the bottom */}
      <div style={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask your financial question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            ...styles.sendBtn,
            ...(!input.trim() || loading ? styles.sendBtnDisabled : {})
          }}
        >
          ➤
        </button>
      </div>

    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    maxWidth: '480px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    flexShrink: 0
  },
  backBtn: {
    fontSize: '14px',
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#555'
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a'
  },
  subtitle: {
    fontSize: '12px',
    color: '#888'
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.25rem'
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '1.25rem'
  },
  chip: {
    padding: '10px 14px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '12px',
    fontSize: '13px',
    color: '#534AB7',
    cursor: 'pointer',
    textAlign: 'left'
  },
  loadingWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '12px'
  },
  avatar: {
    fontSize: '20px',
    flexShrink: 0
  },
  loadingBubble: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    borderBottomLeftRadius: '4px',
    padding: '12px 16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  loadingDots: {
    display: 'flex',
    gap: '5px',
    alignItems: 'center'
  },
  dot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: '#534AB7',
    animation: 'bounce 0.8s infinite alternate'
  },
  inputArea: {
    display: 'flex',
    gap: '8px',
    padding: '1rem 1.25rem',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    flexShrink: 0
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '12px',
    outline: 'none',
    backgroundColor: '#f9f9f9'
  },
  sendBtn: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    backgroundColor: '#534AB7',
    color: '#fff',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  sendBtnDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed'
  }
}