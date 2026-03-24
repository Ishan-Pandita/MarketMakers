const ChatHistory = require("../models/ChatHistory");
const Portfolio = require("../models/Portfolio");
const { callAIService, getAIServiceURL } = require("../services/aiClient");

const PORTFOLIO_KEYWORDS = [
  "my portfolio",
  "my stocks",
  "my holdings",
  "my investments",
  "i own",
  "i hold",
  "should i buy",
  "should i sell",
  "am i diversified",
];



const buildPortfolioContext = async (userId) => {
  const portfolio = await Portfolio.findOne({ userId });

  if (!portfolio) {
    return {
      portfolio: null,
      portfolioContext: null,
    };
  }

  return {
    portfolio,
    portfolioContext: {
      totalValue: portfolio.totalValue,
      assetCount: portfolio.assets.length,
      assets: portfolio.assets.map((asset) => ({
        name: asset.name,
        ticker: asset.ticker,
        amount: asset.amount,
        type: asset.assetType,
      })),
    },
  };
};

const detectAffectedHoldings = (sections = {}, portfolio) => {
  if (!portfolio?.assets?.length) {
    return [];
  }

  const assetsToWatch = (sections.assetsToWatch || []).map((item) =>
    String(item).toLowerCase()
  );
  const summaryText = [
    sections.summary,
    sections.simpleExplanation,
    sections.marketImpact,
    ...(sections.keyPoints || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return portfolio.assets
    .filter((asset) => {
      const ticker = asset.ticker?.toLowerCase() || "";
      const name = asset.name?.toLowerCase() || "";

      return (
        assetsToWatch.includes(ticker) ||
        assetsToWatch.some((entry) => ticker && entry.includes(ticker)) ||
        (ticker && summaryText.includes(ticker)) ||
        (name && summaryText.includes(name))
      );
    })
    .slice(0, 5)
    .map((asset) => ({
      symbol: asset.ticker || asset.name,
      name: asset.name,
      assetType: asset.assetType,
      amount: asset.amount,
    }));
};

const buildAssistantMeta = (result, affectedHoldings = []) => ({
  intent: result.intent || "general_chat",
  sections: result.sections || {},
  citations: result.citations || [],
  warnings: result.warnings || [],
  provider: result.provider || null,
  modeLabel: result.modeLabel || null,
  affectedHoldings,
});

const analyzePortfolio = async (req, res) => {
  const portfolio = await Portfolio.findOne({ userId: req.user.id });

  if (!portfolio || portfolio.assets.length === 0) {
    res.status(400);
    throw new Error("Add assets to your portfolio before analyzing");
  }

  const result = await callAIService("/analyze", {
    assets: portfolio.assets.map((asset) => ({
      name: asset.name,
      ticker: asset.ticker,
      amount: asset.amount,
      type: asset.assetType,
    })),
    totalValue: portfolio.totalValue,
  });

  res.json(result);
};

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
    assets: portfolio.assets.map((asset) => ({
      name: asset.name,
      ticker: asset.ticker,
      amount: asset.amount,
      type: asset.assetType,
    })),
    totalValue: portfolio.totalValue,
  });

  res.json(result);
};

const searchAssets = async (req, res) => {
  const query = String(req.query.query || "").trim();

  if (!query) {
    res.status(400);
    throw new Error("Please provide a search query");
  }

  const response = await fetch(
    `${getAIServiceURL()}/asset-search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "X-Internal-Token": process.env.INTERNAL_TOKEN || "",
      },
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ detail: "AI service unavailable" }));
    throw new Error(error.detail || "AI service unavailable");
  }

  const result = await response.json();
  res.json(result);
};

const chat = async (req, res) => {
  const { message, sessionId, modeHint, displayMessage } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error("Please provide a message");
  }

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

  const recentMessages = chatSession.messages.slice(-10).map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  const { portfolio, portfolioContext } = await buildPortfolioContext(req.user.id);
  const result = await callAIService("/chat", {
    message,
    history: recentMessages,
    portfolioContext,
    modeHint:
      modeHint ||
      (PORTFOLIO_KEYWORDS.some((keyword) =>
        message.toLowerCase().includes(keyword)
      )
        ? "portfolio"
        : "auto"),
  });

  const assistantContent =
    result.answer || result.response || "I could not generate a response.";
  const affectedHoldings = detectAffectedHoldings(result.sections, portfolio);
  const assistantMeta = buildAssistantMeta(result, affectedHoldings);
  const intent = assistantMeta.intent;

  chatSession.messages.push(
    {
      role: "user",
      content: displayMessage?.trim() || message,
    },
    {
      role: "assistant",
      content: assistantContent,
      intent,
      meta: assistantMeta,
    }
  );

  await chatSession.save();

  res.json({
    sessionId: chatSession._id,
    response: assistantContent,
    answer: assistantContent,
    intent,
    sections: assistantMeta.sections,
    citations: assistantMeta.citations,
    warnings: assistantMeta.warnings,
    provider: assistantMeta.provider,
    modeLabel: assistantMeta.modeLabel,
    affectedHoldings,
  });
};

const chatStream = async (req, res) => {
  const { message, sessionId, modeHint, displayMessage } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400);
    throw new Error("Please provide a message");
  }

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

  const recentMessages = chatSession.messages.slice(-10).map((entry) => ({
    role: entry.role,
    content: entry.content,
  }));

  const { portfolio, portfolioContext } = await buildPortfolioContext(req.user.id);
  const response = await fetch(`${getAIServiceURL()}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      "X-Internal-Token": process.env.INTERNAL_TOKEN || "",
    },
    body: JSON.stringify({
      message,
      history: recentMessages,
      portfolioContext,
      modeHint:
        modeHint ||
        (PORTFOLIO_KEYWORDS.some((keyword) =>
          message.toLowerCase().includes(keyword)
        )
          ? "portfolio"
          : "auto"),
    }),
  });

  if (!response.ok || !response.body) {
    const error = await response
      .json()
      .catch(() => ({ detail: "AI service unavailable" }));
    throw new Error(error.detail || "AI service unavailable");
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.write(
    `data: ${JSON.stringify({
      type: "session",
      sessionId: chatSession._id,
    })}\n\n`
  );

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let assistantContent = "";
  let intent = "general_chat";
  let finalPayload = null;
  let assistantMeta = {
    sections: {},
    citations: [],
    warnings: [],
    provider: null,
    modeLabel: null,
    affectedHoldings: [],
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      if (!rawEvent.startsWith("data: ")) {
        continue;
      }

      const event = JSON.parse(rawEvent.slice(6));

      if (event.type === "intent") {
        intent = event.intent || intent;
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        continue;
      }

      if (event.type === "meta") {
        assistantMeta = {
          ...assistantMeta,
          ...(event.payload || {}),
        };
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        continue;
      }

      if (event.type === "token") {
        assistantContent += event.content || "";
        res.write(`data: ${JSON.stringify(event)}\n\n`);
        continue;
      }

      if (event.type === "done") {
        finalPayload = event.payload || null;
        if (finalPayload) {
          intent = finalPayload.intent || intent;
          if (!assistantContent) {
            assistantContent = finalPayload.answer || "";
          }

          assistantMeta = buildAssistantMeta(
            finalPayload,
            detectAffectedHoldings(finalPayload.sections, portfolio)
          );

          res.write(
            `data: ${JSON.stringify({
              type: "meta",
              payload: assistantMeta,
            })}\n\n`
          );
        }

        res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      }
    }
  }

  chatSession.messages.push(
    {
      role: "user",
      content: displayMessage?.trim() || message,
    },
    {
      role: "assistant",
      content:
        assistantContent || "I could not generate a response right now.",
      intent,
      meta: {
        intent,
        ...assistantMeta,
      },
    }
  );

  await chatSession.save();
  res.end();
};

const getChatSessions = async (req, res) => {
  const sessions = await ChatHistory.find({ userId: req.user.id })
    .select("sessionTitle updatedAt messages")
    .sort({ updatedAt: -1 })
    .limit(20);

  res.json(
    sessions.map((session) => ({
      id: session._id,
      title: session.sessionTitle,
      lastMessage:
        session.messages.length > 0
          ? session.messages[session.messages.length - 1].content.substring(
              0,
              80
            )
          : "",
      messageCount: session.messages.length,
      updatedAt: session.updatedAt,
    }))
  );
};

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

const simulate = async (req, res) => {
  const { initialAmount = 0, monthlyInvestment, returnRate, years } = req.body;

  if (
    monthlyInvestment === undefined ||
    returnRate === undefined ||
    years === undefined
  ) {
    res.status(400);
    throw new Error(
      "Please provide initialAmount, monthlyInvestment, returnRate, and years"
    );
  }

  const monthlyRate = returnRate / 100 / 12;
  const months = years * 12;
  const dataPoints = [
    {
      month: 0,
      year: "0.0",
      invested: Math.round(Number(initialAmount)),
      value: Math.round(Number(initialAmount)),
      growth: 0,
    },
  ];

  let totalInvested = Number(initialAmount);
  let currentValue = Number(initialAmount);

  for (let month = 1; month <= months; month++) {
    totalInvested += Number(monthlyInvestment);
    currentValue = (currentValue + Number(monthlyInvestment)) * (1 + monthlyRate);

    if (month % 3 === 0 || month === months) {
      dataPoints.push({
        month,
        year: (month / 12).toFixed(1),
        invested: Math.round(totalInvested),
        value: Math.round(currentValue),
        growth: Math.round(currentValue - totalInvested),
      });
    }
  }

  let aiExplanation = "";
  try {
    const result = await callAIService("/simulate", {
      initialAmount: Number(initialAmount),
      monthlyInvestment: Number(monthlyInvestment),
      returnRate: Number(returnRate),
      years: Number(years),
      futureValue: Math.round(currentValue),
      totalInvested: Math.round(totalInvested),
    });
    aiExplanation = result.explanation;
  } catch (err) {
    aiExplanation = `Starting with Rs.${Number(
      initialAmount
    ).toLocaleString()} and investing Rs.${Number(
      monthlyInvestment
    ).toLocaleString()} monthly at ${returnRate}% annual return over ${years} years, your investment could grow to Rs.${Math.round(
      currentValue
    ).toLocaleString()}. Total invested: Rs.${Math.round(
      totalInvested
    ).toLocaleString()}, potential gains: Rs.${Math.round(
      currentValue - totalInvested
    ).toLocaleString()}.`;
  }

  res.json({
    initialAmount: Number(initialAmount),
    futureValue: Math.round(currentValue),
    totalInvested: Math.round(totalInvested),
    totalGrowth: Math.round(currentValue - totalInvested),
    returnRate: Number(returnRate),
    years: Number(years),
    dataPoints,
    explanation: aiExplanation,
  });
};

module.exports = {
  analyzePortfolio,
  getHealthScore,
  searchAssets,
  chat,
  chatStream,
  getChatSessions,
  getChatSession,
  simulate,
};
