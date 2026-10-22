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

// What changed on purpose since the hand-written copies: the sans stack names the system
// UI face instead of an Inter no app loads, and the map gained its shadow (v1.1.0); the
// control border dropped to a quiet frame (v1.2.0); the gutters and the measure became
// tokens (v1.3.0).
const SINCE_HAND_COPY = (theme) => ({
  ...theme,
  colors: extendColors(theme, {
    dark: { "--color-control-border": "#696569" },
    light: { "--color-control-border": "#8b8b8c" },
  }).colors,
  map: { ...theme.map, shadow: "rgba(0, 0, 0, 0.4)" },
  layout: {
    "--gutter": "clamp(1.25rem, 6vw, 4rem)",
    "--gutter-tool": "clamp(1rem, 3vw, 2.5rem)",
    "--measure": "46rem",
  },
  font: {
    ...theme.font,
    family: {
      ...theme.font.family,
      "--font-family-sansSerif":
        "system-ui, -apple-system, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    },
  },
});

describe("generated THEME", () => {
  it("equals Terminus's hand-written Theme.js plus Waymark's field tokens", () => {
    expect(normalizeHex(THEME)).toEqual(
      normalizeHex(SINCE_HAND_COPY(extendColors(TERMINUS, FIELDS))),
    );
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
