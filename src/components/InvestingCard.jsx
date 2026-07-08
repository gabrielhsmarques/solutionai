// This component renders a single educational content card.
// It receives title, description, level and an emoji icon as props.
export default function InvestingCard({ title, description, level, icon, levelColor }) {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.icon}>{icon}</span>
        <span style={{
          ...styles.levelBadge,
          backgroundColor: levelColor + '20',
          color: levelColor
        }}>
          {level}
        </span>
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.description}>{description}</p>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    marginBottom: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  icon: {
    fontSize: '28px'
  },
  levelBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '99px',
    letterSpacing: '0.04em'
  },
  title: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '6px'
  },
  description: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.6'
  }
}