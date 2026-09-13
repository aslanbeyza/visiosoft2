class ValidationError extends Error {
  constructor(errors) {
    super("Validation failed");
    this.name = "ValidationError";
    this.status = 422;
    this.errors = errors;
  }
}

function requiredString(value, field, max) {
  if (typeof value !== "string" || value.trim() === "") {
    return `${field} zorunludur`;
  }
  if (max && value.length > max) {
    return `${field} en fazla ${max} karakter olabilir`;
  }
  return null;
}

function optionalString(value, field, max) {
  if (value === undefined || value === null || value === "") {
    return null;
  }
  if (typeof value !== "string") {
    return `${field} metin olmalıdır`;
  }
  if (max && value.length > max) {
    return `${field} en fazla ${max} karakter olabilir`;
  }
  return null;
}

function emailRule(value, field = "email") {
  const required = requiredString(value, field, 255);
  if (required) {
    return required;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return "Geçerli bir e-posta giriniz";
  }
  return null;
}

function collectErrors(checks) {
  const errors = {};
  for (const [field, message] of Object.entries(checks)) {
    if (message) {
      errors[field] = [message];
    }
  }
  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
}

export {
  ValidationError,
  requiredString,
  optionalString,
  emailRule,
  collectErrors,
};
