// /**
//  * System prompt defining AI persona, instructions, and behavior rules.
//  */
// const SYSTEM_PROMPT = `You are an experienced software project planning assistant.

// Your job is to analyze a user's project idea and create a realistic development plan.

// Consider:
// - project complexity
// - user's experience
// - technology stack
// - deadline

// Break the project into practical development phases and tasks.

// Do not assume that an unrealistic deadline is achievable.
// Identify risks when appropriate.

// Return your response strictly as a JSON object matching this exact schema:
// {
//   "projectOverview": "Brief summary of the project goals and scope",
//   "complexity": "Low | Medium | High",
//   "estimatedTotalDays": 14,
//   "phases": [
//     {
//       "name": "Phase Name (e.g. Phase 1: Planning & Setup)",
//       "tasks": [
//         {
//           "title": "Task title",
//           "estimatedDays": 2
//         }
//       ]
//     }
//   ],
//   "risks": [
//     "Potential risk or bottleneck description"
//   ],
//   "testingPlan": [
//     "Key testing step or requirement"
//   ]
// }`;

// /**
//  * Constructs the user prompt containing dynamic project input data.
//  */
// function buildUserPrompt({ projectName, description, experience, technology, deadline }) {
//   return `PROJECT CONTEXT

// Project Name:
// ${projectName}

// Description:
// ${description}

// Experience Level:
// ${experience}

// Technology Stack:
// ${technology}

// Deadline:
// ${deadline} days

// TASK:
// Create a realistic, step-by-step development plan based on the project context above.`;
// }






/**
 * Validates the structure of the AI-generated project plan.
 * Returns true if valid, false otherwise.
 */
function validateProjectPlan(plan) {
  if (!plan || typeof plan !== 'object') {
    return false;
  }

  // Check required top-level fields
  if (!plan.projectOverview || typeof plan.projectOverview !== 'string') {
    return false;
  }

  if (!plan.complexity || typeof plan.complexity !== 'string') {
    return false;
  }

  // Check that phases exists, is an Array, and is not empty
  if (!plan.phases || !Array.isArray(plan.phases) || plan.phases.length === 0) {
    return false;
  }

  return true;
}






/**
 * MULTI-STEP AI WORKFLOW PIPELINE PROMPTS & FUNCTION
 */
// 1. Analysis Step Prompt
const ANALYSIS_SYSTEM_PROMPT = `You are a senior software architect. Analyze the project details and return a JSON object with:
{
  "projectOverview": "Detailed summary of the project scope and architecture",
  "complexity": "Low | Medium | High"
}`;
// 2. Phases & Tasks Step Prompt
const PHASES_SYSTEM_PROMPT = `You are a technical project manager. Based on the project overview, create realistic development phases and breakdown tasks for each phase. Return JSON:
{
  "estimatedTotalDays": 30,
  "phases": [
    {
      "name": "Phase 1: Architecture & Setup",
      "tasks": [
        { "title": "Setup repository & environment", "estimatedDays": 1 }
      ]
    }
  ]
}`;
// 3. Risks & Testing Step Prompt
const RISKS_TESTING_SYSTEM_PROMPT = `You are a QA lead and risk management expert. Based on the development plan, identify project risks and a testing checklist. Return JSON:
{
  "risks": ["Risk description 1", "Risk description 2"],
  "testingPlan": ["Testing requirement 1", "Testing requirement 2"]
}`;
/**
 * Executes chained AI calls sequentially (Multi-Step AI Workflow).
 */
async function generateMultiStepPlan(ai, projectDetails) {
  const { projectName, description, experience, technology, deadline } = projectDetails;
  // STEP 1: Analyze Project Scope & Complexity
  console.log('Step 1/3: Analyzing project scope & complexity...');
  const step1Response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `Project Name: ${projectName}\nDescription: ${description}\nTech Stack: ${technology}\nDeadline: ${deadline} days`,
    config: {
      systemInstruction: ANALYSIS_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });
  const step1Data = JSON.parse(step1Response.text);
  // STEP 2: Generate Development Phases, Tasks & Timelines
  console.log('Step 2/3: Generating development phases & tasks...');
  const step2Response = await ai.models.generateContent({
    model:'gemini-3.6-flash',
    contents: `Overview: ${step1Data.projectOverview}\nComplexity: ${step1Data.complexity}\nDeveloper Experience: ${experience}\nTech Stack: ${technology}\nTarget Deadline: ${deadline} days`,
    config: {
      systemInstruction: PHASES_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });
  const step2Data = JSON.parse(step2Response.text);
  // STEP 3: Identify Risks & Testing Checklist
  console.log('Step 3/3: Identifying risks & testing checklist...');
  const step3Response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: `Project Overview: ${step1Data.projectOverview}\nPhases: ${JSON.stringify(step2Data.phases)}`,
    config: {
      systemInstruction: RISKS_TESTING_SYSTEM_PROMPT,
      responseMimeType: 'application/json',
    },
  });
  const step3Data = JSON.parse(step3Response.text);
  // MERGE ALL STEPS INTO FINAL PLAN OBJECT
  const finalPlan = {
    projectOverview: step1Data.projectOverview,
    complexity: step1Data.complexity,
    estimatedTotalDays: step2Data.estimatedTotalDays || parseInt(deadline, 10) || 30,
    phases: step2Data.phases,
    risks: step3Data.risks,
    testingPlan: step3Data.testingPlan,
  };
  return finalPlan;
}






module.exports = {

  validateProjectPlan,
  generateMultiStepPlan
};