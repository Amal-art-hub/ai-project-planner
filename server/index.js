
console.log("server is running")
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');
const { validateProjectPlan, generateMultiStepPlan} = require('./services/promptService'); // 👈 Imported Prompt Service

const app = express();
const PORT = 5000;
const rateLimit = require('express-rate-limit');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());



// Rate limiting for project plan generation (5 per day = 15 AI calls max)
const planLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: 'Daily plan generation limit reached. Try again tomorrow.'
});

// Rate limiting for AI assistant (5 per day = 5 AI calls max)
const assistantLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: 'Daily assistant limit reached. Try again tomorrow.'
});



// ADD THESE TWO LINES RIGHT HERE:
app.use('/api/project/plan', planLimiter);
app.use('/api/project/assistant', assistantLimiter);






app.get('/', (req, res) => {
  res.send('AI Project Planner API is running!');
});



app.post('/api/project/plan', async (req, res) => {
  try {
    const { projectName, description, experience, technology, deadline } = req.body;

    if (!description || !projectName) {
      return res.status(400).json({ error: 'Project Name and Description are required.' });
    }

   console.log(`Starting Multi-Step AI Workflow for "${projectName}"...`);
    // 👈 Call Multi-Step AI Pipeline (Chained 3-Step Calls)
    const plan = await generateMultiStepPlan(ai, {
      projectName,
      description,
      experience,
      technology,
      deadline
    });

       if (!validateProjectPlan(plan)) {
      console.error('Invalid AI plan structure:', plan);
      return res.status(502).json({ error: 'Received malformed plan from AI. Please try again.' });
    }


    res.json({ plan });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate plan from AI.' });
  }
});






app.post('/api/project/assistant', async (req, res) => {
  try {
    const { question, projectContext, currentPlan, conversationHistory } = req.body;

    if (!question || !projectContext || !currentPlan) {
      return res.status(400).json({ error: 'Question, project context and plan are required.' });
    }

    // Build conversation history as formatted text
    let historyText = '';
    if (conversationHistory && conversationHistory.length > 0) {
      historyText = conversationHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
        .join('\n');
    }

    // Build the full assistant prompt
    const assistantPrompt = `PROJECT CONTEXT:
Project Name: ${projectContext.projectName}
Technology: ${projectContext.technology}
Experience Level: ${projectContext.experience}
Deadline: ${projectContext.deadline} days

CURRENT PROJECT PLAN:
${JSON.stringify(currentPlan, null, 2)}

CONVERSATION HISTORY:
${historyText || 'No previous conversation.'}

USER QUESTION:
${question}`;

    const assistantSystemPrompt = `You are a helpful AI project planning assistant. 
The developer has already generated a project plan and is now asking follow-up questions.
Use the project context, current plan, and conversation history to give specific, practical answers.
Keep answers concise and actionable.`;

    const response = await ai.models.generateContent({
      model:  'gemini-3.6-flash',
      contents: assistantPrompt,
      config: {
        systemInstruction: assistantSystemPrompt,
      },
    });

    res.json({ answer: response.text });

  } catch (error) {
    console.error('Assistant Error:', error);
    res.status(500).json({ error: 'Failed to get assistant response.' });
  }
});



















app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});