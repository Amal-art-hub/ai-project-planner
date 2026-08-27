import { useState } from 'react'

function App() {
  const [description, setDescription] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)




  const handleGeneratePlan = async () => {
  if (!description.trim()) return
  setLoading(true)
  setResponse('')

  try {
    const res = await fetch('http://localhost:5000/api/project/plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requirement: description }),
    })

    const data = await res.json()
    
    if (res.ok) {
      setResponse(data.plan)
    } else {
      setResponse(`Error: ${data.error}`)
    }
  } catch (error) {
    setResponse('Failed to connect to backend server. Make sure node index.js is running on port 5000.')
  } finally {
    setLoading(false)
  }
}

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {/* Container Card */}
      <div style={{
        width: '100%',
        maxWidth: '650px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        padding: '32px'
      }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(to right, #818cf8, #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI Project Planner
          </h1>
        </div>

        {/* Input Label & Textarea */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '15px', fontWeight: '500', color: '#94a3b8', marginBottom: '8px' }}>
            Describe your project:
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I want to build an ecommerce app with user authentication and payment gateway"
            style={{
              width: '100%',
              backgroundColor: '#0f172a',
              color: '#f8fafc',
              border: '1px solid #334155',
              borderRadius: '10px',
              padding: '14px',
              fontSize: '15px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              lineHeight: '1.5'
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading || !description.trim()}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            background: description.trim() ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#334155',
            border: 'none',
            borderRadius: '10px',
            cursor: description.trim() ? 'pointer' : 'not-allowed',
            boxShadow: description.trim() ? '0 4px 14px 0 rgba(99, 102, 241, 0.4)' : 'none',
            transition: 'all 0.2s'
          }}
        >
          {loading ? 'Generating Plan...' : '✨ Generate Plan'}
        </button>

        {/* Response Area */}
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#94a3b8', marginBottom: '10px' }}>
            AI Response:
          </h3>
          <div style={{
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '16px',
            minHeight: '100px',
            color: '#e2e8f0',
            fontSize: '14px',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>
            {response || (loading ? 'Analyzing project details...' : 'Describe your project above and click "Generate Plan" to see the output.')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App




  // const handleGeneratePlan = () => {
  //   if (!description.trim()) return
  //   setLoading(true)
  //   setResponse('')
    
  //   // Simulate AI loading effect
  //   setTimeout(() => {
  //     setResponse(
  //       `🚀 Generated Project Plan for: "${description}"\n\n` +
  //       `1. 🏗️ Architecture & Setup\n` +
  //       `   - Initialize React frontend with Vite\n` +
  //       `   - Setup Express.js server & Node environment\n\n` +
  //       `2. 🗄️ Database Design\n` +
  //       `   - Design MongoDB schemas (Users, Products, Orders)\n\n` +
  //       `3. 🔌 Backend API Development\n` +
  //       `   - Implement Authentication endpoints (JWT)\n` +
  //       `   - Build CRUD controllers & routes\n\n` +
  //       `4. 🎨 Frontend Interface\n` +
  //       `   - Create responsive page layouts & state management\n` +
  //       `   - Integrate backend APIs`
  //     )
  //     setLoading(false)
  //   }, 600)
  // }