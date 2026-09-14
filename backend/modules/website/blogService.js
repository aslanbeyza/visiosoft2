import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";
import { uniqueHeadingId } from "../../utils/index.js";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const BLOG_DIR = path.join(dirname, "../../data/blog");
let cache = null;

function slugFromPath(filePath) {
  const slug = path.basename(filePath, path.extname(filePath));
  return slug.replace(/\.(en|ru)$/, "");
}

const EXCERPT_MAX = 160;
const NAMED_ENTITIES = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", hellip: "…", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
    if (code[0] === "#") {
      const point = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(point) && point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/** Plain text of rendered HTML: tags removed, entities decoded, whitespace (incl. &nbsp;) collapsed. */
function plainText(html) {
  return decodeEntities(String(html || "").replace(/<[^>]+>/g, " "))
    .replace(/[\s ]+/gu, " ")
    .trim();
}

/** Cuts at the last sentence end within the limit, else at the last word boundary (with an ellipsis). */
function truncate(text, max = EXCERPT_MAX) {
  if (text.length <= max) {
    return text;
  }
  const head = text.slice(0, max + 1);
  const sentenceEnd = Math.max(...[". ", "! ", "? "].map((mark) => head.lastIndexOf(mark)));
  if (sentenceEnd >= max * 0.5) {
    return head.slice(0, sentenceEnd + 1);
  }
  const wordEnd = head.lastIndexOf(" ");
  const cut = (wordEnd > 0 ? head.slice(0, wordEnd) : text.slice(0, max - 1)).slice(0, max - 1).replace(/[\s,;:–—-]+$/u, "");
  return `${cut}…`;
}

function excerpt(entry) {
  if (typeof entry.excerpt === "string" && entry.excerpt.trim()) {
    return plainText(entry.excerpt);
  }
  return truncate(plainText(entry.content));
}

function readingMinutes(entry) {
  const words = String(entry.content || "")
    .replace(/<[^>]+>/g, "")
    .match(/\S+/gu);
  return Math.max(1, Math.ceil((words?.length || 0) / 200));
}

function formattedDate(date) {
  if (!date) {
    return null;
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  const day = String(parsed.getDate()).padStart(2, "0");
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}.${parsed.getFullYear()}`;
}

function parseHeadings(html) {
  const headings = [];
  const usedIds = [];
  const content = html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gis, (match, level, attributes, innerHtml) => {
    const text = innerHtml.replace(/<[^>]+>/g, "").trim();
    if (!text) {
      return match;
    }

    let id;
    const existingId = attributes.match(/id=["']([^"']+)["']/i);
    if (existingId) {
      id = existingId[1];
    } else {
      id = uniqueHeadingId(text, usedIds);
      attributes = ` id="${id}"${attributes}`;
    }

    usedIds.push(id);
    headings.push({ level: Number(level), text, id });
    return `<h${level}${attributes}>${innerHtml}</h${level}>`;
  });

  return { headings, content };
}

function loadAll() {
  if (cache) {
    return cache;
  }

  cache = fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const filePath = path.join(BLOG_DIR, file);
      const parsed = matter(fs.readFileSync(filePath, "utf8"));
      // marked passes inline and block HTML through, so mixed Markdown + HTML files render correctly too.
      const html = marked.parse(parsed.content);
      const { headings, content } = parseHeadings(String(html));

      return {
        id: parsed.data.id,
        title: parsed.data.title,
        locale: parsed.data.locale,
        date: parsed.data.date,
        formatted_date: formattedDate(parsed.data.date),
        featured_image: parsed.data.featured_image || null,
        excerpt: excerpt({ excerpt: parsed.data.excerpt, content: html }),
        slug: slugFromPath(filePath),
        reading_minutes: readingMinutes({ content: html }),
        headings,
        content,
      };
    })
    .filter((entry) => entry.title && entry.locale && entry.date)
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return cache;
}

function forLocale(locale) {
  return loadAll().filter((entry) => entry.locale === locale);
}

function findByLocaleAndSlug(locale, slug) {
  return forLocale(locale).find((entry) => entry.slug === slug) || null;
}

function localeForSlug(slug) {
  return loadAll().find((entry) => entry.slug === slug)?.locale || null;
}

function related(post, locale, limit = 3) {
  return forLocale(locale)
    .filter((entry) => entry.slug !== post.slug)
    .slice(0, limit);
}

function listSummaries(locale) {
  return forLocale(locale).map(({ content, headings, ...summary }) => summary);
}

export default {
  forLocale,
  findByLocaleAndSlug,
  localeForSlug,
  related,
  listSummaries,
};
