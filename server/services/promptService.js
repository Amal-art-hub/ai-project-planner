/**
 * Constructs the prompt template for generating a project plan.
 */
function buildProjectPlanPrompt({ projectName, description, experience, technology, deadline }) {
  return `You are an expert AI software architect. Create a detailed, structured project plan breakdown for a ${experience} level developer using ${technology} with a deadline of ${deadline}.

Project Name: ${projectName}
Project Description: ${description}`;
}

module.exports = {
  buildProjectPlanPrompt,
};