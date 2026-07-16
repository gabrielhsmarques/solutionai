export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex items-end gap-2 mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>

      {!isUser && (
        <div className="text-xl flex-shrink-0">🤖</div>
      )}

      <div className={`
        max-w-[75%] px-3.5 py-2.5 rounded-2xl shadow-card
        ${isUser ? 'bg-primary rounded-br-sm' : 'bg-white rounded-bl-sm'}
      `}>
        <p className={`text-sm leading-relaxed m-0 ${isUser ? 'text-white' : 'text-gray-900'}`}>
          {message.content}
        </p>
        <p className={`text-[11px] mt-1 ${isUser ? 'text-white/60 text-right' : 'text-gray-300 text-left'}`}>
          {message.time}
        </p>
      </div>

      {isUser && (
        <div className="text-xl flex-shrink-0">👤</div>
      )}
    </div>
  )
}