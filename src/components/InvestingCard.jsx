export default function InvestingCard({ title, description, level, icon, levelColor }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5 mb-2.5 shadow-card">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[28px]">{icon}</span>
        <span
          className="text-[11px] font-semibold px-2.5 py-1 rounded-full tracking-wide"
          style={{
            backgroundColor: levelColor + '25',
            color: levelColor
          }}
        >
          {level}
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-text mb-1.5">{title}</h3>
      <p className="text-[13px] text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}