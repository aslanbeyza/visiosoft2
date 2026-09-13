import config from "../../config/index.js";

async function createLead(payload) {
  const baseUrl = String(config.crm.baseUrl || "").replace(/\/$/, "");
  const apiKey = config.crm.apiKey;

  if (!baseUrl || !apiKey) {
    throw new Error("CRM lead intake is not configured.");
  }

  const response = await fetch(`${baseUrl}/api/crm/leads`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`CRM request failed (${response.status}): ${text}`);
  }

  return response.json().catch(() => ({}));
}

export default { createLead };
