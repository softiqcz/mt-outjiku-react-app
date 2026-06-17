# Mt.Otjiku Getaway

Luxury single-page website for **Mt.Otjiku Getaway**, a fictional private bungalow accommodation on Namibia's savannah plains. The site is built as a dark, typographic, motion-led Next.js experience with English, Czech, and German language support.

## Tech Stack

- **Framework:** Next.js App Router, React 18, TypeScript
- **Styling:** CSS Modules plus `src/styles/global.css`
- **Animation:** Framer Motion for reveals, hover states, and modal transitions
- **Smooth scrolling:** `@studio-freight/lenis` through `src/hooks/useLenis.ts`
- **Internationalization:** `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Media:** Next Image for local images, native `<video>` for MP4 media
- **Maps:** OpenStreetMap iframe in the Location section
- **Installed but not currently central:** GSAP, `@gsap/react`, `react-intersection-observer`

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run build:github
npm run deploy
npm run start
```

Local development runs at [http://localhost:3000](http://localhost:3000).

`npm run deploy` builds a static GitHub Pages export into `out/` and publishes it to the `gh-pages` branch with `gh-pages -d out`.

## How The App Works

The app is a single page composed in `src/app/page.tsx`:

- `Header` - brand, external links, Booking.com CTA, quick EN/CZ/DE language switcher
- `Hero` - full-screen MP4 background, theme-aware overlay, animated headline
- `Philosophy` - typographic statement section
- `Bungalows` - three bungalow galleries with click-through detail modal
- `Experience` - feature rows with parallax media
- `Location` - Otjiku map, coordinates, and distance rows
- `Booking` - final Booking.com call to action
- `Footer` - brand metadata and settings gear
- `CookieBanner` - local cookie preference banner

Translations live in `src/i18n/en.json`, `src/i18n/cz.json`, and `src/i18n/de.json`. The quick language switcher is in the header, and the footer settings panel also includes language controls. The selected language is stored in `localStorage`.

## Bungalow Media

Bungalow media is folder-driven. `scripts/generate-bungalow-media.mjs` scans these public folders and writes `public/bungalow-media.json` for static hosting:

```text
public/images/pics/bungalow1
public/images/pics/bungalow2
public/images/pics/bungalow3
```

The `Bungalows` component fetches `/bungalow-media.json` and renders whatever supported files are present.

Supported image formats:

```text
.avif .jpg .jpeg .png .webp
```

Supported video formats:

```text
.mp4 .mov .webm
```

For any bungalow folder, videos are listed before images, so a video becomes the main card media whenever one exists. Images from each bungalow folder are shown in the card thumbnails and detail gallery. New images added to those folders will appear after `npm run generate:media`, `npm run dev`, or `npm run build`.

## Design System

### Colors

Defined in `src/styles/global.css`:

```css
--sand:     #C8A97E;
--obsidian: #0D0C0A;
--dusk:     #1C1A16;
--ash:      #3A3630;
--ivory:    #F0EAE0;
--sky:      #7EA8C8;
```

Light mode overrides the palette on `html[data-theme="light"]`:

```css
--sand:     #A8793D;
--obsidian: #F3EFE7;
--dusk:     #E8DFD1;
--ash:      #B7A990;
--ivory:    #16130F;
--sky:      #426F8F;
```

### Typography

Fonts are loaded from Google Fonts in `src/styles/global.css`:

- **Cormorant Garamond** - display headings, brand text, large editorial titles
- **Inter** - body copy, controls, utility text

The visual direction is typography-first: large Cormorant headings, uppercase Inter eyebrows, quiet dividers, flat surfaces, and restrained borders.

### Icons

There is no icon library. Icons are inline SVGs inside the relevant components:

- Header social icons, sun, and moon icons: `src/components/Header.tsx`
- Hero scroll chevron: `src/components/Hero.tsx`
- Bungalow modal close icon: `src/components/Bungalows.tsx`

## Motion And Accessibility

Framer Motion powers the hero word reveal, section/card entrances, hover states, and modal transitions. Motion is reduced when the user has `prefers-reduced-motion: reduce`, using `src/hooks/usePrefersReducedMotion.ts` and global CSS safeguards.

Images and videos include translated accessible labels where practical. External Booking.com, Facebook, Google, and OpenStreetMap links open safely with `target="_blank"` and `rel="noopener noreferrer"` where used.

## Theme And Preferences

The theme switch is inside the footer settings panel. It writes `mtOtjikuTheme` to `localStorage` and toggles `html[data-theme]` between `dark` and `light`.

Cookie preferences are stored locally under `mtOtjikuCookiePreferences` and can be reopened from footer settings. Bug reports are stored locally under `mtOtjikuBugReports`. There is no backend persistence, contact form, booking calendar, or user account system.

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
  components/
    Booking.tsx
    Bungalows.tsx
    CookieBanner.tsx
    Experience.tsx
    Footer.tsx
    Header.tsx
    Hero.tsx
    Location.tsx
    Philosophy.tsx
  hooks/
    useLenis.ts
    usePrefersReducedMotion.ts
  i18n/
    index.ts
    en.json
    cz.json
    de.json
  utils/
    publicPath.ts
  styles/
    global.css
    *.module.css
scripts/
  generate-bungalow-media.mjs
```

## Content Notes

- Brand name: **Mt.Otjiku Getaway**
- Fictional property location: Otjiku, Otjozondjupa, Namibia
- Booking CTAs point to [Booking.com](https://www.booking.com)
- The location map uses OpenStreetMap
- The site currently presents three private bungalows and a maximum of six guests
