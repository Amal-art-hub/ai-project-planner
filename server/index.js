const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { GoogleGenAI } = require('@google/genai');
const { buildProjectPlanPrompt } = require('./services/promptService'); // 👈 Imported Prompt Service

const app = express();
const PORT = 5000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AI Project Planner API is running!');
});

app.post('/api/project/plan', async (req, res) => {
  try {
    const { projectName, description, experience, technology, deadline } = req.body;

    if (!description || !projectName) {
      return res.status(400).json({ error: 'Project Name and Description are required.' });
    }

    console.log(`Generating plan for "${projectName}" using Prompt Service...`);

    // 👈 Generate prompt using promptService
    const prompt = buildProjectPlanPrompt({
      projectName,
      description,
      experience,
      technology,
      deadline
    });

    // Call Gemini AI
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    const plan = response.text;
    res.json({ plan });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate plan from AI.' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});