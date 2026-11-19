import { useEffect, useState } from "react";

interface Sent {
  to: string;
  at: string;
}

const PIN_KEY = "ea_staff_pin";
const LOG_KEY = "ea_sent_links";

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export default function TeamSendLink() {
  const [pin, setPin] = useState<string>(() => load(PIN_KEY, ""));
  const [pinOk, setPinOk] = useState(false);
  const [pinDraft, setPinDraft] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [sent, setSent] = useState<Sent[]>(() => {
    const today = new Date().toDateString();
    return load<Sent[]>(LOG_KEY, []).filter((s) => new Date(s.at).toDateString() === today);
  });

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    document.title = "Send enquiry link | Edward & Amaury";
    return () => meta.remove();
  }, []);

  useEffect(() => {
    if (!pin) return;
    fetch("/api/team/check-pin", { method: "POST", headers: { "x-staff-pin": pin } })
      .then((r) => {
        if (r.ok) setPinOk(true);
        else {
          setPin("");
          save(PIN_KEY, "");
        }
      })
      .catch(() => setPinOk(true));
  }, [pin]);

  const submitPin = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/team/check-pin", { method: "POST", headers: { "x-staff-pin": pinDraft.trim() } });
    if (r.ok) {
      save(PIN_KEY, pinDraft.trim());
      setPin(pinDraft.trim());
      setPinOk(true);
      setMessage(null);
    } else {
      const j = await r.json().catch(() => ({}));
      setMessage({ kind: "error", text: j.error ?? "Wrong PIN." });
    }
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await fetch("/api/team/send-visa-link", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-staff-pin": pin },
        body: JSON.stringify({ phone }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok) {
        const next = [{ to: j.to, at: new Date().toISOString() }, ...sent];
        setSent(next);
        save(LOG_KEY, next);
        setPhone("");
        setMessage({ kind: "ok", text: `Link sent to ${j.to}. Ask the caller to check their texts now.` });
      } else {
        setMessage({ kind: "error", text: j.error ?? "Something went wrong. The text was not sent." });
      }
    } catch {
      setMessage({ kind: "error", text: "No internet connection. The text was not sent." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-[#1a3a4a] text-white rounded-t-2xl px-5 py-4">
          <p className="font-semibold">Edward &amp; Amaury Solicitors</p>
          <p className="text-sm text-gray-300">Text a spouse visa enquiry link to a caller</p>
        </div>
        <div className="bg-white border border-gray-200 border-t-0 rounded-b-2xl p-5 space-y-4">
          {!pinOk ? (
            <form onSubmit={submitPin} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Staff PIN</label>
              <input
                autoFocus
                type="password"
                value={pinDraft}
                onChange={(e) => setPinDraft(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
              />
              <button className="w-full bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-3 rounded-xl">
                Unlock
              </button>
            </form>
          ) : (
            <form onSubmit={send} className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Caller's mobile number</label>
              <input
                autoFocus
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07... or +country code"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
              />
              <button
                disabled={busy || !phone.trim()}
                className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-50 text-white font-bold py-3 rounded-xl"
              >
                {busy ? "Sending..." : "Send the link"}
              </button>
            </form>
          )}

          {message && (
            <p className={`text-sm rounded-lg px-3 py-2 ${message.kind === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </p>
          )}

          {pinOk && sent.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sent today on this computer</p>
              <ul className="text-sm text-gray-600 divide-y divide-gray-100">
                {sent.map((s) => (
                  <li key={s.at} className="py-1.5 flex justify-between">
                    <span>{s.to}</span>
                    <span>{new Date(s.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
