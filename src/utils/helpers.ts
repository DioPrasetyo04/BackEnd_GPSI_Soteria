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

const expiresInMs = (exp: number | string = "1h"): number => {
  if (typeof exp === "number") {
    return exp;
  }

  const expString = exp;
  const match = expString.match(/^(\d+)([smhd])$/i);

  if (!match) {
    return 60 * 60 * 1000;
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60 * 60 * 1000;
  }
};

export { isValidEmail, generateSlug, expiresInMs };
