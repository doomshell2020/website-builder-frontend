// --- Telephone numbers ---
export const formatTelephoneNumbers = (input?: string) => {
  if (!input) return "";

  // Split by comma, keep only digits
  const parts = input
    .split(",")
    .map(p => p.replace(/[^\d]/g, "").trim())
    .filter(Boolean);

  if (parts.length === 0) return "";

  // First number → full formatted
  const base = parts[0];
  const country = base.slice(0, 2);   // 91
  const stdCode = base.slice(2, 5);   // 141
  const subscriber = base.slice(5);   // 2332902

  let result = `${country}-${stdCode}-${subscriber}`;

  // Other numbers → only subscriber part
  if (parts.length > 1) {
    const extras = parts.slice(1).map(num =>
      num.replace(/^(\+?91|0)?141/, "") // remove +91 / 91 / 0 / 141 prefix
    );
    result += "," + extras.join(", ");
  }

  return result;
};

// --- Fax numbers ---
export const formatFaxNumber = (input?: string) => {
  if (!input) return "";
  const clean = input.replace(/[^\d]/g, "");
  if (!clean) return "";

  const country = clean.slice(0, 2);
  const stdCode = clean.slice(2, 5);
  const number = clean.slice(5);

  return `${country}-${stdCode}-${number}`;
};

// --- Mobile numbers ---
export const formatMobileNumber = (input?: string) => {
  if (!input) return "";
  const clean = input.replace(/[^\d]/g, "");
  if (!clean) return "";

  const country = clean.slice(0, 2);      // 91
  const subscriber = clean.slice(2);      // 9829013043

  return `${country}-${subscriber.slice(0, 5)}-${subscriber.slice(5)}`;
};
