import { nanoid } from "nanoid";

const isValidEmail = (email: string): boolean => {
  const emailTrim = email.trim();
  const emailLowerCase = emailTrim.toLowerCase();

  if (!email) {
    return false;
  }

  const atCount = (emailLowerCase.match(/@/g) || []).length;

  if (atCount !== 1) {
    return false;
  }

  const [username, domain] = emailLowerCase.split("@");

  if (!username || !domain) {
    return false;
  }

  if (!domain.includes(".")) {
    return false;
  }

  if (
    emailLowerCase.startsWith(".") ||
    emailLowerCase.endsWith(".") ||
    emailLowerCase.startsWith("@") ||
    emailLowerCase.endsWith("@")
  ) {
    return false;
  }

  if (domain.startsWith(".") || domain.endsWith(".")) {
    return false;
  }

  if (username.startsWith(".") || username.endsWith(".")) {
    return false;
  }

  // Username hanya boleh mengandung karakter email yang umum
  if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(username)) {
    return false;
  }

  // Domain hanya boleh huruf, angka, titik, dan -
  if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
    return false;
  }

  // Domain harus mempunyai format nama.tld
  const domainParts = domain.split(".");

  if (domainParts.length < 2) {
    return false;
  }

  // Bagian domain tidak boleh kosong
  if (domainParts.some((part) => part.length === 0)) {
    return false;
  }

  // TLD minimal 2 karakter, misalnya .com, .id, .org
  const tld = domainParts[domainParts.length - 1];

  if (!/^[a-zA-Z]{2,}$/.test(tld)) {
    return false;
  }

  return true;
};

const generateSlug = (input: string): string => {
  const nameTrim = input ? input.trim() : "";
  const nameLowercase = nameTrim.toLowerCase();

  if (!nameTrim) {
    return `renungan-${nanoid(8)}`;
  }

  const randomNumber = nanoid(6);

  const slug = nameLowercase
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  return slug ? `${slug}-${randomNumber}` : `renungan-${randomNumber}`;
};

const expiresInMs = (val: string): number => {
  const match = String(val).match(/^(\d+)([smhd])$/);
  if (!match) return 3600 * 1000;
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 3600 * 1000;
    case "d":
      return num * 86400 * 1000;
    default:
      return 3600 * 1000;
  }
};

export { isValidEmail, generateSlug, expiresInMs };

