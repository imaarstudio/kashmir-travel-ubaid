# Hero background film

The hero plays a film behind the headline, with the site header floating over
it. Drop the files in here and it plays automatically — nothing to wire up.

## What is installed

`kashmir-hero.mp4` — 960×540, 11.7s, **6.6 MB**, silent. **Pexels 15276213**: a
snow-laden deodar forest under mist, Kashmir in winter.

**Licence:** Pexels License — free for commercial use, no attribution required.

**It is over budget.** 6.6 MB against a ~3 MB target, and this is the first
screen for an audience largely on Indian mobile data. The cause is that
`avconvert` (macOS' built-in, and the only encoder on this machine) has fixed
quality presets with no rate control — the same weakness dreami's README
records. Snow and fine branches are expensive to compress, so it lands badly:

| Encode | Size |
| --- | --- |
| source, 4K | 49 MB |
| `Preset1280x720` | 11 MB |
| `Preset960x540` | **6.6 MB** ← installed |
| `PresetHEVC1920x1080` | 13 MB |

Re-encode with ffmpeg (see below) to get this to ~2 MB at better quality, and
add a `.webm` at roughly half that again.

### Composition note

The clip's left third is its busiest region — dense dark trees, exactly where
the headline sits. The left-weighted scrim knocks it back, but check it on a
real screen before signing off. If the type fights the branches, the fix in
order of preference: raise the left scrim stop, shift `object-position` right
so the open middle sits behind the text, or pick a calmer clip.

The fallbacks still apply if the film is removed:

## Files to add

| File | Role |
| --- | --- |
| `kashmir-hero.webm` | Preferred if present. VP9/AV1 is roughly half the size of H.264. |
| `kashmir-hero.mp4` | The fallback that does the work. H.264, **no audio track**. |
| `../img/hero-poster.jpg` | Shown while the film loads, and *instead* of it under reduced motion. |

## What to look for in the footage

- **A calm left third.** The headline sits there. Footage with its subject on
  the left fights the type.
- **Dark, or happy to be scrimmed.** Bright midday snow needs a heavy scrim and
  loses its detail anyway. Golden hour on the lake, mist in the pines, or a
  slow drift over the meadows all work.
- **No hard cuts, no fast motion, no zoom.** It loops forever behind text.
  A slow push or a locked-off shot with movement *inside* the frame is ideal —
  a shikara crossing, mist moving, chinar leaves.
- **Under ~3 MB.** It is on the first screen, and a lot of this audience is on
  mobile data.
- **8–12 seconds.** Long enough not to feel like a GIF, short enough to stay small.

Good subjects, in rough order of how well they'd carry this page: shikara on Dal
Lake at dawn · mist over Gulmarg's meadow · the Lidder running through Pahalgam ·
snow falling in a deodar forest · chinar leaves turning.

## Licensing — read before using anything

This is a commercial page for a real business, and the film is its most
prominent asset. It must be **Ubaid's own footage or properly licensed**.

The ideal case is Ubaid's own phone footage — he is there, it is free of any
licensing question, and it is genuinely his valley rather than stock. That is
worth asking for before buying anything.

Otherwise: **Pexels** and **Pexels Videos** are free for commercial use with no
attribution required, and that is what the dreami hero uses. Search "Kashmir",
"Dal Lake", "Srinagar", "Gulmarg". Record the source and ID in this file when
you add a file, the way dreami does.

Do **not** pull clips from other Kashmir agencies' sites, Instagram, or YouTube.

## Encoding

`ffmpeg` is **not installed on this machine** — check again before relying on
these. With it available, trim and encode properly rather than shipping a long
clip and seeking into it at playback:

```sh
# 9 seconds from 00:04, scaled to 1280 wide, silent
ffmpeg -i source.mp4 -ss 4 -t 9 -an -vf scale=1280:-2 \
  -c:v libvpx-vp9 -crf 34 -b:v 0 kashmir-hero.webm
ffmpeg -i source.mp4 -ss 4 -t 9 -an -vf scale=1280:-2 \
  -c:v libx264 -crf 30 -pix_fmt yuv420p -movflags +faststart kashmir-hero.mp4
ffmpeg -i kashmir-hero.mp4 -frames:v 1 -q:v 6 ../img/hero-poster.jpg
```

`-movflags +faststart` matters: it moves the index to the front of the file so
playback can begin before the whole thing has downloaded.

## How it's composited

Copied from the dreami hero, whose lesson was that **legibility comes from a
scrim, not from dimming the film**. An earlier version there ran the video at
`opacity: .3` and it read as a brown smudge you couldn't identify.

| Layer | Purpose |
| --- | --- |
| `.hero-film` | `opacity: 1`, mild `saturate(.92) contrast(1.03)` for colour only |
| `.hero-scrim` — directional | weighted left, where the headline sits |
| `.hero-scrim` — vertical | darkens the top so the overlaid nav reads, and the bottom so the hero meets the cream section on a clean edge |
| `.hero-scrim` — flat tint | `rgba(8,16,11,.22)` carrying overall contrast |

The three scrim layers compound, so none is heavy alone. If a replacement clip
is much brighter, raise the flat tint first — it costs the least detail.
