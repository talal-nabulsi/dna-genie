<p align="center">
  <a href="https://dnagenie.app"><img src="https://dnagenie.app/opengraph-image" alt="DNA Genie" width="720" /></a>
</p>

<h1 align="center">DNA Genie</h1>

<p align="center">
  Privacy-first genetic trait discovery. Drop in a 23andMe or AncestryDNA export, get 40 research-backed traits — parsed entirely in your browser.<br/>
  <a href="https://dnagenie.app"><strong>dnagenie.app</strong></a> · <a href="https://dnagenie.app/explore">3D genome explorer</a> · <a href="https://dnagenie.app/demo">try the demo</a>
</p>

---

## What it does

- **Reads raw genotype files** from 23andMe (`.txt`) and AncestryDNA (`.txt` / `.csv`). Format is auto-detected from the header.
- **Parses client-side.** A streaming parser walks the ~600,000-row file in 10,000-line chunks and keeps only the 44 rsIDs the trait panel needs. The raw file is never uploaded — there is no endpoint for it.
- **Interprets 40 traits across 8 categories** (personality, health, physical, nutrition, intelligence, sports, sleep, longevity). Every trait ships with genotype-level interpretations, actionable tips, a disclaimer where appropriate, and PubMed citations.
- **Interactive 3D helix** built with Three.js / React Three Fiber: hover base pairs in the hero, then orbit a full strand with all 40 SNP markers, filter by category, and fly into any trait.
- **Demo mode without an account.** A synthetic sample genome unlocks the whole dashboard, and you can also parse your own file locally with results held in session storage only.
- **Optional accounts** via Firebase Auth. Signed-in users store just their 44 trait genotypes in Firestore, scoped to their own UID by security rules.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 with a custom token layer, `motion` for scroll/state animation |
| 3D | `three`, `@react-three/fiber`, `@react-three/drei` |
| Data | Firebase Auth + Firestore (only for saved results) |
| Hosting | Firebase App Hosting → [dnagenie.app](https://dnagenie.app) |

## Project layout

```
app/                      Routes (landing, /explore, /demo, /auth, protected dashboard/upload/traits)
components/three/         Helix geometry, strand renderer, hero helix, genome explorer
components/landing/       Marketing sections (hero, how-it-works, trait gallery, privacy, FAQ)
components/dashboard/     Trait cards, filters, demo banner
components/traits/        Trait detail: genotype tiles, variant table, citations
lib/dna/                  Format detection + streaming parsers (23andMe, AncestryDNA)
lib/traits/               Trait database (40 traits, 44 rsIDs, PubMed refs) and interpreter
lib/demo/                 Sample genome + session-scoped demo store
contexts/                 Auth and demo providers
```

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your Firebase web config
npm run dev
```

The Firebase values are the public web-app config (they're also committed in `apphosting.yaml` for deploys). Access control lives in `firestore.rules`, not in the keys.

To regenerate the demo genome after editing the trait database:

```bash
npx tsx scripts/gen-sample-genome.ts > lib/demo/sampleGenome.ts
```

## How the privacy model works

1. The browser reads the file with the File API and splits it into lines.
2. Each line is matched against a `Set` of the 44 required rsIDs; non-matching rows are dropped immediately.
3. Genotypes are normalised (sorted allele pairs) and matched against per-trait variant tables, or compound logic for multi-SNP traits like MTHFR, APOE and TAS2R38.
4. In demo mode the result lives in `sessionStorage`. With an account, only the `{ rsid: genotype }` map (< 1 KB) is written to `users/{uid}/snpResults/data`.

## Disclaimer

DNA Genie is an educational tool. It reports published associations for common single variants and is not a diagnostic or clinical product. Talk to a clinician before acting on any health-related result.

## License

MIT © Talal Nabulsi
