# React + TypeScript + Vite

## Geçici olarak gizlenen özellikler

### VisiGuide (ana sayfa rehber asistanı)

Ana sayfanın sol alt köşesindeki `<vs-guide>` rehber asistanı şimdilik yayından kaldırıldı; ileride tekrar eklenecek.

- Kod silinmedi: `src/components/VisiGuide/` olduğu gibi duruyor.
- Yalnızca `src/pages/Home/Home.tsx` içindeki import ve `<VisiGuide />` satırı çıkarıldı.
- Geri açmak için `Home.tsx`'e şunları ekleyin:

```tsx
import VisiGuide from '../../components/VisiGuide/index.ts'

// ...
<HomeReady />
<VisiGuide />
```

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
