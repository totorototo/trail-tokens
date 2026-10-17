import { describe, expect, it } from "vitest";
import THEME, { extendColors, toCustomProperties } from "../index.js";
import TERMINUS from "./fixtures/terminus-theme.js";

// Waymark's lightFields/darkFields (waymark@32b8078), now shared suite tokens.
const FIELDS = {
  light: { "--color-field": "#fbfaf8", "--color-field-border": "#6e6b6d" },
  dark: { "--color-field": "#2b2527", "--color-field-border": "#8d8a90" },
};

// why: tokens.json writes hex in lower case and the hand copies mixed both;
// the same colour either way, so compare case-insensitively on hex only.
const normalizeHex = (value) =>
  JSON.parse(JSON.stringify(value), (_, v) =>
    typeof v === "string" && /^#[0-9a-f]{3,8}$/i.test(v) ? v.toLowerCase() : v,
  );

describe("generated THEME", () => {
  it("equals Terminus's hand-written Theme.js plus Waymark's field tokens", () => {
    expect(normalizeHex(THEME)).toEqual(normalizeHex(extendColors(TERMINUS, FIELDS)));
  });

  it("has the same colour keys in both themes", () => {
    expect(Object.keys(THEME.colors.dark).sort()).toEqual(
      Object.keys(THEME.colors.light).sort(),
    );
  });
});

describe("toCustomProperties", () => {
  it("writes one declaration per entry", () => {
    expect(toCustomProperties({ "--a": "1px", "--b": "red" })).toBe("--a: 1px;\n--b: red;");
  });
});

describe("extendColors", () => {
  it("overlays app tokens without mutating the shared theme", () => {
    const extended = extendColors(THEME, { dark: { "--color-x": "#000" } });
    expect(extended.colors.dark["--color-x"]).toBe("#000");
    expect(extended.colors.light["--color-x"]).toBeUndefined();
    expect(THEME.colors.dark["--color-x"]).toBeUndefined();
    expect(extended.map).toBe(THEME.map);
  });
});
