#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

async function main() {
    const [, , rawUrl, rawOutputPath] = process.argv;

    if (!rawUrl || !rawOutputPath) {
        throw new Error('Usage: node scripts/generate-pdf.mjs <url> <output-path>');
    }

    const outputPath = path.resolve(rawOutputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage({
        viewport: { width: 1440, height: 2200 },
    });

    page.setDefaultNavigationTimeout(90000);
    page.setDefaultTimeout(60000);

    await page.goto(rawUrl, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'screen' });

    await page.evaluate(async () => {
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }
    });

    await page.waitForTimeout(350);

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '12mm',
            right: '10mm',
            bottom: '12mm',
            left: '10mm',
        },
        preferCSSPageSize: true,
    });

    await browser.close();

    process.stdout.write(`${outputPath}\n`);
}

main().catch((error) => {
    process.stderr.write(`${error?.stack || error?.message || String(error)}\n`);
    process.exit(1);
});
