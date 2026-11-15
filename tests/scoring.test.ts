import { describe, it, expect } from "vitest";
import { unifiedScore, xpFor, levelFor, starsForCc } from "../src/lib/scoring";
describe("unifiedScore", () => {
  it("is 0 with no ratings", () => { expect(unifiedScore(null, null, null)).toBe(0); });
  it("uses a single platform as-is for CF and LC", () => { expect(unifiedScore(1500, null, null)).toBe(1500); expect(unifiedScore(null, 1800, null)).toBe(1800); });
  it("scales CodeChef down", () => { expect(unifiedScore(null, null, 2000)).toBe(1600); });
  it("weights all three", () => { const s = unifiedScore(1600, 1800, 2000); expect(s).toBeGreaterThan(1500); expect(s).toBeLessThan(1800); });
});
describe("levels", () => {
  it("starts at 1", () => { expect(levelFor(0)).toBe(1); });
  it("grows with xp", () => { expect(levelFor(xpFor(1700, 100))).toBeGreaterThan(3); });
});
describe("codechef stars", () => {
  it("maps ranges", () => { expect(starsForCc(1200)).toBe(1); expect(starsForCc(2100)).toBe(5); expect(starsForCc(2600)).toBe(7); expect(starsForCc(null)).toBe(0); });
});
