import json
import time

import httpx
from playwright.sync_api import sync_playwright


API_BASE = "http://127.0.0.1:5001/api/v1"
APP_BASE = "http://localhost:5173"


def in_viewport(page, locator):
    box = locator.bounding_box()
    viewport = page.viewport_size or {"width": 0, "height": 0}
    return bool(
        box
        and box["x"] >= 0
        and box["y"] >= 0
        and box["x"] + box["width"] <= viewport["width"]
        and box["y"] + box["height"] <= viewport["height"]
    )


def create_user():
    email = f"onboarding.check.{int(time.time())}@example.com"
    password = "OnboardingPass123"

    with httpx.Client(base_url=API_BASE, timeout=30.0) as client:
        register = client.post(
            "/auth/register",
            json={
                "name": "Onboarding Check",
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

        return login.json()["token"]


def main():
    token = create_user()

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 960})

        page.goto(APP_BASE, wait_until="networkidle", timeout=60000)
        page.evaluate("(value) => localStorage.setItem('token', value)", token)
        page.goto(f"{APP_BASE}/dashboard", wait_until="networkidle", timeout=60000)

        page.get_by_role("button", name="Continue", exact=True).click()
        page.get_by_role("button", name="Continue", exact=True).click()

        page.get_by_text("Quick literacy check.").wait_for(timeout=15000)
        complete_button = page.get_by_role("button", name="Complete onboarding")
        button_visible = complete_button.is_visible()
        button_in_viewport = in_viewport(page, complete_button)

        option_buttons = page.locator("button").filter(has_text="To spread risk across different assets")
        option_buttons.first.click()
        page.locator("button").filter(has_text="Borrowing often gets more expensive").first.click()
        page.locator("button").filter(has_text="A fund traded on an exchange").first.click()
        page.locator("button").filter(has_text="Returns can earn returns over time").first.click()
        page.locator("button").filter(
            has_text="How much of the portfolio sits in one asset or sector"
        ).first.click()

        complete_button.click()
        page.get_by_text("Your workspace is ready.").wait_for(timeout=15000)

        modal_gone = page.get_by_text("First-time setup").count() == 0

        result = {
          "complete_button_visible": button_visible,
          "complete_button_in_viewport": button_in_viewport,
          "modal_closed_after_submit": modal_gone,
        }
        print(json.dumps(result, indent=2))
        browser.close()


if __name__ == "__main__":
    main()
