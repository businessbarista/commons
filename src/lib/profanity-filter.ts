// Word list for basic profanity/spam detection.
// This is intentionally minimal — catches the obvious stuff.
// For production, consider a dedicated library or API.
const BLOCKED_WORDS = [
  "fuck",
  "shit",
  "ass",
  "damn",
  "bitch",
  "dick",
  "cunt",
  "nigger",
  "faggot",
  "retard",
  "viagra",
  "cialis",
  "casino",
  "porn",
  "xxx",
  "buy now",
  "click here",
  "free money",
  "act now",
  "limited offer",
];

// Patterns that indicate spam
const SPAM_PATTERNS = [
  /https?:\/\/\S+/gi, // URLs in reviews
  /(.)\1{5,}/g, // Same character repeated 6+ times (e.g., "aaaaaa")
  /\b[A-Z\s]{20,}\b/g, // ALL CAPS strings 20+ chars
  /[\u{1F600}-\u{1F64F}]{5,}/gu, // 5+ emoji in a row
];

export interface FilterResult {
  clean: boolean;
  reason?: string;
}

/**
 * Check text for profanity and spam patterns.
 * Returns clean=true if text passes all checks.
 */
export function checkProfanity(text: string): FilterResult {
  const lower = text.toLowerCase();

  // Check blocked words (as whole words, not substrings)
  for (const word of BLOCKED_WORDS) {
    const regex = new RegExp(`\\b${escapeRegex(word)}\\b`, "i");
    if (regex.test(lower)) {
      return {
        clean: false,
        reason: "Your review contains language that isn't allowed. Keep it constructive.",
      };
    }
  }

  // Check spam patterns
  for (const pattern of SPAM_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      return {
        clean: false,
        reason: "Your review looks like spam. Please write a genuine review.",
      };
    }
  }

  return { clean: true };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
