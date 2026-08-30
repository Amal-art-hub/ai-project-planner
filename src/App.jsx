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


  // AI Assistant states
const [question, setQuestion] = useState('')
const [conversationHistory, setConversationHistory] = useState([])
const [assistantLoading, setAssistantLoading] = useState(false)



const [plan, setPlan] = useState(null)

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

         setPlan(data.plan)   
        setResponse(JSON.stringify(data.plan, null, 2))
      } else {
        setResponse(`Error: ${data.error}`)
      }
    } catch (error) {
      setResponse('Failed to connect to backend server. Make sure node index.js is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }



// 3. HANDLE AI ASSISTANT
const handleAskAssistant = async () => {
  if (!question.trim() || !response) return

  const currentPlan = JSON.parse(response)

  setAssistantLoading(true)

  try {
    const res = await fetch('http://localhost:5000/api/project/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        projectContext: { projectName, technology, experience, deadline },
        currentPlan,
        conversationHistory,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      // Add user question and AI answer to conversation history
      setConversationHistory(prev => [
        ...prev,
        { role: 'user', text: question },
        { role: 'assistant', text: data.answer },
      ])
      setQuestion('')
    }
  } catch (error) {
    console.error('Assistant error:', error)
  } finally {
    setAssistantLoading(false)
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



        

{/* PROJECT PLAN DISPLAY */}
{plan && (
  <div style={{ marginTop: '28px' }}>

    {/* Overview */}
    <h3 style={{ color: '#818cf8', fontSize: '14px', marginBottom: '6px' }}>📋 PROJECT OVERVIEW</h3>
    <p style={{ color: '#e2e8f0', fontSize: '14px', marginBottom: '16px', lineHeight: '1.6' }}>
      {plan.projectOverview}
    </p>

    {/* Complexity & Days */}
    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
      <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', color: '#f8fafc', fontSize: '13px' }}>
        🎯 Complexity: <strong>{plan.complexity}</strong>
      </span>
      <span style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 14px', color: '#f8fafc', fontSize: '13px' }}>
        📅 Estimated: <strong>{plan.estimatedTotalDays} days</strong>
      </span>
    </div>

    {/* Phases */}
    <h3 style={{ color: '#818cf8', fontSize: '14px', marginBottom: '10px' }}>🚀 DEVELOPMENT PHASES</h3>
    {plan.phases.map((phase, i) => (
      <div key={i} style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
        <h4 style={{ color: '#c084fc', fontSize: '13px', margin: '0 0 10px 0' }}>{phase.name}</h4>
        {phase.tasks.map((task, j) => (
          <div key={j} style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontSize: '13px', marginBottom: '6px' }}>
            <span>☐ {task.title}</span>
            <span style={{ color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '12px' }}>{task.estimatedDays}d</span>
          </div>
        ))}
      </div>
    ))}

    {/* Risks */}
    <h3 style={{ color: '#818cf8', fontSize: '14px', margin: '20px 0 10px 0' }}>⚠️ RISKS</h3>
    <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
      {plan.risks.map((risk, i) => (
        <p key={i} style={{ color: '#fbbf24', fontSize: '13px', margin: '0 0 6px 0' }}>• {risk}</p>
      ))}
    </div>

    {/* Testing Plan */}
    <h3 style={{ color: '#818cf8', fontSize: '14px', margin: '20px 0 10px 0' }}>🧪 TESTING PLAN</h3>
    <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '14px' }}>
      {plan.testingPlan.map((test, i) => (
        <p key={i} style={{ color: '#86efac', fontSize: '13px', margin: '0 0 6px 0' }}>☐ {test}</p>
      ))}
    </div>

  </div>
)}





{/* AI ASSISTANT SECTION - only show after plan is generated */}
{response && (
  <div style={{ marginTop: '28px' }}>
    <h3 style={{ fontSize: '15px', color: '#94a3b8', marginBottom: '10px' }}>
      🤖 AI Assistant
    </h3>

    {/* Conversation History */}
    {conversationHistory.length > 0 && (
      <div style={{
        backgroundColor: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '12px',
        marginBottom: '12px',
        maxHeight: '250px',
        overflowY: 'auto'
      }}>
        {conversationHistory.map((msg, index) => (
          <div key={index} style={{
            marginBottom: '10px',
            textAlign: msg.role === 'user' ? 'right' : 'left'
          }}>
            <span style={{
              display: 'inline-block',
              backgroundColor: msg.role === 'user' ? '#6366f1' : '#1e293b',
              border: msg.role === 'assistant' ? '1px solid #334155' : 'none',
              color: '#f8fafc',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '13px',
              maxWidth: '85%',
              textAlign: 'left'
            }}>
              <strong>{msg.role === 'user' ? 'You' : '🤖 Assistant'}:</strong>
              <br />
              {msg.text}
            </span>
          </div>
        ))}
      </div>
    )}

    {/* Question Input */}
    <input
      type="text"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
      placeholder="Ask: What should I do first? How do I handle auth?"
      style={inputStyle}
    />

    {/* Ask Button */}
    <button
      onClick={handleAskAssistant}
      disabled={assistantLoading || !question.trim()}
      style={{
        width: '100%',
        padding: '12px',
        fontSize: '15px',
        fontWeight: '600',
        color: '#ffffff',
        background: question.trim() ? 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' : '#334155',
        border: 'none',
        borderRadius: '10px',
        cursor: question.trim() ? 'pointer' : 'not-allowed',
        marginTop: '4px'
      }}
    >
      {assistantLoading ? 'Thinking...' : '💬 Ask AI Assistant'}
    </button>
  </div>
)}




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