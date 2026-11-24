# The redesign plan

## Idea
Labs use one dye, Giemsa, for both halves of this product. On a blood smear it turns red cells rose and the
DNA in white cells violet. On chromosomes it draws the bands used to number them. So the palette is the stain:
**violet is DNA, rose is blood.** The report puts a marker and its blood test across from each other like a
base pair, with one to three dots between them (hydrogen bonds) for the strength of the evidence.

## Rules for the design
- Color means source. Violet is DNA, rose is blood. Status is carried by position and words, never hue alone.
- A, C, G, T use the standard Sanger chromatogram colors, only inside sequences.
- The hero is a microscope: a stained smear, then a cell, then the real sequence inside its nucleus.
- Pictures use real data: GRCh37 positions, UCSC G-bands, Ensembl sequence. Anything drawn says so.
- Headings are Hedvig Letters Serif, like a plate in an atlas. Text is Atkinson Hyperlegible, so 0/O and 1/l/I stay apart.
- No gradients for decoration, no glass, no glow, no eyebrow labels, no icon-card grids.

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
