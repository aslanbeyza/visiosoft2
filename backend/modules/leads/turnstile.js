import config from "../../config/index.js";

async function verifyTurnstile(token, ip) {
  if (!config.turnstile.secret) {
    throw new Error("The cf-turnstile-response verification failed. Please try again.");
  }

  const body = new URLSearchParams({
    secret: config.turnstile.secret,
    response: token,
    remoteip: ip || "",
  });

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(10000),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.success) {
    throw Object.assign(new Error("The cf-turnstile-response verification failed. Please try again."), {
      status: 422,
    });
  }
}

export default { verifyTurnstile };
