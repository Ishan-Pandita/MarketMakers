// src/pages/Chatbot.jsx — AI Financial Chatbot + News Simplifier (Dual Theme)
import usePageTitle from "../hooks/usePageTitle";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import API from "../services/api";
import toast from "react-hot-toast";
import { Bot, Newspaper, Briefcase, BarChart3, GraduationCap, MessageCircle, Send, Sparkles, ArrowLeft, Plus } from "lucide-react";

function Chatbot() {
  usePageTitle("AI Chatbot");
  const { isDark } = useTheme();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [mode, setMode] = useState("chat");
  const [newsText, setNewsText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchSessions = async () => {
    try { const res = await API.get("/ai/chat/sessions"); setSessions(res.data); }
    catch (err) { console.error("Error fetching sessions:", err); }
    finally { setLoadingSessions(false); }
  };

  const loadSession = async (sessionId) => {
    try { const res = await API.get(`/ai/chat/sessions/${sessionId}`); setMessages(res.data.messages || []); setCurrentSessionId(sessionId); setMode("chat"); }
    catch (err) { console.error("Error loading session:", err); }
  };

  const startNewChat = () => { setMessages([]); setCurrentSessionId(null); setMode("chat"); };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;
    const userMessage = message.trim();
    setMessage("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const res = await API.post("/ai/chat", { message: userMessage, sessionId: currentSessionId });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.response }]);
      if (res.data.sessionId && !currentSessionId) { setCurrentSessionId(res.data.sessionId); fetchSessions(); }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't process your message right now. Please try again." }]);
    } finally { setLoading(false); }
  };

  const handleSimplifyNews = async () => {
    if (!newsText.trim() || loading) return;
    const text = newsText.trim();
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: `Simplify this news:\n\n${text.substring(0, 200)}${text.length > 200 ? "..." : ""}` }]);
    try {
      const res = await API.post("/ai/simplify-news", { text });
      const simplified = res.data?.simplified || res.data?.response || "Could not simplify this article.";
      setMessages((prev) => [...prev, { role: "assistant", content: `**Simplified News:**\n\n${simplified}` }]);
      setNewsText("");
      setMode("chat");
      toast.success("News simplified!");
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I couldn't simplify this article. Make sure the text is at least 10 characters." }]);
    } finally { setLoading(false); }
  };

  const quickActions = [
    { label: "Simplify News", Icon: Newspaper, action: () => setMode("news"), desc: "Paste a financial article" },
    { label: "Portfolio Advice", Icon: Briefcase, action: () => setMessage("Can you review my portfolio and suggest improvements?"), desc: "Get AI portfolio tips" },
    { label: "Market Analysis", Icon: BarChart3, action: () => setMessage("What are the current market trends I should know about?"), desc: "Current market trends" },
    { label: "Learn Investing", Icon: GraduationCap, action: () => setMessage("Explain the basics of investing for a beginner"), desc: "Start learning" },
  ];

  const quickQuestions = ["What is inflation?", "Should I diversify my portfolio?", "What is a bear market?", "How do ETFs work?", "What is compound interest?"];

  return (
    <div className={`min-h-[calc(100vh-80px)] flex ${isDark ? 'bg-dark-bg' : 'bg-surface'}`}>
      {/* Sidebar */}
      <div className={`hidden lg:flex flex-col w-72 border-r ${isDark ? 'border-dark-border/30 bg-dark-surface' : 'border-slate-border bg-white'}`}>
        <div className={`p-4 border-b ${isDark ? 'border-dark-border/30' : 'border-slate-border'}`}>
          <button onClick={startNewChat} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {loadingSessions ? (
            <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>Loading...</p>
          ) : sessions.length === 0 ? (
            <p className={`text-sm text-center py-4 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>No chat history yet</p>
          ) : (
            sessions.map((s) => (
              <button key={s.id} onClick={() => loadSession(s.id)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all ${
                  currentSessionId === s.id
                    ? isDark ? "bg-cyan-400/10 text-cyan-400 font-semibold" : "bg-indigo-50 text-indigo-600 font-semibold"
                    : isDark ? "text-gray-400 hover:bg-dark-card" : "text-slate-body hover:bg-surface-subtle"
                }`}
              >
                <p className="font-semibold truncate text-sm">{s.title}</p>
                <p className={`text-xs mt-1 truncate ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>{s.lastMessage}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className={`px-6 py-4 border-b backdrop-blur-sm ${isDark ? 'border-dark-border/30 bg-dark-surface/80' : 'border-slate-border bg-white/80'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-cyan-400/10 text-cyan-400' : 'bg-gradient-to-br from-indigo-100 to-teal-100 text-indigo-500'}`}>
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>AI Financial Advisor</h1>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>Chat, simplify news, get portfolio advice</p>
              </div>
            </div>
            {mode === "news" && (
              <button onClick={() => setMode("chat")} className={`text-sm font-semibold transition-colors flex items-center gap-1 ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-indigo-500 hover:text-indigo-700'}`}>
                <ArrowLeft className="w-4 h-4" /> Back to Chat
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {messages.length === 0 && mode === "chat" && (
            <div className="text-center py-10 animate-slideIn">
              <MessageCircle className={`w-12 h-12 mx-auto mb-4 opacity-40 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`} />
              <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>What can I help you with?</h2>
              <p className={`text-sm mb-6 max-w-md mx-auto ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>
                Ask financial questions, simplify news articles, or get portfolio advice — all in one place.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                {quickActions.map((action, i) => (
                  <button key={i} onClick={action.action}
                    className={`p-4 rounded-xl border transition-all text-left group ${
                      isDark ? 'border-dark-border bg-dark-card hover:border-cyan-400/20 hover:shadow-dark-card' : 'border-slate-border bg-white hover:border-indigo-200 hover:shadow-soft'
                    }`}
                  >
                    <action.Icon className={`w-5 h-5 mb-2 ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`} />
                    <p className={`text-xs font-semibold transition-colors ${isDark ? 'text-gray-200 group-hover:text-cyan-400' : 'text-slate-heading group-hover:text-indigo-500'}`}>
                      {action.label}
                    </p>
                    <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>{action.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {quickQuestions.map((q, i) => (
                  <button key={i} onClick={() => setMessage(q)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      isDark ? 'bg-cyan-400/10 text-cyan-400 hover:bg-cyan-400/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === "news" && messages.length === 0 && (
            <div className="max-w-2xl mx-auto py-10 animate-slideIn">
              <div className="text-center mb-6">
                <Newspaper className={`w-10 h-10 mx-auto mb-3 ${isDark ? 'text-cyan-400' : 'text-indigo-500'}`} />
                <h2 className={`text-xl font-bold mb-2 ${isDark ? 'text-gray-100' : 'text-slate-heading'}`}>Simplify Financial News</h2>
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-slate-muted'}`}>
                  Paste a financial news article and I'll break it down into simple, easy-to-understand language.
                </p>
              </div>
              <textarea value={newsText} onChange={(e) => setNewsText(e.target.value)}
                placeholder="Paste a financial news article here...&#10;&#10;Example: 'The Federal Reserve announced a 25 basis point rate cut today, signaling a shift in monetary policy...'"
                className={`w-full h-48 px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-sm resize-none ${
                  isDark ? 'border-dark-border bg-dark-card text-gray-200 focus:ring-cyan-400/20 focus:border-cyan-400 placeholder-gray-600' : 'border-slate-border bg-white focus:ring-indigo-200 focus:border-indigo-400'
                }`}
                disabled={loading}
              />
              <div className="flex items-center justify-between mt-3">
                <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>
                  {newsText.length}/5000 characters {newsText.length < 10 && newsText.length > 0 && "(min 10)"}
                </span>
                <button onClick={handleSimplifyNews} disabled={loading || newsText.trim().length < 10}
                  className="btn-primary px-6 flex items-center gap-2">
                  {loading ? "Simplifying..." : <><Sparkles className="w-4 h-4" /> Simplify</>}
                </button>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? isDark ? "bg-cyan-500 text-dark-bg rounded-br-md" : "bg-indigo-500 text-white rounded-br-md"
                  : isDark ? "bg-dark-card border border-dark-border/30 text-gray-300 rounded-bl-md shadow-dark-card" : "bg-white border border-slate-border text-slate-body rounded-bl-md shadow-soft"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className={`rounded-2xl rounded-bl-md px-5 py-3.5 ${isDark ? 'bg-dark-card border border-dark-border/30 shadow-dark-card' : 'bg-white border border-slate-border shadow-soft'}`}>
                <div className="flex space-x-1.5">
                  {[0, 150, 300].map((delay) => (
                    <div key={delay} className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-500' : 'bg-slate-muted'}`} style={{ animationDelay: `${delay}ms` }}></div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className={`px-4 sm:px-6 py-4 border-t ${isDark ? 'border-dark-border/30 bg-dark-surface' : 'border-slate-border bg-white'}`}>
          {mode === "news" && messages.length > 0 ? (
            <div className="flex gap-3">
              <button onClick={() => { setMode("news"); setNewsText(""); setMessages([]); }} className="btn-outline flex-1 text-sm flex items-center justify-center gap-2">
                <Newspaper className="w-4 h-4" /> Simplify Another Article
              </button>
              <button onClick={() => setMode("chat")} className="btn-primary flex-1 text-sm flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Continue Chatting
              </button>
            </div>
          ) : mode === "chat" ? (
            <>
              <form onSubmit={handleSend} className="flex gap-3">
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask a financial question or paste news to simplify..."
                  className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all text-sm ${
                    isDark ? 'border-dark-border bg-dark-card text-gray-200 focus:ring-cyan-400/20 focus:border-cyan-400 placeholder-gray-600' : 'border-slate-border bg-surface-subtle focus:ring-indigo-200 focus:border-indigo-400'
                  }`}
                  disabled={loading}
                />
                <button type="button" onClick={() => setMode("news")}
                  className={`px-3 py-3 border rounded-xl transition-all text-sm ${
                    isDark ? 'border-dark-border hover:bg-dark-card hover:border-cyan-400/20' : 'border-slate-border hover:bg-indigo-50 hover:border-indigo-200'
                  }`}
                  title="Simplify News"
                >
                  <Newspaper className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-slate-muted'}`} />
                </button>
                <button type="submit" disabled={loading || !message.trim()} className="btn-primary px-6 flex items-center gap-2">
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
              <p className={`text-[10px] text-center mt-2 ${isDark ? 'text-gray-600' : 'text-slate-muted'}`}>
                AI responses are educational only, not professional financial advice.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
