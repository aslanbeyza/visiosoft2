import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import config from "../../config/index.js";
import contentService from "./contentService.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));

function nodeCandidates() {
  return [...new Set([config.website.nodeBinary, "/usr/local/bin/node", "/opt/homebrew/bin/node", "/usr/bin/node", "/bin/node"].filter(Boolean))];
}

function resolveNodeBinary() {
  for (const candidate of nodeCandidates()) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return process.execPath;
}

function runCommand(command, args, timeoutMs) {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd: path.join(dirname, "../..") });
    let output = "";
    let error = "";
    const timer = setTimeout(() => {
      child.kill();
      resolve({ ok: false, output, error: "Timed out" });
    }, timeoutMs);

    child.stdout.on("data", (chunk) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      error += chunk.toString();
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ ok: code === 0, output: output.trim(), error: error.trim() });
    });
  });
}

function downloadFilename(locale) {
  const defaults = {
    en: "field-user-manual-v3-1.pdf",
    ru: "polevoe-rukovodstvo-v3-1.pdf",
    tr: "saha-kullanim-kilavuzu-v3-1.pdf",
  };
  const manual = contentService.fieldManual(locale);
  const base = String(manual.pdf_filename || "").trim();
  if (!base) {
    return defaults[locale] || defaults.tr;
  }
  return base.endsWith(".pdf") ? base : `${base}.pdf`;
}

async function generate(pageUrl, locale) {
  const scriptPath = path.join(dirname, "../../scripts/generate-pdf.mjs");
  if (!fs.existsSync(scriptPath)) {
    throw new Error("PDF generator script is missing: scripts/generate-pdf.mjs");
  }

  const outputDir = path.join(dirname, "../../storage/manual-pdfs");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, `manual-${randomUUID()}.pdf`);
  const nodeBinary = resolveNodeBinary();
  const result = await runCommand(nodeBinary, [scriptPath, pageUrl, outputPath], 150000);

  if (!result.ok) {
    throw new Error(result.error || result.output || "PDF generator process failed without output.");
  }
  if (!fs.existsSync(outputPath) || fs.statSync(outputPath).size === 0) {
    throw new Error("PDF generation completed without a valid output file.");
  }

  return {
    path: outputPath,
    download_name: downloadFilename(locale),
  };
}

async function diagnostics() {
  const nodeBinary = resolveNodeBinary();
  return {
    node: await runCommand(nodeBinary, ["--version"], 10000),
    playwright_module: await runCommand(
      nodeBinary,
      ["-e", "import('playwright').then(()=>console.log('ok')).catch((e)=>{console.error(e.message);process.exit(1);})"],
      15000,
    ),
    chromium_launch: await runCommand(
      nodeBinary,
      [
        "-e",
        "import('playwright').then(async ({ chromium }) => { const browser = await chromium.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] }); await browser.close(); console.log('ok'); }).catch((e) => { console.error(e.message); process.exit(1); });",
      ],
      25000,
    ),
  };
}

export default { generate, diagnostics };
