# Kashmir Travel with Ubaid

Single-page marketing site for a Kashmir-based travel agency. No fixed packages or
published prices — the page is built to sell The Valley and the person, then move the
visitor to a phone call or WhatsApp message.

Site by Imaar Studio.

## Stack

Plain static HTML, CSS and vanilla JS. No build step, no dependencies. Open
`index.html` directly, or serve the folder:

```sh
python3 -m http.server 8000
```

Deploys as-is to Netlify, Vercel, Cloudflare Pages or GitHub Pages.

```
index.html
css/styles.css
js/main.js          hero film + header state, scroll reveals, FAQ, nav highlighting
img/                photos — see img/README.md for the shot list
video/              hero background film — see video/README.md
```

## The hero

A background film with the site header floating over it, transparent, taking on
the cream bar only once the hero has scrolled past. Copied from the dreami hero,
including its central lesson: **legibility comes from a scrim, not from dimming
the film** — the video plays at full strength under three stacked scrims.

Nothing is installed yet, and the hero degrades in three tiers on its own:
the film → `img/hero-dal-lake.jpg` → the CSS gradient. `js/main.js` pulls the
`<video>` if no source loads, if autoplay is refused, or under
`prefers-reduced-motion`, so it can never sit there as a dead black box.

`video/README.md` covers what footage to look for, licensing, and the ffmpeg
commands to encode it.

## Client details on the page

These are live on the page now, taken from the agency's existing listing at
`kashmir-travell-with.grexa.site`:

| | |
| --- | --- |
| Phone / WhatsApp | `+91 8825012522` — `tel:` and `wa.me` links throughout |
| Address | Haji Abad, HIG Colony, Bemina, Srinagar, Jammu & Kashmir 190018 |
| Hours | Mon–Fri 8am–8pm · Sat–Sun 8am–10pm |
| Rating | 5.0 from 28+ travellers |

All of it also sits in the `TravelAgency` JSON-LD block in the `<head>`, including
`openingHoursSpecification`.

## Still open

- **Name spelling.** The existing site spells it **"Kashmir Travell with Ubaid"** — two
  l's. This site uses **"Kashmir Travel"**. Confirm which is the real trading name before
  launch; it needs to match the Google Business Profile for local SEO.
- **No email address** is published anywhere on the existing listing, so the page has no
  `mailto:` link — it routes everything to phone and WhatsApp, which suits the brief. Add
  one if Ubaid wants it.
- **No social handles** were listed either. If there's an Instagram, it belongs in the
  closing section.
- **Review quotes.** The 5.0-from-28 rating is real and displayed, but the review text on
  the existing site loads from a script and isn't in the page source — most likely it comes
  from a Google Business Profile. If you can pull three real quotes with names, they'd
  strengthen the Travellers section. Note the rating is deliberately *not* marked up as
  `aggregateRating` in the JSON-LD: Google's guidelines disallow self-serving review markup,
  and it can trigger a manual action.
- **Safety copy.** The FAQ answer about travelling in Kashmir should be read and approved by
  Ubaid in his own words.
- **`og.jpg`** — a 1200×630 social preview image, referenced but not yet present.
- **Hero film.** The best version of this is Ubaid's own phone footage of the
  valley — free of any licensing question and genuinely his. Worth asking him
  for before buying stock. Details in `video/README.md`.

## Photography

The site has no photos yet. Every image slot renders a scene-matched gradient
placeholder, so the page looks composed while you wait on assets. Dropping a
correctly named file into `img/` replaces the gradient automatically — the `<img>`
removes itself on error, so there is nothing to wire up.

See `img/README.md` for filenames, aspect ratios and what each shot should show.
