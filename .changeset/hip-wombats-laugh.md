---
"@itwin/scenes-client": patch
---

Standardize color representation

- Update `ITwinDisplayStyleOptions` (`backgroundColor`, `monochromeColor`, `HiddenLineStyle.color`) to use `RgbColor` instead of `ColorDef`
- Mark `ColorDef` in Expression Styling types as deprecated
