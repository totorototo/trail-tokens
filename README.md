# trail-tokens

The Trail Suite design tokens, shared by Terminus, Waymark and Retrace.

- `tokens.json` is the committed mirror of the Design System artifact's `project/tokens.json`
  (<https://claude.ai/artifact/EkGhtCPuuA93VoU6r6MQcV>). `meta.artifact.version` records which
  artifact version it came from.
- `scripts/build.mjs` generates `theme.js`, the object each app's `src/theme/Theme.js` used to
  write by hand: `colors.light` / `colors.dark` (`--color-*` keys), `map`, `font.family` /
  `weights` / `sizes`, `borderRadius`, `zIndex`, `transitions`, `spacing` and `breakpoints`.
- `index.js` exports `THEME` (default), `toCustomProperties(entries)` and
  `extendColors(theme, { light, dark })` for tokens that belong to one app only.

Plain ESM with no JSON import, so Vite, Node scripts (`vite.config.js`, `make-icons.mjs`) and
Playwright all import it the same way.

```js
import THEME, { toCustomProperties } from "@totorototo/trail-tokens";
```

## Install

```bash
npm i github:totorototo/trail-tokens#v1.1.0
```

`theme.js` is committed and the package has no `prepare` script. npm runs `prepare` for git
dependencies, which would install this repo's dev dependencies during every app's `npm ci`.

## References

A colour that names a meaning instead of a new value is written as a reference, so it follows
its base token:

- `{color-x}` reads the same theme: `color-button-primary` is `{color-primary}` in dark and
  `{color-primary-text}` in light.
- `{color-x.dark}` / `{color-x.light}` reads one theme. The `map-*` inks use this because the
  outdoors basemap stays light in dark mode. The build rejects a map ink whose themes differ.

Unknown names, unknown themes and reference cycles fail the build.

## Changing a token

1. **Artifact first.** Edit the token in the Design System artifact.
2. **Copy** the artifact's `project/tokens.json` over `tokens.json`. Set `meta.artifact.version`
   and `meta.synced`.
3. **Build and test.** Run `npm run build && npm test`. If the change is intentional, update the
   golden fixture (`test/fixtures/terminus-theme.js`) in the same PR, so the diff shows the new
   value.
4. **PR, merge, tag.** Bump `version` in `package.json`, then run
   `git tag vX.Y.Z && git push --tags`. CI checks that `theme.js` matches `tokens.json`.
5. **Bump each app**, one PR per app, so each runs its own CI and e2e:

   ```bash
   npm i github:totorototo/trail-tokens#vX.Y.Z
   ```

After a bump, Vite re-optimises the dependency because the lockfile changed. If it serves a
stale copy, run `vite --force`.

## Local development across apps

To try a token change in an app before tagging it, install your checkout over the pinned
version, from the app's folder:

```bash
npm i --no-save file:../trail-tokens
```

npm links `node_modules/@totorototo/trail-tokens` to this folder and leaves `package.json` and
the lockfile alone. Rebuild here with `npm run build` after each `tokens.json` edit, and the app
picks up `theme.js` on reload. Run `npm ci` in the app to go back to the pinned version.

A `file:` entry in `overrides` does not work here. The apps depend on the package directly, and
npm refuses an override that differs from a direct dependency's spec (`EOVERRIDE`).

## Scripts

| | |
|---|---|
| `npm run build` | `tokens.json` → `theme.js` |
| `npm test` | golden test against the hand-written theme, plus the helpers |

## License

MIT, see `LICENSE`.
