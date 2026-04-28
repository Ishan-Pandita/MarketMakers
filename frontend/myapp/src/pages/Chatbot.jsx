import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Bot, Briefcase, GraduationCap, MessageSquareText, Newspaper, Plus, Send } from "lucide-react";

import usePageTitle from "../hooks/usePageTitle";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";

const MODE_CONFIG = {
  general_chat: { label: "Financial assistant", className: "bg-indigo-50 text-indigo-700 dark:bg-cyan-400/10 dark:text-cyan-300" },
  news_simplify: { label: "News simplified", className: "bg-teal-50 text-teal-700 dark:bg-emerald-400/10 dark:text-emerald-300" },
  portfolio_guidance: { label: "Portfolio context used", className: "bg-orange-50 text-orange-700 dark:bg-amber-400/10 dark:text-amber-300" },
  learning_guidance: { label: "Learning guidance", className: "bg-violet-50 text-violet-700 dark:bg-violet-400/10 dark:text-violet-300" },
};

const normalizeMessage = (message, index = 0) => ({
  id: message._id || `${message.role}-${index}-${Date.now()}`,
  role: message.role,
  content: message.content,
  intent: message.intent || message.meta?.intent || "general_chat",
  meta: message.meta || {},
  streaming: false,
});

const buildDisplayMessage = (text) => {
  if (text.length > 420) {
    return `Please help me with this article:\n\n${text.slice(0, 220)}...`;
  }
  return text;
};

const buildChatPayload = (text, sessionId) => {
  const payload = {
    message: text,
    displayMessage: buildDisplayMessage(text),
  };

  if (sessionId) {
    payload.sessionId = sessionId;
  }

  return payload;
};

function ModeBadge({ intent, modeLabel }) {
  const config = MODE_CONFIG[intent] || MODE_CONFIG.general_chat;
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${config.className}`}>{modeLabel || config.label}</span>;
}

function Chatbot() {
  usePageTitle("AI Chatbot");
  const navigate = useNavigate();
  const location = useLocation();
  const { appContext, token } = useAuth();
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const messagesEndRef = useRef(null);
  const sendMessageRef = useRef(() => {});

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const prefill = location.state?.prefillMessage;
    if (!prefill) return;

    setMessage(prefill);
    if (location.state?.autoSend) {
      sendMessageRef.current(prefill);
    }

    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  const quickActions = [
    {
      label: "Simplify news",
      icon: Newspaper,
      action: () => setMessage("Simplify this news article for a beginner investor: "),
    },
    {
      label: "Review portfolio",
      icon: Briefcase,
      action: () => sendMessageRef.current("Review my portfolio and tell me what stands out."),
    },
    {
      label: "Learn a concept",
      icon: GraduationCap,
      action: () => sendMessageRef.current("Teach me diversification like I'm a beginner."),
    },
  ];

  async function fetchSessions() {
    try {
      const res = await API.get("/ai/chat/sessions");
      setSessions(res.data || []);
    } finally {
      setLoadingSessions(false);
    }
  }

  async function loadSession(sessionId) {
    const res = await API.get(`/ai/chat/sessions/${sessionId}`);
    setMessages((res.data.messages || []).map(normalizeMessage));
    setCurrentSessionId(sessionId);
  }

  function startNewChat() {
    setMessages([]);
    setCurrentSessionId(null);
    setMessage("");
  }

  async function fallbackSend(text) {
    const res = await API.post("/ai/chat", buildChatPayload(text, currentSessionId));

    setCurrentSessionId(res.data.sessionId || currentSessionId);
    setMessages((current) =>
      current.map((item) =>
        item.streaming
          ? {
              ...item,
              streaming: false,
              content: res.data.answer || res.data.response || item.content,
              intent: res.data.intent || item.intent,
              meta: {
                ...(item.meta || {}),
                sections: res.data.sections || {},
                warnings: res.data.warnings || [],
                citations: res.data.citations || [],
                provider: res.data.provider || null,
                modeLabel: res.data.modeLabel || null,
                affectedHoldings: res.data.affectedHoldings || [],
              },
            }
          : item
      )
    );
  }

  async function sendMessage(rawText) {
    const text = String(rawText || message).trim();
    if (!text || sending) return;

    const userMessage = { id: `user-${Date.now()}`, role: "user", content: text, intent: "general_chat", meta: {}, streaming: false };
    const placeholderId = `assistant-${Date.now()}`;
    setSending(true);
    setMessage("");
    setMessages((current) => [
      ...current,
      userMessage,
      { id: placeholderId, role: "assistant", content: "", intent: "general_chat", meta: {}, streaming: true },
    ]);

    try {
      const response = await fetch(`${apiBase}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || localStorage.getItem("token")}`,
        },
        body: JSON.stringify(buildChatPayload(text, currentSessionId)),
      });

      if (!response.ok || !response.body) {
        throw new Error("stream_failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamOpen = true;

      while (streamOpen) {
        const { done, value } = await reader.read();
        if (done) {
          streamOpen = false;
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const data = JSON.parse(part.slice(6));

          if (data.type === "session") {
            setCurrentSessionId(data.sessionId);
            continue;
          }

          setMessages((current) =>
            current.map((item) => {
              if (item.id !== placeholderId) return item;
              if (data.type === "intent") {
                return { ...item, intent: data.intent || item.intent, meta: { ...item.meta, modeLabel: data.modeLabel || item.meta?.modeLabel } };
              }
              if (data.type === "meta") {
                return { ...item, meta: { ...(item.meta || {}), ...(data.payload || {}) } };
              }
              if (data.type === "token") {
                return { ...item, content: `${item.content}${data.content || ""}` };
              }
              if (data.type === "done") {
                return { ...item, streaming: false };
              }
              return item;
            })
          );
        }
      }
    } catch (error) {
      try {
        await fallbackSend(text);
      } catch (fallbackError) {
        toast.error("The assistant could not respond right now.");
        setMessages((current) =>
          current.map((item) =>
            item.id === placeholderId
              ? {
                  ...item,
                  streaming: false,
                  content: "I couldn't generate a response right now. Please try again in a moment.",
                }
              : item
          )
        );
      }
    } finally {
      setSending(false);
      fetchSessions();
    }
  }

  sendMessageRef.current = sendMessage;

  const renderAssistantExtras = (msg) => {
    const sections = msg.meta?.sections || {};
    const affectedHoldings = msg.meta?.affectedHoldings || [];

    return (
      <div className="mt-3 space-y-3">
        <div className="flex items-center gap-2">
          <ModeBadge intent={msg.intent} modeLabel={msg.meta?.modeLabel} />
          {msg.meta?.provider && <span className={`text-[11px] ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{msg.meta.provider}</span>}
        </div>

        {sections.summary && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-dark-border/30 bg-dark-elevated text-gray-300" : "border-slate-border/60 bg-surface-subtle text-slate-body"}`}>
            <div className="mb-1 font-bold">Summary</div>
            {sections.summary}
          </div>
        )}

        {sections.simpleExplanation && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-dark-border/30 bg-dark-elevated text-gray-300" : "border-slate-border/60 bg-surface-subtle text-slate-body"}`}>
            <div className="mb-1 font-bold">Simple explanation</div>
            {sections.simpleExplanation}
          </div>
        )}

        {sections.keyPoints?.length > 0 && (
          <div className={`rounded-2xl border px-4 py-3 ${isDark ? "border-dark-border/30 bg-dark-elevated" : "border-slate-border/60 bg-surface-subtle"}`}>
            <div className="mb-2 text-sm font-bold">Key points</div>
            <div className="space-y-2 text-sm">
              {sections.keyPoints.map((point) => <div key={point}>{point}</div>)}
            </div>
          </div>
        )}

        {sections.marketImpact && (
          <div className={`rounded-2xl border px-4 py-3 text-sm ${isDark ? "border-dark-border/30 bg-dark-elevated text-gray-300" : "border-slate-border/60 bg-surface-subtle text-slate-body"}`}>
            <div className="mb-1 font-bold">Market impact</div>
            {sections.marketImpact}
          </div>
        )}

        {affectedHoldings.length > 0 && (
          <div className={`rounded-2xl border px-4 py-3 ${isDark ? "border-amber-400/20 bg-amber-400/10" : "border-amber-200 bg-amber-50"}`}>
            <div className="mb-2 text-sm font-bold text-amber-700 dark:text-amber-200">This news touches your holdings</div>
            <div className="flex flex-wrap gap-2">
              {affectedHoldings.map((holding) => (
                <span key={holding.symbol} className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${isDark ? "bg-amber-400/10 text-amber-200" : "bg-white text-amber-800"}`}>
                  {holding.symbol}
                </span>
              ))}
            </div>
          </div>
        )}

        {[...(sections.followUps || []), ...(sections.portfolioNotes || []), ...(sections.learningLinks || [])].length > 0 && (
          <div className="flex flex-wrap gap-2">
            {[...(sections.followUps || []), ...(sections.portfolioNotes || []), ...(sections.learningLinks || [])]
              .slice(0, 5)
              .map((item) => (
                <button key={item} type="button" onClick={() => sendMessage(item)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${isDark ? "bg-dark-elevated text-cyan-300" : "bg-indigo-50 text-indigo-700"}`}>
                  {item}
                </button>
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] ${isDark ? "bg-dark-bg" : "bg-surface"}`}>
      <div className="grid min-h-[calc(100vh-80px)] lg:grid-cols-[280px_1fr]">
        <aside className={`hidden border-r lg:flex lg:flex-col ${isDark ? "border-dark-border/30 bg-dark-surface" : "border-slate-border/60 bg-white"}`}>
          <div className="border-b p-4 dark:border-dark-border/30">
            <button onClick={startNewChat} className="btn-primary flex w-full items-center justify-center gap-2 text-sm">
              <Plus className="h-4 w-4" /> New chat
            </button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {loadingSessions ? (
              <div className={`px-3 py-4 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>Loading chat history...</div>
            ) : sessions.length === 0 ? (
              <div className={`px-3 py-4 text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>No chats yet.</div>
            ) : (
              sessions.map((session) => (
                <button key={session.id} onClick={() => loadSession(session.id)} className={`w-full rounded-2xl p-3 text-left ${currentSessionId === session.id ? isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-700" : isDark ? "text-gray-300 hover:bg-dark-elevated" : "text-slate-body hover:bg-surface-subtle"}`}>
                  <div className="truncate text-sm font-bold">{session.title}</div>
                  <div className={`mt-1 truncate text-xs ${isDark ? "text-gray-500" : "text-slate-muted"}`}>{session.lastMessage}</div>
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex h-[calc(100vh-80px)] flex-col">
          <div className={`border-b px-4 py-4 sm:px-6 ${isDark ? "border-dark-border/30 bg-dark-surface/80" : "border-slate-border/60 bg-white/80"}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${isDark ? "bg-cyan-400/10 text-cyan-300" : "bg-indigo-50 text-indigo-600"}`}>
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold">MarketMakers AI</h1>
                  <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                    One assistant for concepts, portfolio context, and article simplification.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { label: `${appContext?.portfolio?.assetCount || 0} assets`, icon: Briefcase },
                  { label: `${appContext?.learning?.completedLessons || 0} lessons`, icon: GraduationCap },
                  { label: `${appContext?.watchlist?.count || 0} watchlist`, icon: MessageSquareText },
                ].map((item) => (
                  <div key={item.label} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${isDark ? "bg-dark-elevated text-gray-300" : "bg-surface-subtle text-slate-body"}`}>
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            {messages.length === 0 ? (
              <div className="mx-auto max-w-4xl">
                <div className="rounded-[2rem] border p-6 sm:p-8">
                  <h2 className="text-2xl font-extrabold">What do you want help with?</h2>
                  <p className={`mt-3 max-w-2xl text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-body"}`}>
                    Ask a finance question, paste a news article, or get a portfolio-aware explanation.
                    The assistant decides the right mode automatically.
                  </p>
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {quickActions.map((item) => (
                      <button key={item.label} type="button" onClick={item.action} className={`card text-left ${isDark ? "hover:border-cyan-400/20" : "hover:border-indigo-200"}`}>
                        <item.icon className={`h-5 w-5 ${isDark ? "text-cyan-300" : "text-indigo-600"}`} />
                        <div className="mt-3 text-lg font-bold">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[90%] rounded-[1.75rem] px-5 py-4 sm:max-w-[80%] ${msg.role === "user" ? isDark ? "bg-cyan-400 text-dark-bg" : "bg-indigo-500 text-white" : isDark ? "border border-dark-border/30 bg-dark-card text-gray-200" : "border border-slate-border/60 bg-white text-slate-body"}`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content || (msg.streaming ? "Thinking..." : "")}</div>
                      {msg.role === "assistant" && renderAssistantExtras(msg)}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className={`flex-shrink-0 relative z-10 border-t px-4 py-4 sm:px-6 ${isDark ? "border-dark-border/30 bg-dark-surface" : "border-slate-border/60 bg-white"}`}>
            <div className="mx-auto max-w-4xl">
              <form onSubmit={(event) => { event.preventDefault(); sendMessage(); }} className="flex gap-3">
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Ask about finance, paste a news article, or request portfolio guidance..."
                  className="input-field min-h-[60px] flex-1 resize-none"
                  disabled={sending}
                />
                <button type="submit" disabled={sending || !message.trim()} className="btn-primary flex items-center gap-2 self-end px-5 py-3 text-sm">
                  <Send className="h-4 w-4" /> Send
                </button>
              </form>
              <p className={`mt-2 text-center text-[11px] ${isDark ? "text-gray-500" : "text-slate-muted"}`}>
                Educational only, not professional financial advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
