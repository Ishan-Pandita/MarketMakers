const Portfolio = require("../models/Portfolio");
const ChatHistory = require("../models/ChatHistory");

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// Helper to call the FastAPI AI service
const callAIService = async (endpoint, data) => {
  const response = await fetch(`${AI_SERVICE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "AI service error" }));
    throw new Error(error.detail || "AI service unavailable");
  }

  return response.json();
};

// Feature 4: AI Portfolio Analyzer
const analyzePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    res.status(400);
    throw new Error("Add assets to your portfolio before analyzing");
  }

  const result = await callAIService("/analyze", {
    assets: portfolio.assets.map((a) => ({
      name: a.name,
      ticker: a.ticker,
      amount: a.amount,
      type: a.assetType,
    })),
    totalValue: portfolio.totalValue,
  });

  res.json(result);
};

// Feature 5: Portfolio Health Score
const getHealthScore = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    return res.json({
      score: 0,
      riskLevel: "N/A",
      diversification: "N/A",
      message: "Add assets to get your portfolio health score",
    });
  }

  const result = await callAIService("/health-score", {
    assets: portfolio.assets.map((a) => ({
      name: a.name,
      ticker: a.ticker,
      amount: a.amount,
      type: a.assetType,
    })),
    totalValue: portfolio.totalValue,
  });

  res.json(result);
};

// Feature 6: Financial News Simplifier
const simplifyNews = async (req, res) => {
  const { text } = req.body;

  if (!text || text.trim().length < 10) {
    res.status(400);
    throw new Error("Please provide financial news text (at least 10 characters)");
  }

  const result = await callAIService("/simplify-news", { text });
  res.json(result);
};

// Feature 7: AI Financial Chatbot
const chat = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  // Get or create chat session
  let chatSession;
  if (sessionId) {
    chatSession = await ChatHistory.findOne({
      _id: sessionId,
      userId: req.user.id,
    });
  }

  if (!chatSession) {
    chatSession = new ChatHistory({
      userId: req.user.id,
      sessionTitle: message.substring(0, 50),
      messages: [],
    });
  }

  // Get recent messages for context (last 10)
  const recentMessages = chatSession.messages.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Get portfolio context
  const portfolio = await Portfolio.findOne({ userId: req.user.id });
  const portfolioContext = portfolio
    ? {
        totalValue: portfolio.totalValue,
        assets: portfolio.assets.map((a) => ({
          name: a.name,
          amount: a.amount,
          type: a.assetType,
        })),
      }
    : null;

  const result = await callAIService("/chat", {
    message,
    history: recentMessages,
    portfolioContext,
  });

  // Save messages
  chatSession.messages.push(
    { role: "user", content: message },
    { role: "assistant", content: result.response }
  );
  await chatSession.save();

  res.json({
    response: result.response,
    sessionId: chatSession._id,
  });
};

// Get chat sessions
const getChatSessions = async (req, res) => {
  const sessions = await ChatHistory.find({ userId: req.user.id })
    .select("sessionTitle updatedAt messages")
    .sort({ updatedAt: -1 })
    .limit(20);

  res.json(
    sessions.map((s) => ({
      id: s._id,
      title: s.sessionTitle,
      lastMessage: s.messages.length > 0 ? s.messages[s.messages.length - 1].content.substring(0, 80) : "",
      messageCount: s.messages.length,
      updatedAt: s.updatedAt,
    }))
  );
};

// Get a single chat session
const getChatSession = async (req, res) => {
  const session = await ChatHistory.findOne({
    _id: req.params.sessionId,
    userId: req.user.id,
  });

  if (!session) {
    res.status(404);
    throw new Error("Chat session not found");
  }

  res.json(session);
};

// Feature 8: Financial Scenario Simulator
const simulate = async (req, res) => {
  const { monthlyInvestment, returnRate, years } = req.body;

  if (!monthlyInvestment || !returnRate || !years) {
    res.status(400);
    throw new Error("Please provide monthlyInvestment, returnRate, and years");
  }

  // Calculate locally for instant results
  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;
  const dataPoints = [];

  let totalInvested = 0;
  let currentValue = 0;

  for (let i = 1; i <= months; i++) {
    totalInvested += monthlyInvestment;
    currentValue = (currentValue + monthlyInvestment) * (1 + monthlyRate);

    // Record quarterly data points
    if (i % 3 === 0 || i === months) {
      dataPoints.push({
        month: i,
        year: (i / 12).toFixed(1),
        invested: Math.round(totalInvested),
        value: Math.round(currentValue),
        growth: Math.round(currentValue - totalInvested),
      });
    }
  }

  // Get AI explanation
  let aiExplanation = "";
  try {
    const result = await callAIService("/simulate", {
      monthlyInvestment,
      returnRate,
      years,
      futureValue: Math.round(currentValue),
      totalInvested: Math.round(totalInvested),
    });
    aiExplanation = result.explanation;
  } catch (err) {
    aiExplanation = `By investing ₹${monthlyInvestment.toLocaleString()} monthly at ${returnRate}% annual return over ${years} years, your investment could grow to ₹${Math.round(currentValue).toLocaleString()}. Total invested: ₹${Math.round(totalInvested).toLocaleString()}, potential gains: ₹${Math.round(currentValue - totalInvested).toLocaleString()}.`;
  }

  res.json({
    futureValue: Math.round(currentValue),
    totalInvested: Math.round(totalInvested),
    totalGrowth: Math.round(currentValue - totalInvested),
    returnRate,
    years,
    dataPoints,
    explanation: aiExplanation,
  });
};

module.exports = {
  analyzePortfolio,
  getHealthScore,
  simplifyNews,
  chat,
  getChatSessions,
  getChatSession,
  simulate,
};
