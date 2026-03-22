"""
AI Financial Chatbot Service
Primary: Groq Llama 3.3 70B (ultra-fast inference for real-time chat)
Fallback: Google Gemini 2.5 Flash (if Groq is unavailable)
"""


def chat_response(message: str, history: list, portfolio_context: dict,
                   groq_client=None, gemini_model=None) -> dict:
    """Generate a financial chatbot response using Groq (primary) or Gemini (fallback)."""

    # Build system context
    system_content = (
        "You are an AI financial advisor chatbot for MarketMakers platform. "
        "You help users understand financial concepts, provide general investment education, "
        "and answer questions about their portfolio. "
        "Always remind users that your responses are educational and not professional financial advice."
    )

    if portfolio_context and portfolio_context.get("totalValue", 0) > 0:
        assets_list = ", ".join(
            [f"{a['name']} (${a['amount']:,.0f})" for a in portfolio_context.get("assets", [])]
        )
        system_content += (
            f"\n\nThe user's portfolio: Total value ${portfolio_context['totalValue']:,.2f}. "
            f"Assets: {assets_list}"
        )

    # ─── Try Groq first (fastest inference) ────────────────────────────
    if groq_client:
        try:
            messages = [{"role": "system", "content": system_content}]

            # Add conversation history (last 8 messages)
            for msg in history[-8:]:
                messages.append({
                    "role": msg["role"] if msg["role"] in ("user", "assistant") else "user",
                    "content": msg["content"]
                })

            messages.append({"role": "user", "content": message})

            response = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=messages,
                temperature=0.7,
                max_tokens=1024,
            )
            return {"response": response.choices[0].message.content.strip()}
        except Exception as e:
            print(f"⚠️  Groq failed, falling back to Gemini: {e}")

    # ─── Fallback to Gemini ────────────────────────────────────────────
    if gemini_model:
        try:
            conversation = f"System: {system_content}\n\n"
            for msg in history[-8:]:
                role = "User" if msg["role"] == "user" else "Assistant"
                conversation += f"{role}: {msg['content']}\n"
            conversation += f"User: {message}\nAssistant:"

            response = gemini_model.generate_content(conversation)
            return {"response": response.text.strip()}
        except Exception:
            pass

    # ─── Final fallback ────────────────────────────────────────────────
    return {
        "response": "I'm sorry, I couldn't process your question right now. Please try again in a moment. "
                    "In the meantime, feel free to explore our educational courses for financial learning!"
    }
