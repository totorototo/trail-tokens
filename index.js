import THEME from "./theme.js";

// One `--name: value;` line per entry, for a styled-components :root block.
export const toCustomProperties = (entries) =>
  Object.entries(entries)
    .map(([rule, value]) => `${rule}: ${value};`)
    .join("\n");

// Adds app-only colour tokens on top of the shared ones, without mutating THEME.
export const extendColors = (theme, { light = {}, dark = {} } = {}) => ({
  ...theme,
  colors: {
    ...theme.colors,
    light: { ...theme.colors.light, ...light },
    dark: { ...theme.colors.dark, ...dark },
  },
});

export default THEME;
