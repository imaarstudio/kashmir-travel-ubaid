# Kashmir Travel with Ubaid — project notes

Single-page marketing site for a travel agency in Srinagar, Kashmir.
Built by **Imaar Studio**. Started 2026-09-24.

---

## The brief, and the one constraint that shapes everything

The client asked for **no fixed packages and no published prices**. In their words:

> we won't display fixed packages, rather will entice user to select agency and book
> through phone

So the page is an **inspire → trust → call** funnel rather than a catalogue. Destinations
and seasons do the enticing, a "How it works" section stands in for the pricing table, and
every call-to-action is a `tel:` or `wa.me` link.

**Do not add** a booking form, a package grid, or "from ₹X" pricing. That is a decision,
not an omission. The FAQ answers the obvious question ("Why aren't there prices on the
site?") head-on.

## Client details

Sourced from the Google Business Profile, which is the authority — the agency's old
auto-built listing at `kashmir-travell-with.grexa.site` is out of date.

| | |
| --- | --- |
| Phone / WhatsApp | `+91 8825012522` |
| Instagram | [@kashmir_travel_with_ubaid](https://www.instagram.com/kashmir_travel_with_ubaid/) |
| Address | Haji Abad, HIG Colony, Bemina, Srinagar, Jammu & Kashmir 190018 |
| Coordinates | `34.0806247, 74.7753986` |
| Hours | Mon–Fri 8am–8pm · Sat–Sun 8am–10pm |
| Rating | 5.0 from 35 Google reviews |
| Email | none published |

All of it also sits in the `TravelAgency` JSON-LD in the `<head>`, with
`openingHoursSpecification`, `geo`, `hasMap` and `sameAs`.

> **`aggregateRating` is deliberately absent from the JSON-LD.** Google's guidelines
> disallow self-serving review markup and it can trigger a manual action. The rating is
> displayed on the page and corroborated independently by the embedded map card, which
> pulls it live from Google.

## Stack

Plain static HTML, CSS and vanilla JS. No build step, no dependencies, no framework.

```sh
python3 -m http.server 8765      # then open http://localhost:8765/
```

Deploys as-is to Vercel, Netlify, Cloudflare Pages or GitHub Pages. Vercel is the
intended target — see Analytics below.

### Vercel Web Analytics

Wired up in `index.html` with the plain-HTML integration, so there is no package and no
build step:

```html
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
```

Three things to know:

1. **It must be enabled per-project in the Vercel dashboard** (Analytics → Enable). Until
   then nothing is collected, however many times the site is deployed.
2. **It only resolves on Vercel.** Anywhere else — including the local server — the script
   404s, the stub quietly queues calls that are never sent, and nothing breaks. Verified:
   no console errors locally.
3. **It is cookieless**, so the site needs no consent banner for it.

The dashboard also exposes a project-specific path (`/<unique-path>/script.js`) that ad
blockers are less likely to catch. Swap it in if reporting coverage matters more than
having a path that works without a dashboard lookup.

Route-level tracking is not available in the HTML integration, which is irrelevant here —
this is a single page.

Speed Insights is a separate product and is **not** installed. To add it:
`<script defer src="/_vercel/speed-insights/script.js"></script>`, enabled the same way.

```
index.html          601 lines
css/styles.css      645 lines
js/main.js          140 lines — hero film, header state, scroll reveals, FAQ, nav tracking
img/                14 photographs + shot list        2.8 MB
video/              hero background film + notes      6.6 MB
```

## Page structure

| Section | `id` | Purpose |
| --- | --- | --- |
| Hero | — | Background film, headline, call + WhatsApp, trust strip |
| Intro | — | Why a local plans it better than you can |
| The valley | `#valley` | Nine destination cards |
| Houseboats & shikara | `#lake` | Dal Lake feature |
| Getting around | `#travel` | Airport pickup, cabs, custom trips, permits |
| When to come | `#seasons` | Four seasons — no wrong month to call |
| How it works | `#how` | Call → he plans → you arrive. **Replaces pricing.** |
| Travellers | `#reviews` | Google rating, three real reviews, who he plans for |
| Common questions | — | FAQ |
| Find him | `#location` | Address, hours, embedded map, directions |
| Closing CTA | `#contact` | Phone-first, then footer |

## Design

| Token | Value | Use |
| --- | --- | --- |
| `--ink` | `#16201b` | Body text |
| `--pine` / `--pine-deep` | `#1d3a2c` / `#12251b` | Dark sections, footer |
| `--saffron` / `--saffron-lt` | `#c26a16` / `#e0913c` | Buttons, eyebrows, accents |
| `--cream` / `--paper` | `#faf7f1` / `#f1eadd` | Alternating section grounds |
| `--line` | `#e0d6c6` | Borders |

**Tab icon.** `img/favicon.svg` reuses the exact mountain path from the header wordmark,
saffron on the brand's pine-deep ground, so the tab mark and the logo are the same drawing.
A 32px PNG covers browsers that don't take SVG favicons and a 180px PNG serves as the iOS
home-screen tile. The stroke is slightly heavier than the header's (2.8 vs 2) — an optical
correction so the shape still reads at 16px.

Type: **Fraunces** for headings, **Inter** for body, both from Google Fonts.
Layout maxes at `1180px`. The palette is warm and editorial on purpose — saffron and pine
rather than the generic travel-blue, and it commits to one light theme.

## Implementation notes worth knowing

**Hero film.** The video plays at full strength under three stacked scrims — a
left-weighted one where the headline sits, a vertical one darkening top and bottom, and a
flat base tint. The rule carried over from the dreami hero: *legibility comes from a scrim,
not from dimming the film.* Dimming the video itself turns it into an unreadable smudge.

**Header floats over the hero.** Transparent with light text while the hero is in view,
then takes the cream bar via `.is-solid`, toggled in `main.js` off the hero's height.

**Everything degrades.** The hero falls through film → `hero-valley.jpg` → CSS gradient.
Every `<img>` carries `onerror="this.remove()"`, so a missing file reveals a scene-matched
gradient rather than a broken icon. `main.js` drops the `<video>` if no source loads, if
autoplay is refused, or under `prefers-reduced-motion`.

**The scroll reveal has a failsafe.** Elements start at `opacity: 0`, so anything already
in view is revealed immediately on load and a 4-second timer reveals the rest regardless.
Content must never be permanently invisible because an observer didn't fire.

**Two bugs already fixed here, don't reintroduce them:**
- A capture-phase `error` listener on the `<video>` killed the film when the missing
  `.webm` 404'd, before the `.mp4` was ever tried.
- Calling `play()` eagerly rejected with `NotSupportedError` while the browser was still
  walking the source list. It now waits for `canplay`.

**The hero fills the viewport** via `min-height: 100svh`. It previously capped at
`min(92vh, 820px)`, which let the next section show as a strip on tall screens.

## Assets

Full provenance and the shot list are in **`img/README.md`**; film sourcing, licensing and
encoding notes are in **`video/README.md`**.

Everything currently on the site is **Pexels-licensed** (free commercial use, no
attribution required) except the hero film, also Pexels. Photo IDs are recorded per file so
each is traceable.

> **Licensing rule:** assets must be Ubaid's own or properly licensed. Do not take images
> from hotel listings, booking sites, other agencies, Instagram or image search — those are
> licensed only for that listing, and the exposure lands on the client.

## Outstanding

| # | Item | Why it matters |
| --- | --- | --- |
| 1 | **Hero film is 6.6 MB** | More than twice all 14 photographs combined, on the first screen, for an audience largely on Indian mobile data. macOS `avconvert` has no rate control and can't do better. Fix: download Pexels' **SD** rendition of clip `15276213` and use it untouched (~1.5–2 MB, better looking), or `brew install ffmpeg` and encode properly. |
| 2 | **`pampore.jpg` contradicts its copy** | The photo is a yellow **mustard** field; the card promises saffron "purple for about three weeks from late October". Either find a saffron-bloom photo or rewrite the card. |
| 3 | **`ubaid.jpg` is empty** | The caption names him and says he answers the phone himself. It must be a photograph of Ubaid — a stock model would put an invented face on a real owner's site. |
| 4 | **Name spelling** | Google and the old listing both say **"Kashmir Travell with Ubaid"** (two l's). The site says "Travel". Confirm the trading name; it should match the Business Profile for local SEO. |
| 5 | **Google hours are now stale** | The profile still shows the old per-day hours (Mon 8–9pm, Thu to 10:30pm, weekends to 11pm). The site and the Maps listing now disagree. |
| 6 | **Safety copy** | The FAQ answer about travelling in Kashmir should be read and approved by Ubaid in his own words. |
| 7 | **No email** | Nothing is published anywhere, so the page has no `mailto:`. Fine for a phone-first funnel; add one if he wants it. |

## Photographs still worth replacing

The site works, but several photos are generic stock standing in for specific valleys.
**Ubaid guides these places for a living** and will have better pictures of them than any
stock library — and they would be genuinely his, which is the premise the page sells. Worth
asking for before anything goes live.

## Credit

Footer reads "Site by Imaar Studio", linking to imaarstudio.com.
