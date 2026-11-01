// Shared field validators for India-targeted forms (checkout, gifting, etc.).
// Returns the error message to show inline, or null when the value is valid.

export const PHONE_COUNTRY_CODE = "+91";

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "Email is required.";
  // Simple, forgiving pattern — intentionally not RFC-strict.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email like name@example.com.";
  return null;
}

// Accepts the 10-digit mobile only — country code is handled by the UI.
// Strips spaces, dashes, and a leading +91 or 0 before checking length.
export function validatePhone(value: string): string | null {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "Mobile number is required.";
  const stripped = digits.replace(/^(91|0)/, "");
  if (stripped.length !== 10) return "Enter a 10-digit Indian mobile number.";
  if (!/^[6-9]/.test(stripped)) return "Mobile number should start with 6, 7, 8 or 9.";
  return null;
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/[^\d]/g, "").replace(/^(91|0)/, "");
  return digits.length === 10 ? `${PHONE_COUNTRY_CODE} ${digits}` : value.trim();
}

export function validatePincode(value: string): string | null {
  const v = value.trim();
  if (!v) return "Pincode is required.";
  if (!/^\d{6}$/.test(v)) return "Indian pincode must be 6 digits.";
  if (/^0/.test(v)) return "Indian pincode cannot start with 0.";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required.`;
  return null;
}
