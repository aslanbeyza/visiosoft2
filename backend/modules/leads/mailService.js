import nodemailer from "nodemailer";
import config from "../../config/index.js";
import templates from "./mailTemplates.js";

function transporter() {
  return nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    auth: config.mail.user
      ? {
          user: config.mail.user,
          pass: config.mail.pass,
        }
      : undefined,
  });
}

function recipient() {
  return config.mail.quoteTo || config.mail.fromAddress;
}

async function sendLeadMail({ subject, html }) {
  const to = recipient();
  await transporter().sendMail({
    from: `"${config.mail.fromName}" <${config.mail.fromAddress}>`,
    to,
    subject,
    html,
  });
}

async function sendQuoteMail(data, trackingData) {
  await sendLeadMail({
    subject: `Yeni Teklif Talebi - ${data.name}`,
    html: templates.quote(data, trackingData),
  });
}

async function sendParkingQuoteMail(data, trackingData) {
  await sendLeadMail({
    subject: `Yeni Otopark Teklif Motoru Talebi - ${data.name}`,
    html: templates.parkingQuote(data, trackingData),
  });
}

async function sendDiscoveryMail(data, trackingData) {
  await sendLeadMail({
    subject: "Yeni Ücretsiz Keşif Talebi - Visiosoft",
    html: templates.discovery(data, trackingData),
  });
}

export default {
  recipient,
  sendQuoteMail,
  sendParkingQuoteMail,
  sendDiscoveryMail,
};
