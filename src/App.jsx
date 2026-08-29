import { useState } from 'react'

function App() {
  // 1. STATE VARIABLES FOR THE 5 FORM FIELDS
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')
  const [experience, setExperience] = useState('Beginner')
  const [technology, setTechnology] = useState('MERN Stack')
  const [deadline, setDeadline] = useState('30 days')

  // Response & Loading states
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  // 2. HANDLE GENERATE PLAN
  const handleGeneratePlan = async () => {
    if (!projectName.trim() || !description.trim()) {
      alert('Please fill in Project Name and Description.')
      return
    }

    setLoading(true)
    setResponse('')

    try {
      // Send all 5 fields in the HTTP POST body
      const res = await fetch('http://localhost:5000/api/project/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName,
          description,
          experience,
          technology,
          deadline,
        }),
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

  // Common input field style
  const inputStyle = {
    width: '100%',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #334155',
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    marginBottom: '16px'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontFamily: "'Inter', system-ui, sans-serif",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '650px',
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
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

        {/* 1. Project Name */}
        <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '6px' }}>
          Project Name
        </label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g., E-Commerce Shoe Store"
          style={inputStyle}
        />

        {/* 2. Project Description */}
        <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '6px' }}>
          Project Description
        </label>
        <textarea
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your project features and goals..."
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        {/* 3. Experience Level & 4. Technology (2 Columns) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '6px' }}>
              Experience Level
            </label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              style={inputStyle}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '6px' }}>
              Technology Stack
            </label>
            <select
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              style={inputStyle}
            >
              <option value="MERN Stack">MERN Stack (React, Node, Express, MongoDB)</option>
              <option value="Next.js">Next.js + Tailwind</option>
              <option value="Python Django/FastAPI">Python (Django / FastAPI)</option>
              <option value="Java Spring Boot">Java Spring Boot</option>
            </select>
          </div>
        </div>

        {/* 5. Deadline */}
        <label style={{ display: 'block', fontSize: '14px', color: '#94a3b8', marginBottom: '6px' }}>
          Target Deadline
        </label>
        <input
          type="text"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          placeholder="e.g., 30 days"
          style={inputStyle}
        />

        {/* Submit Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={loading || !projectName.trim() || !description.trim()}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#ffffff',
            background: (projectName.trim() && description.trim()) ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : '#334155',
            border: 'none',
            borderRadius: '10px',
            cursor: (projectName.trim() && description.trim()) ? 'pointer' : 'not-allowed',
            marginTop: '8px'
          }}
        >
          {loading ? 'Generating Custom Plan...' : '✨ Generate Project Plan'}
        </button>

        {/* AI Response Area */}
        <div style={{ marginTop: '28px' }}>
          <h3 style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '10px' }}>
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
            whiteSpace: 'pre-wrap',
            fontFamily: 'monospace'
          }}>
            {response || (loading ? 'Analyzing your project requirements & skill level...' : 'Fill out the form above and click "Generate Project Plan".')}
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