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

function excerpt(entry) {
  if (typeof entry.excerpt === "string" && entry.excerpt.trim()) {
    return entry.excerpt.trim();
  }
  const text = String(entry.content || "").replace(/<[^>]+>/g, "");
  return text.slice(0, 160);
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
      const html = /<[a-z][\s\S]*>/i.test(parsed.content) ? parsed.content : marked.parse(parsed.content);
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
