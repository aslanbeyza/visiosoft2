import { logger } from "../utils/index.js";
import { query } from "../db/index.js";
import leadModel from "../modules/leads/leadModel.js";
import crmClient from "../modules/leads/crmClient.js";

const BACKOFF_SECONDS = [30, 60, 120, 300];
const MAX_TRIES = 5;

function buildMessage(lead) {
  const parts = [];
  if (lead.address) {
    parts.push(`Adres: ${lead.address}`);
  }
  if (lead.message) {
    parts.push(lead.message);
  }
  return parts.length ? parts.join("\n\n") : null;
}

function buildPayload(lead) {
  const payload = {
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    message: buildMessage(lead),
    form_name: leadModel.formName(lead.form_type),
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    gclid: lead.gclid,
    referrer: lead.visit_referer || lead.first_referer,
    landing_page: lead.first_landing_url || lead.visit_full_url,
    ip_address: lead.visit_ip || lead.last_ip || lead.first_ip,
    user_agent: lead.last_user_agent || lead.first_user_agent,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== null && value !== undefined && value !== ""),
  );
}

async function enqueue(leadSubmissionId) {
  await query(
    "INSERT INTO background_jobs (name, payload) VALUES ($1, $2::jsonb)",
    ["sync-lead-to-crm", JSON.stringify({ leadSubmissionId })],
  );
}

async function handle(leadSubmissionId) {
  const lead = await leadModel.findWithTracking(leadSubmissionId);
  if (!lead) {
    logger.warn("SyncLeadToCrmJob skipped: lead submission not found", {
      lead_submission_id: leadSubmissionId,
    });
    return;
  }

  await crmClient.createLead(buildPayload(lead));
  await query(
    "UPDATE lead_submissions SET crm_synced_at = NOW(), crm_error = NULL, updated_at = NOW() WHERE id = $1",
    [leadSubmissionId],
  );
}

async function processPendingJobs() {
  const jobs = await query(
    `SELECT * FROM background_jobs
     WHERE failed_at IS NULL AND available_at <= NOW()
     ORDER BY id
     LIMIT 20`,
  );

  for (const job of jobs.rows) {
    try {
      await query("UPDATE background_jobs SET reserved_at = NOW(), attempts = attempts + 1 WHERE id = $1", [
        job.id,
      ]);
      await handle(job.payload.leadSubmissionId);
      await query("DELETE FROM background_jobs WHERE id = $1", [job.id]);
    } catch (error) {
      logger.error("SyncLeadToCrmJob failed", {
        lead_submission_id: job.payload.leadSubmissionId,
        error: error.message,
      });
      await query(
        "UPDATE lead_submissions SET crm_error = $2, updated_at = NOW() WHERE id = $1",
        [job.payload.leadSubmissionId, error.message],
      );

      if (job.attempts + 1 >= MAX_TRIES) {
        await query(
          "UPDATE background_jobs SET failed_at = NOW(), last_error = $2 WHERE id = $1",
          [job.id, error.message],
        );
      } else {
        const delay = BACKOFF_SECONDS[Math.min(job.attempts, BACKOFF_SECONDS.length - 1)];
        await query(
          "UPDATE background_jobs SET available_at = NOW() + ($2 || ' seconds')::interval, last_error = $3, reserved_at = NULL WHERE id = $1",
          [job.id, String(delay), error.message],
        );
      }
    }
  }
}

export default {
  enqueue,
  handle,
  processPendingJobs,
};
