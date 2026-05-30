import { useEffect, useState, useCallback } from "react";

export type Consent = "accepted" | "rejected" | null;

const KEY = "carta_cookie_consent";

function read(): Consent {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.value === "accepted" || parsed?.value === "rejected" ? parsed.value : null;
  } catch { return null; }
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<Consent>(() => read());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) setConsent(read()); };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (value: "accepted" | "rejected") => {
    try { localStorage.setItem(KEY, JSON.stringify({ value, date: new Date().toISOString() })); } catch { /* ignore */ }
    setConsent(value);
    window.dispatchEvent(new CustomEvent("cookieconsentchange", { detail: value }));
  };

  const accept = useCallback(() => persist("accepted"), []);
  const reject = useCallback(() => persist("rejected"), []);
  const reset = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
    setConsent(null);
    window.dispatchEvent(new CustomEvent("cookieconsentchange", { detail: null }));
  }, []);

  return { consent, accept, reject, reset };
}
