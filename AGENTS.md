# VisioSoft — kod yazmadan önce oku

Bu dosya her kod değişikliğinde geçerlidir. Amaç çalışan kod değil; **3 ay sonra niyetin anlaşılması ve değişikliğin başka yerleri bozmaması.**

Bu repo **Laravel değildir.** Frontend TypeScript + React + Vite; backend JavaScript (ESM) + Express + PostgreSQL.

Her yazdığın kodda sor:

1. Bu kod ne yapıyor?
2. Neden burada?
3. Tek bir sorumluluğu var mı?
4. Tekrar ediyor muyum?
5. Başka biri bunu kolayca değiştirebilir mi?

Temiz kod = daha fazla dosya açmak değildir. 20 satırlık işi 15 katmana dağıtma.

---

## Akış

```text
UI (Page / Component)
  → hooks/          state, locale, path, side effect
  → services/       HTTP (frontend/src/services/api.ts)
  → Express route   backend/routes/*.js
  → module controller
  → validator / service / model
  → PostgreSQL
  → JSON { data } veya { message }
```

Katman karıştırma: component `fetch` etmez, route SQL yazmaz, controller mail şablonu biriktirmez.

---

## Frontend (`frontend/src`)

| Katman | Görev | Örnek |
|---|---|---|
| `pages/` | Ekranı birleştirir, ince kalır | `Contact/ContactPage.tsx` |
| `components/` | UI | `LeadForm/`, `Button/` |
| `hooks/` | State + yan etki | `useLocale`, `useTurnstile` |
| `services/` | HTTP | `services/api.ts` → `submitLead()` |
| `lib/` | Rota / locale yardımcıları | `lib/routes.ts` |
| `context/` | Paylaşılan React state | `LocaleProvider` |
| `*Copy.ts` | Metinler JSX’ten ayrı | `contactCopy.ts` |

Yeni sayfa: `pages/Foo/FooPage.tsx` + `fooCopy.ts` + `index.ts` barrel + `pages/registry.ts` loader. `frontend/legacy/` yeni iş için kullanılmaz.

### TypeScript

- `any` kullanma. API cevabı için `type` / `interface` yaz; `useState<User[]>([])` gibi gerçek tip ver.
- Boolean: `isLoading`, `hasError`, `canSubmit`.
- İsim: `users`, `activeUsers`, `selectedProduct` — `d`, `x`, `data`, `result`, `temp` değil.
- Handler: `handleSubmitQuote` — `handleClick` değil.
- Tipleri kullanıldıkları yere koy (`api.ts` veya component yanına). Boş `types/` klasörü açma.

### Component ve JSX

Sayfa JSX’i tablo + form + modal + fetch olmasın. Böl:

```text
ContactPage
├── contactCopy.ts
├── CompanyFacts.tsx
├── MeetingSection.tsx
└── LeadForm (ortak component)
```

İş kuralını JSX içinde zincirleme. Önce hazırla, sonra render et:

```tsx
const activeUsers = users.filter((user) => user.isActive)
```

Türetilen değer için `useState` + `useEffect` yok (`fullName = `${first} ${last}`` yeter). `useMemo` / `useCallback` ancak ölçülmüş maliyet varsa.

### API

`fetch` component içinde yazılmaz. `services/api.ts` içindeki `request()` kullanılır; yeni endpoint aynı dosyaya typed fonksiyon olarak eklenir.

```ts
export function submitLead(kind: LeadKind, body: Json) {
  return request<{ message: string }>(`/api/leads/${kind}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
```

`VITE_API_URL` `frontend/.env` üzerinden gelir; URL’yi dosyalara gömme.

### Null

`user?.name` her yere körlemesine konmaz. Veri yoksa erken dön: `if (!post) return <EmptyState />`. Kesin olması gereken yerde tip daralt.

---

## Backend (`backend`)

Modül bazlı Express. Yeni özellik mevcut modüle girer veya `modules/<ad>/` açılır; `server.js` şişmez.

```text
backend/
├── server.js                 # app + middleware sırası
├── config/index.js           # env tek yerde
├── routes/*.js               # path → controller
├── modules/
│   ├── leads/                # controller, model, validators, *Service
│   ├── website/
│   ├── traffic/
│   ├── accounts/
│   ├── billing/
│   └── googleAds/
├── middleware/               # errorHandler, asyncHandler akışı, auth
├── db/                       # pool, query, migrate
├── jobs/
└── utils/                    # logger, validate, asyncHandler
```

| Katman | Görev |
|---|---|
| Route | HTTP path ve middleware bağlar |
| Controller | `req` al → doğrula çağır → service/model → `res.json` |
| Validator | `collectErrors` / `ValidationError` (422) |
| Service | İş kuralı, mail, CRM, içerik |
| Model | SQL (`db/query`) |

Controller örneği:

```js
const storeContact = asyncHandler(async (req, res) => {
  validators.validateContact(req.body);
  const result = await leadService.createContact(req);
  res.json({ message: result.message });
});
```

`try/catch` her handler’da yok. `asyncHandler` + `middleware/errorHandler.js`. Kullanıcıya genel mesaj (`Bir hata oluştu`); `logger.error` ile asıl neden.

Yeni env: `config/index.js`. Magic string yerine sabit (`leadModel.FORM_TYPES.QUOTE`). SQL model’de; iş kuralı service’te.

Log: `logger.info` / `logger.error` — commit’te `console.log` bırakma.

---

## Stil

Bu projede asıl stil **CSS Modules** + `index.css` token’larıdır (`--color-navy-700`, `--color-corp-ink`). Tailwind `@theme` token içindir; utility çöplüğü için değil.

- Layout/spacing/hover/animasyon: `Foo.module.css`
- Tekrarlayan UI: mevcut `Button`, `Section`, `CardGrid` — 40 class’lık `className` kopyalama
- Tailwind class yalnızca gerçekten global yardımcıysa (`sr-only`); aynı elementte Modules + uzun utility listesi karıştırma
- Metin JSX’e gömülmez: `*Copy.ts`

---

## İsim ve dosya

Frontend: `PascalCase` klasör ve component (`LeadForm.tsx`), barrel `index.ts`, stiller `LeadForm.module.css`.

Backend: `camelCase` dosya (`leadController.js`, `leadModel.js`, `mailService.js`). Route dosyası modül adıyla (`routes/leads.js`).

Import stili: frontend mevcut dosyadaki tırnak ve `.ts` uzantısına uy; backend çift tırnak + `.js` uzantısı.

---

## Git

`fix`, `update`, `son2` yok.

```text
feat: add parking quote field validation
fix: return user-facing message when lead mail fails
refactor: move persistAndNotify into lead service
```

---

## 10 kural

1. `any` yok — gerçek tip.
2. Page ince, parçalar küçük.
3. JSX’e iş kuralı / filter-sort gömme.
4. HTTP yalnızca `services/api.ts`.
5. Controller HTTP; iş kuralı service.
6. SQL model; doğrulama validator.
7. Hata merkezi middleware + `logger`.
8. DRY: 8 kez tekrar varsa birleştir; iki benzer blok için generic yazma.
9. `useEffect` / `useMemo` gerçekten gerektiğinde.
10. “3 ay sonra ben bunu anlar mıyım?”

Kod yazmadan bu dosyaya uy. Uymayan mevcut kodu fırsat oldukça bu yapıya çek; yeni kodu eski karmaşaya uydurma.
