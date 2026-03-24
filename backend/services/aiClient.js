/**
 * Shared AI service client — single implementation used by all controllers.
 */

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

const callAIService = async (endpoint, data) => {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Internal-Token": process.env.INTERNAL_TOKEN || "",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "AI service unavailable" }));
    throw new Error(error.detail || "AI service unavailable");
  }

  return response.json();
};

const getAIServiceURL = () => AI_SERVICE_URL;

module.exports = { callAIService, getAIServiceURL };
