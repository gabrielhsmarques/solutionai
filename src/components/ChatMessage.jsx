// This component renders a single chat message.
// It changes its appearance based on whether
// the message was sent by the user or the AI.
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div style={{
      ...styles.wrapper,
      justifyContent: isUser ? 'flex-end' : 'flex-start'
    }}>
      {/* AI avatar — only shown for AI messages */}
      {!isUser && (
        <div style={styles.avatar}>🤖</div>
      )}

      <div style={{
        ...styles.bubble,
        ...(isUser ? styles.userBubble : styles.aiBubble)
      }}>
        <p style={{
          ...styles.text,
          color: isUser ? '#fff' : '#1a1a1a'
        }}>
          {message.content}
        </p>
        <p style={{
          ...styles.time,
          color: isUser ? 'rgba(255,255,255,0.6)' : '#aaa',
          textAlign: isUser ? 'right' : 'left'
        }}>
          {message.time}
        </p>
      </div>

      {/* User avatar — only shown for user messages */}
      {isUser && (
        <div style={styles.avatar}>👤</div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
    marginBottom: '12px'
  },
  avatar: {
    fontSize: '20px',
    flexShrink: 0
  },
  bubble: {
    maxWidth: '75%',
    padding: '10px 14px',
    borderRadius: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  userBubble: {
    backgroundColor: '#534AB7',
    borderBottomRightRadius: '4px'
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: '4px'
  },
  text: {
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0
  },
  time: {
    fontSize: '11px',
    marginTop: '4px'
  }
}