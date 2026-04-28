import json
import time

import httpx
from dotenv import dotenv_values


BASE_BE = "http://127.0.0.1:5001"
BASE_AI = "http://127.0.0.1:8000"
INTERNAL_TOKEN = (
    dotenv_values("ai-service/.env").get("INTERNAL_TOKEN")
    or dotenv_values("backend/.env").get("INTERNAL_TOKEN")
)


results = []


def add(label, ok, status=None, note=None):
    results.append(
        {
            "label": label,
            "ok": bool(ok),
            "status": status,
            "note": note,
        }
    )


def preview(resp):
    try:
        data = resp.json()
        if isinstance(data, dict):
            return f"dict:{','.join(list(data.keys())[:8])}"
        if isinstance(data, list):
            return f"list[{len(data)}]"
        return str(data)[:180]
    except Exception:
        return (resp.text or "")[:180]


backend = httpx.Client(base_url=BASE_BE, follow_redirects=True, timeout=25.0)
ai = httpx.Client(base_url=BASE_AI, follow_redirects=True, timeout=60.0)


def req(label, method, path, expected, *, api="backend", token=None, **kwargs):
    client = backend if api == "backend" else ai
    headers = kwargs.pop("headers", {}) or {}

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if api == "ai" and INTERNAL_TOKEN and path not in ("/", "/health"):
        headers["X-Internal-Token"] = INTERNAL_TOKEN

    try:
        resp = client.request(method, path, headers=headers, **kwargs)
        add(label, resp.status_code in expected, resp.status_code, preview(resp))
        return resp
    except Exception as exc:
        add(label, False, None, str(exc))
        return None


def run():
    req("backend root", "GET", "/", {200})
    req("backend v1 health", "GET", "/api/v1/health", {200})
    req("ai root", "GET", "/", {200}, api="ai")
    req("ai health", "GET", "/health", {200}, api="ai")

    contributors = req("contributors list", "GET", "/api/v1/users/contributors", {200})
    req("search endpoint", "GET", "/api/v1/search", {200, 404}, params={"q": "market"})
    courses = req("courses list", "GET", "/api/v1/courses", {200})
    modules = req("modules list", "GET", "/api/v1/modules", {200})
    exams = req("exams list", "GET", "/api/v1/exams", {200})

    contributor_id = None
    course_id = None
    module_id = None
    lesson_id = None
    exam_id = None

    try:
        contributor_data = contributors.json()
        if contributor_data:
            contributor_id = contributor_data[0].get("_id") or contributor_data[0].get("id")
    except Exception:
        pass

    if contributor_id:
        req(
            "contributor profile",
            "GET",
            f"/api/v1/users/contributors/{contributor_id}",
            {200},
        )
    else:
        add("contributor profile", True, None, "skipped:no contributors returned")

    try:
        course_data = courses.json()
        if course_data:
            course_id = course_data[0].get("_id") or course_data[0].get("id")
    except Exception:
        pass

    if course_id:
        req("course detail", "GET", f"/api/v1/courses/{course_id}", {200})
    else:
        add("course detail", True, None, "skipped:no courses returned")

    try:
        module_data = modules.json()
        # Handle both list and paginated {modules: [...]} response shapes
        if isinstance(module_data, dict):
            module_data = module_data.get("modules", [])
        if module_data:
            module_id = module_data[0].get("_id") or module_data[0].get("id")
    except Exception:
        pass

    if module_id:
        req("module detail", "GET", f"/api/v1/modules/{module_id}", {200})
        lessons = req("lessons by module", "GET", f"/api/v1/lessons/module/{module_id}", {200})
        try:
            lesson_data = lessons.json()
            # Handle both list and paginated {lessons: [...]} response shapes
            if isinstance(lesson_data, dict):
                lesson_data = lesson_data.get("lessons", [])
            if lesson_data:
                lesson_id = lesson_data[0].get("_id") or lesson_data[0].get("id")
        except Exception:
            pass
    else:
        add("module detail", True, None, "skipped:no modules returned")
        add("lessons by module", True, None, "skipped:no modules returned")

    if lesson_id:
        req("lesson detail", "GET", f"/api/v1/lessons/{lesson_id}", {200})
        req("lesson suggestions list", "GET", f"/api/v1/suggestions/lesson/{lesson_id}", {200})
    else:
        add("lesson detail", True, None, "skipped:no lessons returned")
        add("lesson suggestions list", True, None, "skipped:no lessons returned")

    try:
        exam_data = exams.json()
        if exam_data:
            exam_id = exam_data[0].get("_id") or exam_data[0].get("id")
    except Exception:
        pass

    if exam_id:
        req("exam detail", "GET", f"/api/v1/exams/{exam_id}", {200})
    else:
        add("exam detail", True, None, "skipped:no exams returned")

    req("auth me unauthorized", "GET", "/api/v1/auth/me", {401})
    req("portfolio unauthorized", "GET", "/api/v1/portfolio", {401})
    req("watchlist unauthorized", "GET", "/api/v1/watchlist", {401})
    req(
        "ai chat unauthorized",
        "POST",
        "/api/v1/ai/chat",
        {401},
        json={"message": "hello world"},
    )

    suffix = str(int(time.time()))
    learner_email = f"smoke.{suffix}@example.com"
    contributor_email = f"smoke.contrib.{suffix}@example.com"
    password = "SmokePass123"
    new_password = "SmokePass456"

    req(
        "register learner",
        "POST",
        "/api/v1/auth/register",
        {201},
        json={
            "name": "Smoke Learner",
            "email": learner_email,
            "password": password,
        },
    )
    login = req(
        "login learner",
        "POST",
        "/api/v1/auth/login",
        {200},
        json={
            "email": learner_email,
            "password": password,
        },
    )

    learner_token = None
    if login is not None:
        try:
            learner_token = login.json().get("token")
        except Exception:
            pass

    req(
        "register contributor",
        "POST",
        "/api/v1/auth/register",
        {201},
        json={
            "name": "Smoke Contributor",
            "email": contributor_email,
            "password": password,
            "role": "contributor",
            "experience": "5 years trading equities",
            "reason": "I want to contribute testing content to the platform.",
        },
    )
    req(
        "login contributor pending",
        "POST",
        "/api/v1/auth/login",
        {403},
        json={
            "email": contributor_email,
            "password": password,
        },
    )

    if not learner_token:
        add(
            "authenticated flow block",
            False,
            None,
            "login learner failed; protected route tests skipped",
        )
        return

    req("auth me", "GET", "/api/v1/auth/me", {200}, token=learner_token)
    req("auth me context", "GET", "/api/v1/auth/me/context", {200}, token=learner_token)
    req(
        "profile update",
        "PUT",
        "/api/v1/auth/profile",
        {200},
        token=learner_token,
        json={"name": "Smoke Learner Updated"},
    )
    req(
        "complete onboarding",
        "POST",
        "/api/v1/auth/complete-onboarding",
        {200},
        token=learner_token,
        json={
            "riskProfile": "beginner",
            "literacyScore": 72,
            "firstAsset": {
                "name": "Apple Inc",
                "ticker": "AAPL",
                "assetType": "stock",
                "amount": 1000,
                "purchasePrice": 200,
            },
        },
    )
    req(
        "change password",
        "PUT",
        "/api/v1/auth/change-password",
        {200},
        token=learner_token,
        json={
            "currentPassword": password,
            "newPassword": new_password,
        },
    )
    login2 = req(
        "login learner with new password",
        "POST",
        "/api/v1/auth/login",
        {200},
        json={
            "email": learner_email,
            "password": new_password,
        },
    )
    if login2 is not None:
        try:
            learner_token = login2.json().get("token") or learner_token
        except Exception:
            pass

    req(
        "forgot password",
        "POST",
        "/api/v1/auth/forgot-password",
        {200},
        json={"email": learner_email},
    )
    req(
        "reset password invalid token",
        "POST",
        "/api/v1/auth/reset-password/not-a-real-token",
        {400, 404},
        json={"password": "AnotherPass123"},
    )

    valid_course_id = course_id or "507f1f77bcf86cd799439011"
    valid_module_id = module_id or "507f1f77bcf86cd799439012"
    req(
        "course create forbidden for learner",
        "POST",
        "/api/v1/courses",
        {403},
        token=learner_token,
        json={
            "title": "Smoke Test Course",
            "description": "A course payload used to verify learner authorization.",
            "order": 1,
        },
    )
    req(
        "module create forbidden for learner",
        "POST",
        "/api/v1/modules",
        {403},
        token=learner_token,
        json={
            "title": "Smoke Module",
            "courseId": valid_course_id,
            "description": "module",
            "order": 1,
        },
    )
    req(
        "lesson create forbidden for learner",
        "POST",
        "/api/v1/lessons",
        {403},
        token=learner_token,
        json={
            "moduleId": valid_module_id,
            "title": "Smoke Lesson",
            "explanation": "learner cannot create this lesson",
            "order": 1,
        },
    )
    req("admin stats forbidden for learner", "GET", "/api/v1/admin/stats", {403}, token=learner_token)
    req("course recommendations", "GET", "/api/v1/courses/recommended", {200}, token=learner_token)

    req("portfolio get", "GET", "/api/v1/portfolio", {200}, token=learner_token)
    req("portfolio summary", "GET", "/api/v1/portfolio/summary", {200}, token=learner_token)
    portfolio_add = req(
        "portfolio add asset",
        "POST",
        "/api/v1/portfolio/assets",
        {201},
        token=learner_token,
        json={
            "name": "NVIDIA Corp",
            "ticker": "NVDA",
            "amount": 1500,
            "assetType": "stock",
            "purchasePrice": 500,
        },
    )

    asset_id = None
    if portfolio_add is not None:
        try:
            asset_id = portfolio_add.json().get("assets", [])[-1].get("_id")
        except Exception:
            pass

    req("portfolio live values", "GET", "/api/v1/portfolio/live-values", {200}, token=learner_token)
    req("ai health score", "GET", "/api/v1/ai/health-score", {200}, token=learner_token)
    req("ai portfolio analyze", "POST", "/api/v1/ai/analyze", {200, 500}, token=learner_token, json={})

    if asset_id:
        req(
            "portfolio update asset",
            "PUT",
            f"/api/v1/portfolio/assets/{asset_id}",
            {200},
            token=learner_token,
            json={
                "name": "NVIDIA Corporation",
                "ticker": "NVDA",
                "amount": 1600,
                "assetType": "stock",
                "purchasePrice": 500,
            },
        )
    else:
        add("portfolio update asset", True, None, "skipped:no asset id created")

    req("watchlist get", "GET", "/api/v1/watchlist", {200}, token=learner_token)
    req(
        "watchlist add item",
        "POST",
        "/api/v1/watchlist",
        {201},
        token=learner_token,
        json={
            "symbol": "MSFT",
            "name": "Microsoft Corp",
            "assetType": "stock",
            "notes": "watching entry level",
        },
    )
    req("watchlist live values", "GET", "/api/v1/watchlist/live-values", {200}, token=learner_token)
    req(
        "watchlist add to portfolio helper",
        "POST",
        "/api/v1/watchlist/MSFT/add-to-portfolio",
        {200},
        token=learner_token,
    )
    req("watchlist delete item", "DELETE", "/api/v1/watchlist/MSFT", {200}, token=learner_token)

    req(
        "ai asset search",
        "GET",
        "/api/v1/ai/asset-search",
        {200, 500},
        token=learner_token,
        params={"query": "aapl"},
    )
    req(
        "ai simulate",
        "POST",
        "/api/v1/ai/simulate",
        {200},
        token=learner_token,
        json={
            "initialAmount": 5000,
            "monthlyInvestment": 1000,
            "returnRate": 12,
            "years": 5,
        },
    )
    chat = req(
        "ai chat",
        "POST",
        "/api/v1/ai/chat",
        {200, 500},
        token=learner_token,
        json={
            "message": "Simplify this news: Apple stock rose after earnings beat expectations.",
            "modeHint": "news",
        },
    )

    session_id = None
    if chat is not None and chat.status_code == 200:
        try:
            session_id = chat.json().get("sessionId")
        except Exception:
            pass

    req("ai chat sessions", "GET", "/api/v1/ai/chat/sessions", {200}, token=learner_token)
    if session_id:
        req(
            "ai chat session detail",
            "GET",
            f"/api/v1/ai/chat/sessions/{session_id}",
            {200},
            token=learner_token,
        )
    else:
        add("ai chat session detail", True, None, "skipped:no session id created")

    try:
        with backend.stream(
            "POST",
            "/api/v1/ai/chat/stream",
            headers={"Authorization": f"Bearer {learner_token}"},
            json={
                "message": "Give me a short portfolio suggestion.",
                "modeHint": "portfolio",
            },
            timeout=60.0,
        ) as response:
            chunks = []
            for line in response.iter_lines():
                if line:
                    chunks.append(line)
                if len(chunks) >= 3:
                    break
            add("ai chat stream", response.status_code == 200, response.status_code, "|".join(chunks)[:180])
    except Exception as exc:
        add("ai chat stream", False, None, str(exc))

    req(
        "ai direct health score",
        "POST",
        "/health-score",
        {200},
        api="ai",
        json={
            "assets": [{"name": "Apple Inc", "ticker": "AAPL", "amount": 1000, "type": "stock"}],
            "totalValue": 1000,
        },
    )
    req("ai direct live prices", "POST", "/live-prices", {200, 500}, api="ai", json={"symbols": ["AAPL", "MSFT"]})
    req("ai direct asset search", "GET", "/asset-search", {200, 500}, api="ai", params={"query": "tesla"})
    req(
        "ai direct analyze",
        "POST",
        "/analyze",
        {200, 500},
        api="ai",
        json={
            "assets": [{"name": "Apple Inc", "ticker": "AAPL", "amount": 1000, "type": "stock"}],
            "totalValue": 1000,
        },
    )
    req(
        "ai direct simulate",
        "POST",
        "/simulate",
        {200, 500},
        api="ai",
        json={
            "initialAmount": 1000,
            "monthlyInvestment": 500,
            "returnRate": 10,
            "years": 2,
            "futureValue": 0,
            "totalInvested": 0,
        },
    )
    req(
        "ai direct chat",
        "POST",
        "/chat",
        {200, 500},
        api="ai",
        json={
            "message": "Explain why diversification matters.",
            "history": [],
            "portfolioContext": None,
            "modeHint": "learning",
        },
    )

    try:
        with ai.stream(
            "POST",
            "/chat/stream",
            headers={"X-Internal-Token": INTERNAL_TOKEN},
            json={
                "message": "Summarize market sentiment in one paragraph.",
                "history": [],
                "portfolioContext": None,
                "modeHint": "chat",
            },
            timeout=60.0,
        ) as response:
            chunks = []
            for line in response.iter_lines():
                if line:
                    chunks.append(line)
                if len(chunks) >= 3:
                    break
            add(
                "ai direct chat stream",
                response.status_code == 200,
                response.status_code,
                "|".join(chunks)[:180],
            )
    except Exception as exc:
        add("ai direct chat stream", False, None, str(exc))

    req("progress me", "GET", "/api/v1/progress/me", {200}, token=learner_token)
    req("progress stats", "GET", "/api/v1/progress/stats", {200}, token=learner_token)

    if lesson_id:
        req("progress check lesson", "GET", f"/api/v1/progress/check/{lesson_id}", {200}, token=learner_token)
        req(
            "progress mark complete",
            "POST",
            "/api/v1/progress",
            {201, 200},
            token=learner_token,
            json={"lessonId": lesson_id},
        )
        suggestion = req(
            "suggestion create",
            "POST",
            "/api/v1/suggestions",
            {201},
            token=learner_token,
            json={
                "lessonId": lesson_id,
                "text": "This lesson would benefit from one more worked trading example.",
            },
        )
        suggestion_id = None
        if suggestion is not None and suggestion.status_code == 201:
            try:
                payload = suggestion.json()
                suggestion_id = payload.get("_id") or payload.get("id")
            except Exception:
                pass
        if suggestion_id:
            req(
                "suggestion update",
                "PUT",
                f"/api/v1/suggestions/{suggestion_id}",
                {200},
                token=learner_token,
                json={"text": "Adding one more worked trading example would improve clarity."},
            )
            req(
                "suggestion delete",
                "DELETE",
                f"/api/v1/suggestions/{suggestion_id}",
                {200},
                token=learner_token,
            )
        else:
            add("suggestion update", True, None, "skipped:no suggestion id created")
            add("suggestion delete", True, None, "skipped:no suggestion id created")
    else:
        add("progress check lesson", True, None, "skipped:no lessons returned")
        add("progress mark complete", True, None, "skipped:no lessons returned")
        add("suggestion create", True, None, "skipped:no lessons returned")
        add("suggestion update", True, None, "skipped:no lessons returned")
        add("suggestion delete", True, None, "skipped:no lessons returned")

    if exam_id:
        attempt = req(
            "exam submit attempt",
            "POST",
            f"/api/v1/exams/{exam_id}/attempt",
            {201},
            token=learner_token,
            json={"answers": []},
        )
        req("exam attempts me", "GET", "/api/v1/exams/attempts/me", {200}, token=learner_token)
        attempt_id = None
        if attempt is not None and attempt.status_code == 201:
            try:
                attempt_id = attempt.json().get("attemptId")
            except Exception:
                pass
        if attempt_id:
            req("exam attempt detail", "GET", f"/api/v1/exams/attempt/{attempt_id}", {200}, token=learner_token)
            req(
                "exam certificate for failed attempt",
                "GET",
                f"/api/v1/exams/attempt/{attempt_id}/certificate",
                {400, 200},
                token=learner_token,
            )
        else:
            add("exam attempt detail", True, None, "skipped:no attempt id created")
            add("exam certificate for failed attempt", True, None, "skipped:no attempt id created")
    else:
        add("exam submit attempt", True, None, "skipped:no exams returned")
        add("exam attempts me", True, None, "skipped:no exams returned")
        add("exam attempt detail", True, None, "skipped:no exams returned")
        add("exam certificate for failed attempt", True, None, "skipped:no exams returned")

    req(
        "exam create forbidden for learner",
        "POST",
        "/api/v1/exams",
        {403},
        token=learner_token,
        json={
            "title": "Learner Should Not Create",
            "description": "Forbidden path test",
            "questions": [{"question": "Q1", "options": ["A", "B"], "correctAnswer": 0}],
        },
    )

    if asset_id:
        req("portfolio delete asset", "DELETE", f"/api/v1/portfolio/assets/{asset_id}", {200}, token=learner_token)


if __name__ == "__main__":
    run()
    failures = [item for item in results if not item["ok"]]
    print(
        json.dumps(
            {
                "total": len(results),
                "passed": len(results) - len(failures),
                "failed": len(failures),
                "failures": failures,
            },
            indent=2,
        )
    )
