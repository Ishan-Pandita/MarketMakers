import json
import time

import httpx
from playwright.sync_api import sync_playwright


API_BASE = "http://127.0.0.1:5001/api/v1"
APP_BASE = "http://localhost:5173"


results = []
console_errors = []
page_errors = []
request_failures = []


def add(label, ok, note=None):
    results.append({"label": label, "ok": bool(ok), "note": note})


def setup_user():
    email = f"browser.smoke.{int(time.time())}@example.com"
    password = "BrowserPass123"
    client = httpx.Client(base_url=API_BASE, timeout=30.0)

    register = client.post(
        "/auth/register",
        json={
            "name": "Browser Smoke",
            "email": email,
            "password": password,
        },
    )
    if register.status_code != 201:
        raise RuntimeError(f"register failed: {register.status_code} {register.text[:200]}")

    login = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )
    if login.status_code != 200:
        raise RuntimeError(f"login failed: {login.status_code} {login.text[:200]}")

    token = login.json()["token"]
    onboarding = client.post(
        "/auth/complete-onboarding",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "riskProfile": "beginner",
            "literacyScore": 78,
            "firstAsset": {
                "name": "Apple Inc",
                "ticker": "AAPL",
                "assetType": "stock",
                "amount": 1000,
                "purchasePrice": 200,
            },
        },
    )
    if onboarding.status_code != 200:
        raise RuntimeError(
            f"onboarding failed: {onboarding.status_code} {onboarding.text[:200]}"
        )

    return email, password, token


def body_has(page, text):
    return text.lower() in (page.locator("body").text_content() or "").lower()


def visit(page, path, label, text=None, url_contains=None):
    page.goto(f"{APP_BASE}{path}", wait_until="networkidle", timeout=60000)
    ok = True
    note = None

    if url_contains and url_contains not in page.url:
        ok = False
        note = f"unexpected-url:{page.url}"

    if ok and text and not body_has(page, text):
        ok = False
        note = f"missing-text:{text}"

    if ok and body_has(page, "Page Not Found") and path != "/this-route-does-not-exist":
        ok = False
        note = "rendered-404"

    add(label, ok, note)


def wait_for_text(page, text, timeout=15000):
    try:
        page.get_by_text(text, exact=False).first.wait_for(timeout=timeout)
    except Exception:
        return False
    return True


def run():
    email, password, token = setup_user()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 960})

        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "requestfailed",
            lambda request: request_failures.append(
                f"{request.method} {request.url} :: {request.failure}"
            ),
        )

        visit(page, "/", "home page", text="MarketMakers")
        visit(page, "/login", "login page", text="Sign In")
        visit(page, "/register", "register page", text="Create Account")
        visit(page, "/forgot-password", "forgot password page")
        visit(page, "/reset-password/test-token", "reset password page")
        visit(page, "/community", "community page", text="Community")
        visit(page, "/about", "about page", text="About Us")
        visit(page, "/careers", "careers page", text="Careers")
        visit(page, "/terms", "terms page", text="Terms of Service")
        visit(page, "/privacy", "privacy page", text="Privacy Policy")
        visit(page, "/cookies", "cookies page", text="Cookie Policy")
        visit(page, "/this-route-does-not-exist", "404 page", text="Page Not Found")

        page.goto(f"{APP_BASE}/dashboard", wait_until="networkidle", timeout=60000)
        add(
            "protected dashboard redirects to login",
            "/login" in page.url,
            None if "/login" in page.url else page.url,
        )

        page.goto(f"{APP_BASE}/login", wait_until="networkidle", timeout=60000)
        add(
            "login form renders",
            body_has(page, "Sign In") and page.locator('input[type="email"]').count() > 0,
            None if page.locator('input[type="email"]').count() > 0 else page.url,
        )

        page.goto(f"{APP_BASE}/", wait_until="networkidle", timeout=60000)
        page.evaluate("(value) => localStorage.setItem('token', value)", token)
        page.goto(f"{APP_BASE}/dashboard", wait_until="networkidle", timeout=60000)
        add(
            "auth hydration from token",
            "/dashboard" in page.url and body_has(page, "Welcome back"),
            None if body_has(page, "Welcome back") else page.url,
        )

        add("dashboard page", body_has(page, "Mission control"))

        page.get_by_role("link", name="Portfolio", exact=True).click()
        page.wait_for_load_state("networkidle")
        wait_for_text(page, "Portfolio workspace")
        portfolio_ok = wait_for_text(page, "Manage, analyze, and simulate in one place.")
        add(
            "portfolio page",
            portfolio_ok,
            None if portfolio_ok else (page.locator("body").text_content() or "")[:250],
        )

        page.get_by_role("link", name="Watchlist", exact=True).click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)
        add("watchlist page", body_has(page, "Live watchlist"))

        page.get_by_role("link", name="Courses", exact=True).click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)
        add("courses page", body_has(page, "All courses"))

        page.get_by_role("link", name="Chatbot", exact=True).click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(3000)
        add("chatbot page", body_has(page, "MarketMakers AI"))

        chat_ok = body_has(page, "MarketMakers AI")
        page.locator("textarea").fill("Explain diversification in one sentence.")
        page.get_by_role("button", name="Send").click()
        page.wait_for_timeout(8000)
        chat_body = page.locator("body").text_content() or ""
        chat_ok = chat_ok and (
            "diversification" in chat_body.lower()
            or "simple explanation" in chat_body.lower()
            or "summary" in chat_body.lower()
        )
        add("chatbot interaction", chat_ok)

        page.get_by_role("link", name="Browser Smoke").click()
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2000)
        add("profile page", body_has(page, "Account Settings"))

        browser.close()

    if console_errors:
        add("browser console errors", False, "\n".join(console_errors[:5]))
    else:
        add("browser console errors", True)

    if page_errors:
        add("browser page errors", False, "\n".join(page_errors[:5]))
    else:
        add("browser page errors", True)

    if request_failures:
        add("browser failed requests", False, "\n".join(request_failures[:5]))
    else:
        add("browser failed requests", True)


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
