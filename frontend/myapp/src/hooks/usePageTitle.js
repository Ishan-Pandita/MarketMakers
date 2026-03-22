// src/hooks/usePageTitle.js
import { useEffect } from "react";

/**
 * Sets the browser tab title for the current page.
 * Automatically appends " — MarketMakers" suffix.
 * @param {string} title - Page title (e.g. "Dashboard", "Courses")
 */
export default function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} — MarketMakers` : "MarketMakers — Trading Education Platform";
    return () => { document.title = prev; };
  }, [title]);
}
