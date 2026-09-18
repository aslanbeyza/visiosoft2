import { asyncHandler, logger } from "../../utils/index.js";
import { crmJob } from "../../jobs/index.js";
import leadModel from "./leadModel.js";
import validators from "./validators.js";
import turnstile from "./turnstile.js";
import mailService from "./mailService.js";

function trackingData(req, includeUserInfo = false) {
  const data = { ...(req.session?.visitor_tracking || {}) };
  if (includeUserInfo) {
    data.user_info = {
      ip: req.clientIp,
      user_agent: req.get("user-agent"),
    };
  }
  return data;
}

function projectTypeLabel(projectType) {
  if (projectType === "paid") return "Ücretli otopark";
  if (projectType === "subscription") return "Sadece abonelik";
  return "Belirtilmedi";
}

function paymentMethodsLabel(projectType, paymentMethods = []) {
  if (projectType !== "paid") {
    return "Yok";
  }
  const labels = paymentMethods.map((item) => {
    if (item === "card") return "Kart";
    if (item === "hgs") return "HGS";
    return item;
  });
  return labels.length ? labels.join(", ") : "Seçilmedi";
}

function buildParkingMessage(validated) {
  const lines = [
    `Senaryo: ${projectTypeLabel(validated.project_type)}`,
    `Ödeme Kanalları: ${paymentMethodsLabel(validated.project_type, validated.payment_methods || [])}`,
    `Bariyer: ${validated.needs_barrier ? "Evet" : "Hayır"}`,
    `Anahtar Teslim Kurulum: ${validated.needs_turnkey_installation ? "Evet" : "Hayır"}`,
  ];

  const message = String(validated.message || "").trim();
  if (message) {
    lines.push("", `Müşteri Notu: ${message}`);
  }

  return lines.join("\n");
}

async function persistAndNotify({ req, formType, validated, message, products, address, sendMail, successMessage, errorMessage }) {
  const submittedAt = new Date();
  const lead = await leadModel.createLead({
    traffic_visitor_id: req.trackedVisitorId || null,
    traffic_visit_id: req.trackedVisitId || null,
    form_type: formType,
    name: validated.name,
    email: validated.email,
    phone: validated.phone,
    company: validated.company || null,
    address: address || null,
    message: message || null,
    products: products || null,
    turnstile_validated: true,
    submitted_at: submittedAt,
  });

  logger.info("Lead received", {
    form_type: formType,
    lead_submission_id: lead.id,
    recipient: mailService.recipient(),
  });

  await crmJob.enqueue(lead.id);
  crmJob.processPendingJobs().catch((error) => {
    logger.warn("CRM job worker error", { error: error.message });
  });

  try {
    await sendMail();
    await leadModel.markMailResult(lead.id, { sent: true });
  } catch (error) {
    await leadModel.markMailResult(lead.id, { sent: false, error: error.message });
    logger.error("Lead mail failed", {
      form_type: formType,
      lead_submission_id: lead.id,
      error: error.message,
    });
    const err = new Error(errorMessage);
    err.status = 500;
    throw err;
  }

  return { message: successMessage, lead_id: lead.id };
}

const storeQuote = asyncHandler(async (req, res) => {
  validators.validateQuote(req.body);
  await turnstile.verifyTurnstile(req.body["cf-turnstile-response"], req.clientIp);

  const result = await persistAndNotify({
    req,
    formType: leadModel.FORM_TYPES.QUOTE,
    validated: req.body,
    message: req.body.message || null,
    products: req.body.products || null,
    sendMail: () => mailService.sendQuoteMail(req.body, trackingData(req, true)),
    successMessage: "Teklif talebiniz başarıyla alındı.",
    errorMessage: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  });

  res.json({ message: result.message });
});

const storeParkingQuote = asyncHandler(async (req, res) => {
  validators.validateParkingQuote(req.body);
  await turnstile.verifyTurnstile(req.body["cf-turnstile-response"], req.clientIp);

  const result = await persistAndNotify({
    req,
    formType: leadModel.FORM_TYPES.PARKING_QUOTE_ENGINE,
    validated: req.body,
    message: buildParkingMessage(req.body),
    products: req.body.products,
    sendMail: () => mailService.sendParkingQuoteMail(req.body, trackingData(req, true)),
    successMessage: "Talebiniz alındı.",
    errorMessage: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  });

  res.json({ message: result.message });
});

const storeDiscovery = asyncHandler(async (req, res) => {
  validators.validateDiscovery(req.body);
  await turnstile.verifyTurnstile(req.body["cf-turnstile-response"], req.clientIp);

  const result = await persistAndNotify({
    req,
    formType: leadModel.FORM_TYPES.DISCOVERY,
    validated: req.body,
    address: req.body.address,
    message: req.body.message || null,
    sendMail: () => mailService.sendDiscoveryMail(req.body, trackingData(req, false)),
    successMessage: "Ücretsiz keşif talebiniz alındı. En kısa sürede iletişime geçeceğiz.",
    errorMessage: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  });

  res.json({ message: result.message });
});

const storeContact = asyncHandler(async (req, res) => {
  validators.validateContact(req.body);
  await turnstile.verifyTurnstile(req.body["cf-turnstile-response"], req.clientIp);

  const result = await persistAndNotify({
    req,
    formType: leadModel.FORM_TYPES.CONTACT,
    validated: req.body,
    message: req.body.message || null,
    sendMail: () => mailService.sendContactMail(req.body, trackingData(req, true)),
    successMessage: "Mesajınız alındı. En kısa sürede iletişime geçeceğiz.",
    errorMessage: "Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.",
  });

  res.json({ message: result.message });
});

export default {
  storeQuote,
  storeParkingQuote,
  storeDiscovery,
  storeContact,
};
