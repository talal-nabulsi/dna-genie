# Two strands: the redesign plan

## Idea
DNA has two strands. The product now does too: **what you inherited** (genotype file, blue ink) and
**what your blood shows today** (optional lab panel, red ink). Every screen is built from that pairing.
Where a marker has a matching blood test, the two sit across from each other like a base pair, and one to
three dots between them (hydrogen bonds) show how strong the evidence is.

## Rules for the design
- Colour means source. Blue is DNA, red is blood. Status is carried by position and words, never hue alone.
- A, C, G, T use the standard Sanger chromatogram colours, only inside sequences.
- Every picture is real data: GRCh37 positions, UCSC G-bands, Ensembl flanking sequence.
- Type is Atkinson Hyperlegible, drawn so 0/O, 1/l/I and rsIDs cannot be confused.
- No gradients, glass, pills, glow, eyebrow labels or icon-card grids.

## Order of work
1. **Content.** Check every citation against PubMed and every allele against Ensembl. Drop what fails.
2. **Blood panel.** Read PDF or CSV on the device, or type values in. The person reviews every value before use.
3. **Pair rules.** Marker + blood value -> one plain explanation and one question for a clinician.
4. **Screens.** Landing, report, marker detail, genome map, files, blood work, printable visit summary.
5. **Check.** Unit tests, a generated lab PDF end to end, desktop and phone, production build.

## Safety rules
- No diagnosis, no doses, no "start/stop" advice. A lab's printed range beats our general range.
- Very abnormal values show a "call your clinician today" notice before anything else.
- APOE stays hidden until the person chooses to see it.
- Blood values stay in the tab unless a signed-in person chooses to save them.
- No analytics on a site that handles health data.
