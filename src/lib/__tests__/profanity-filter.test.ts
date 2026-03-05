import { describe, expect, it } from "vitest";
import { checkProfanity } from "../profanity-filter";

describe("checkProfanity", () => {
  it("allows clean text", () => {
    const result = checkProfanity(
      "This is a great skill! Really helped me write better emails.",
    );
    expect(result.clean).toBe(true);
  });

  it("allows constructive criticism", () => {
    const result = checkProfanity(
      "The skill works but could be more specific about B2B use cases.",
    );
    expect(result.clean).toBe(true);
  });

  it("blocks profanity (whole words)", () => {
    const result = checkProfanity("This skill is shit and doesn't work.");
    expect(result.clean).toBe(false);
    expect(result.reason).toContain("language");
  });

  it("does not block words that contain blocked words as substrings", () => {
    // "assess" contains "ass" as a substring but shouldn't be blocked
    const result = checkProfanity(
      "Let me assess this skill's quality carefully.",
    );
    expect(result.clean).toBe(true);
  });

  it("blocks spam with URLs", () => {
    const result = checkProfanity(
      "Great skill! Check out https://spammy-site.com for more.",
    );
    expect(result.clean).toBe(false);
    expect(result.reason).toContain("spam");
  });

  it("blocks repeated characters", () => {
    const result = checkProfanity("This is greaaaaaaaat!!!!!");
    expect(result.clean).toBe(false);
  });

  it("blocks ALL CAPS strings", () => {
    const result = checkProfanity(
      "THIS SKILL IS THE BEST THING EVER MADE",
    );
    expect(result.clean).toBe(false);
  });

  it("allows short caps words mixed with lowercase", () => {
    const result = checkProfanity("This skill is OK for basic tasks.");
    expect(result.clean).toBe(true);
  });

  it("blocks spam phrases", () => {
    const result = checkProfanity("Buy now and get free money from this skill!");
    expect(result.clean).toBe(false);
  });

  it("handles empty string", () => {
    const result = checkProfanity("");
    expect(result.clean).toBe(true);
  });

  it("handles emoji-only text reasonably", () => {
    // Small number of emoji should be fine
    const result = checkProfanity("Great tool! 🔥🔥");
    expect(result.clean).toBe(true);
  });
});
