import { collectErrors, requiredString, optionalString, emailRule } from "../../utils/index.js";

function assertHoneypot(body) {
  if (!Object.prototype.hasOwnProperty.call(body, "website_url")) {
    return "website_url alanı zorunludur";
  }
  if (body.website_url) {
    return "Geçersiz istek";
  }
  return null;
}

function contactFields(body) {
  return {
    name: requiredString(body.name, "name", 255),
    email: emailRule(body.email),
    phone: requiredString(body.phone, "phone", 20),
    company: optionalString(body.company, "company", 255),
    message: optionalString(body.message, "message"),
    "website_url": assertHoneypot(body),
    "cf-turnstile-response": requiredString(body["cf-turnstile-response"], "cf-turnstile-response"),
  };
}

function validateQuote(body) {
  collectErrors({
    ...contactFields(body),
    products: body.products !== undefined && body.products !== null && !Array.isArray(body.products)
      ? "products dizi olmalıdır"
      : null,
  });
}

function validateDiscovery(body) {
  collectErrors({
    ...contactFields(body),
    address: requiredString(body.address, "address"),
  });
}

function validateParkingQuote(body) {
  const errors = {
    ...contactFields(body),
    project_type: !["paid", "subscription"].includes(body.project_type)
      ? "project_type paid veya subscription olmalıdır"
      : null,
    needs_barrier: typeof body.needs_barrier !== "boolean" ? "needs_barrier boolean olmalıdır" : null,
    needs_turnkey_installation:
      typeof body.needs_turnkey_installation !== "boolean"
        ? "needs_turnkey_installation boolean olmalıdır"
        : null,
    products: !Array.isArray(body.products) || body.products.length < 1
      ? "En az bir ürün gerekli"
      : null,
  };

  if (Array.isArray(body.products)) {
    body.products.forEach((product, index) => {
      if (!product?.id || String(product.id).length > 100) {
        errors[`products.${index}.id`] = "Geçersiz ürün id";
      }
      if (!product?.name || String(product.name).length > 255) {
        errors[`products.${index}.name`] = "Geçersiz ürün adı";
      }
      if (!Number.isInteger(product?.qty) || product.qty < 1) {
        errors[`products.${index}.qty`] = "Geçersiz ürün adedi";
      }
      if (typeof product?.isFree !== "boolean") {
        errors[`products.${index}.isFree`] = "isFree boolean olmalıdır";
      }
    });
  }

  if (body.project_type === "paid") {
    const methods = Array.isArray(body.payment_methods)
      ? body.payment_methods.filter((item) => ["card", "hgs"].includes(item))
      : [];
    if (methods.length === 0) {
      errors.payment_methods = "Ücretli otopark için ödeme kanalı seçilmelidir";
    }
  }

  collectErrors(errors);
}

export default {
  validateQuote,
  validateDiscovery,
  validateParkingQuote,
};
