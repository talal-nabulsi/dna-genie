# DNA Genie

Read a consumer DNA file beside a blood test. Live at [dnagenie.app](https://dnagenie.app), with a [sample report](https://dnagenie.app/demo).

DNA shows what you inherited. Blood shows what is happening now. DNA Genie reads 33 markers from a 23andMe or AncestryDNA file and, if you add a lab report, puts each marker across from the test that bears on it.

## What it does

- **Reads DNA on the device.** A streaming reader handles `.txt`, `.csv` and `.zip`, keeps 38 positions and skips the rest.
- **Reads blood reports on the device.** PDF text (via pdf.js) or CSV, 43 common tests, unit conversion, and the range printed by the lab. The person checks every value before it is used.
- **Pairs them.** 14 rules turn a genotype and a value into one explanation and one question for a clinician.
- **Visit summary.** Short, and made to print.
- **Genome map.** All 38 positions on G-banded chromosomes drawn to scale, and the real sequence around each in 3D.
- **Microscope.** A Giemsa-stained blood smear drawn in a fragment shader, using absorbance so overlapping cells darken as they do on glass.

## How it stays honest

- Citation titles are pulled from PubMed by ID (`npm run sync:citations`), so text cannot drift from the paper.
- Tests check that every marker has a row for each genotype, with alleles from Ensembl on the GRCh37 plus strand.
- Each result carries an evidence grade and says what it cannot tell you.
- APOE is hidden until the person asks to see it, and hidden results do not leak through pairs.
- No doses and no treatment advice. Very abnormal values show a same-day notice first.

## Privacy

Raw files are never sent. Without an account everything lives in `sessionStorage`. With one, genotypes are saved to `users/{uid}/snpResults/data`, and a blood panel to `users/{uid}/snpResults/bloodPanel` only if the person ticks a box. Firestore rules limit both to their owner. There are no analytics.

## Stack

Next.js 16, React 19, TypeScript, React Three Fiber, WebGL, pdf.js, Firebase Auth, Firestore and App Hosting, Vitest.

```bash
npm install
cp .env.example .env.local   # public Firebase web config
npm run dev
npm test
```

The design plan is in [docs/REDESIGN.md](docs/REDESIGN.md).

## Not medical advice

For learning. It does not diagnose. Consumer arrays can misread single positions, so confirm anything that matters with a clinical test.

MIT, Talal Nabulsi
