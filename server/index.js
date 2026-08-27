const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Loads GEMINI_API_KEY from .env

const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = 5000;

// Initialize Google Gen AI with your API key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.send('AI Project Planner API is running!');
});

// Step 1.4 POST Endpoint connected to Gemini AI
app.post('/api/project/plan', async (req, res) => {
  try {
    const { requirement } = req.body;

    if (!requirement) {
      return res.status(400).json({ error: 'Requirement text is required.' });
    }

    console.log('Sending requirement to Gemini AI:', requirement);

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `You are an expert AI software architect. Create a structured, high-level project plan breakdown for the following user request:\n"${requirement}"`,
    });

    const plan = response.text;

    // Return the real AI response back to React
    res.json({ plan });

  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate plan from AI.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});