function slugify(text) {
  return String(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function uniqueHeadingId(text, usedIds) {
  const base = slugify(text) || "section";
  let id = base;
  let suffix = 2;

  while (usedIds.includes(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }

  return id;
}

export { slugify, uniqueHeadingId };
