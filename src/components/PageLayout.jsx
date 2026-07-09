// Shared layout component used by all pages except Dashboard
// Ensures consistent width, padding and structure across the app
export default function PageLayout({ title, children }) {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>{title}</h1>
        {children}
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
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '1.5rem'
  }
}