export async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secretKey = process.env["RECAPTCHA_SECRET_KEY"];

  if (!secretKey || !token) {
    return true;
  }

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });
    const data = (await res.json()) as { success: boolean; score?: number; action?: string };
    if (!data.success) return true;
    const score = data.score ?? 1;
    return score >= 0.3;
  } catch {
    return true;
  }
}
