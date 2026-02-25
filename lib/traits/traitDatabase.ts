import { TraitDefinition, VariantInterpretation } from "./types";

// ─── PERSONALITY TRAITS ──────────────────────────────────────────────

const comtWarriorWorrier: TraitDefinition = {
  id: "comt-warrior-worrier",
  name: "Warrior vs Worrier",
  subtitle: "Stress response & dopamine metabolism",
  category: "personality",
  gene: "COMT",
  rsids: ["rs4680"],
  variants: [
    { genotype: "GG", label: "Warrior", description: "Higher dopamine breakdown. Calm under pressure, advantage in stressful situations, but may need more stimulation.", color: "green" },
    { genotype: "AG", label: "Balanced", description: "Intermediate dopamine levels. Good balance of stress resilience and cognitive performance.", color: "blue" },
    { genotype: "AA", label: "Worrier", description: "Lower dopamine breakdown. Superior cognitive performance in calm settings, but more stress-sensitive.", color: "purple" },
  ],
  description: "The COMT gene encodes an enzyme that breaks down dopamine in the prefrontal cortex. The Val158Met polymorphism determines how fast this happens, influencing your stress response and cognitive style.",
  funFact: "The 'Worrier' genotype is actually associated with better memory and attention — it's not all bad! Many elite chess players carry this variant.",
  tips: [
    "Warriors: Seek challenging environments where you thrive under pressure",
    "Worriers: Practice stress management techniques like meditation",
    "Both: Regular exercise helps regulate dopamine naturally",
    "Worriers may benefit from reducing caffeine if feeling anxious",
  ],
  studies: [
    { pmid: "15793579", title: "COMT val158met genotype affects processing of emotional stimuli", journal: "J Neurosci", year: 2005 },
    { pmid: "16953002", title: "The COMT Val158Met polymorphism and anxiety", journal: "Mol Psychiatry", year: 2006 },
  ],
};

const serotoninTransporter: TraitDefinition = {
  id: "serotonin-sensitivity",
  name: "Emotional Sensitivity",
  subtitle: "Serotonin transporter activity",
  category: "personality",
  gene: "SLC6A4",
  rsids: ["rs25531"],
  variants: [
    { genotype: "AA", label: "Higher Sensitivity", description: "Reduced serotonin reuptake. More emotionally responsive and empathetic, but may be more sensitive to stress.", color: "purple" },
    { genotype: "AG", label: "Moderate Sensitivity", description: "Intermediate serotonin transport. Balanced emotional responsiveness.", color: "blue" },
    { genotype: "GG", label: "Lower Sensitivity", description: "Efficient serotonin reuptake. More emotionally resilient, may be less affected by environmental stressors.", color: "green" },
  ],
  description: "The serotonin transporter gene influences how your brain recycles serotonin, affecting emotional processing, stress response, and mood regulation.",
  funFact: "People with higher sensitivity often excel in creative arts and counseling — their emotional depth is a superpower in the right context.",
  tips: [
    "Higher sensitivity: Build a strong support network and practice self-care",
    "Positive environments have an outsized beneficial effect on sensitive genotypes",
    "Regular exercise boosts serotonin naturally regardless of genotype",
  ],
  studies: [
    { pmid: "12869766", title: "Influence of life stress on depression: moderation by 5-HTT", journal: "Science", year: 2003 },
  ],
};

const oxytocin: TraitDefinition = {
  id: "oxytocin-empathy",
  name: "Empathy & Social Bonding",
  subtitle: "Oxytocin receptor sensitivity",
  category: "personality",
  gene: "OXTR",
  rsids: ["rs53576"],
  variants: [
    { genotype: "GG", label: "High Empathy", description: "Enhanced oxytocin signaling. Naturally empathetic with strong social bonds.", color: "green" },
    { genotype: "AG", label: "Moderate Empathy", description: "Intermediate oxytocin receptor sensitivity.", color: "blue" },
    { genotype: "AA", label: "Reserved", description: "Reduced oxytocin receptor sensitivity. May be more self-reliant and less affected by social cues.", color: "yellow" },
  ],
  description: "The oxytocin receptor gene influences how you respond to the 'bonding hormone,' affecting empathy, trust, and social behavior.",
  funFact: "GG carriers tend to be better at reading emotions from faces and are often described as 'warm' by strangers.",
  tips: [
    "GG carriers: Your empathy is a strength — set healthy boundaries to avoid emotional burnout",
    "AA carriers: Practice active listening to strengthen social connections",
    "Oxytocin releases naturally through hugging, socializing, and petting animals",
  ],
  studies: [
    { pmid: "19934046", title: "Oxytocin receptor gene and social cognition", journal: "PNAS", year: 2009 },
  ],
};

const riskTaking: TraitDefinition = {
  id: "risk-taking",
  name: "Risk Taking",
  subtitle: "Novelty seeking and impulsivity",
  category: "personality",
  gene: "DRD4",
  rsids: ["rs1800955"],
  variants: [
    { genotype: "TT", label: "Risk Taker", description: "Higher novelty-seeking tendency. Drawn to new experiences and may take more risks.", color: "red" },
    { genotype: "CT", label: "Moderate", description: "Balanced approach to risk and novelty.", color: "blue" },
    { genotype: "CC", label: "Cautious", description: "Lower novelty-seeking. Prefers familiar situations and careful planning.", color: "green" },
  ],
  description: "The DRD4 gene encodes a dopamine receptor involved in reward-seeking behavior. Variants influence how much novelty and stimulation you crave.",
  funFact: "The 'risk taker' variant is sometimes called the 'wanderlust gene' — it's found at higher rates in migratory populations.",
  tips: [
    "Risk takers: Channel your drive into calculated risks like entrepreneurship or adventure sports",
    "Cautious types: Don't be afraid to step outside your comfort zone occasionally",
  ],
  studies: [
    { pmid: "9399694", title: "Dopamine D4 receptor and novelty seeking", journal: "Mol Psychiatry", year: 1996 },
  ],
};

const resilience: TraitDefinition = {
  id: "stress-resilience",
  name: "Stress Resilience",
  subtitle: "Neuropeptide Y and stress recovery",
  category: "personality",
  gene: "NPY",
  rsids: ["rs16139"],
  variants: [
    { genotype: "TT", label: "Highly Resilient", description: "Higher neuropeptide Y expression. Faster stress recovery and greater emotional resilience.", color: "green" },
    { genotype: "CT", label: "Moderate Resilience", description: "Average stress recovery ability.", color: "blue" },
    { genotype: "CC", label: "Stress Sensitive", description: "Lower NPY expression. May take longer to recover from stressful events.", color: "yellow" },
  ],
  description: "Neuropeptide Y is one of the brain's key stress-buffering molecules. Higher levels are associated with resilience under extreme stress.",
  funFact: "Special forces soldiers who perform best under stress tend to have higher NPY levels.",
  tips: [
    "Cold exposure and intense exercise can boost NPY levels naturally",
    "Mindfulness meditation helps build stress resilience over time",
  ],
  studies: [
    { pmid: "10719141", title: "Neuropeptide Y and stress resilience", journal: "Biol Psychiatry", year: 2000 },
  ],
};

// ─── HEALTH TRAITS ───────────────────────────────────────────────────

const mthfr: TraitDefinition = {
  id: "mthfr",
  name: "MTHFR & Folate Metabolism",
  subtitle: "Methylation cycle efficiency",
  category: "health",
  gene: "MTHFR",
  rsids: ["rs1801133", "rs1801131"],
  isCompound: true,
  compoundLogic: (snps: Map<string, string>): VariantInterpretation | null => {
    const c677t = snps.get("rs1801133");
    const a1298c = snps.get("rs1801131");
    if (!c677t && !a1298c) return null;

    const has677Homo = c677t === "AA";
    const has677Het = c677t === "AG" || c677t === "GA";
    const has1298Homo = a1298c === "GG";
    const has1298Het = a1298c === "GT" || a1298c === "TG";

    if (has677Homo) {
      return { genotype: `C677T: ${c677t} / A1298C: ${a1298c || "N/A"}`, label: "Significantly Reduced (~30% activity)", description: "Homozygous C677T mutation. MTHFR enzyme activity reduced to ~30%. Consider methylfolate supplementation and B-vitamin support. Discuss with your doctor.", color: "red" };
    }
    if (has677Het && (has1298Het || has1298Homo)) {
      return { genotype: `C677T: ${c677t} / A1298C: ${a1298c}`, label: "Compound Heterozygous (~50% activity)", description: "One copy of each mutation. Moderate reduction in MTHFR activity. May benefit from methylfolate and active B12.", color: "yellow" };
    }
    if (has677Het) {
      return { genotype: `C677T: ${c677t} / A1298C: ${a1298c || "N/A"}`, label: "Mildly Reduced (~65% activity)", description: "Heterozygous C677T. Mild reduction in enzyme activity. Generally manageable with a folate-rich diet.", color: "yellow" };
    }
    if (has1298Homo) {
      return { genotype: `C677T: ${c677t || "N/A"} / A1298C: ${a1298c}`, label: "Moderately Reduced", description: "Homozygous A1298C. Moderate effect on BH4 production. Ensure adequate folate and B-vitamin intake.", color: "yellow" };
    }
    if (has1298Het) {
      return { genotype: `C677T: ${c677t || "N/A"} / A1298C: ${a1298c}`, label: "Mildly Reduced", description: "Heterozygous A1298C. Minor effect. Generally no action needed with a normal diet.", color: "blue" };
    }
    return { genotype: `C677T: ${c677t || "N/A"} / A1298C: ${a1298c || "N/A"}`, label: "Normal Activity", description: "No significant MTHFR variants detected. Normal folate metabolism.", color: "green" };
  },
  variants: [],
  description: "MTHFR is a key enzyme in the methylation cycle, converting folate into its active form (methylfolate). This affects homocysteine levels, DNA repair, neurotransmitter production, and detoxification. Two SNPs together determine your overall enzyme activity.",
  funFact: "About 10-15% of Caucasians and up to 25% of Hispanics are homozygous for C677T.",
  tips: [
    "If reduced activity: Consider methylfolate (5-MTHF) instead of folic acid supplements",
    "Eat folate-rich foods: leafy greens, legumes, avocados",
    "Active B12 (methylcobalamin) works synergistically with methylfolate",
    "Avoid folic acid fortified foods if you have significantly reduced activity",
    "Ask your doctor about homocysteine level testing",
  ],
  studies: [
    { pmid: "9545397", title: "MTHFR C677T polymorphism and risk of coronary heart disease", journal: "JAMA", year: 1998 },
    { pmid: "19625277", title: "MTHFR polymorphisms and disease", journal: "Annu Rev Genomics Hum Genet", year: 2009 },
  ],
  disclaimer: "MTHFR variants are common and most people with these variants are healthy. This is not a diagnosis. Consult your healthcare provider before making supplement changes.",
};

const apoe: TraitDefinition = {
  id: "apoe",
  name: "ApoE & Heart Health",
  subtitle: "Lipid metabolism and cardiovascular risk",
  category: "health",
  gene: "APOE",
  rsids: ["rs429358", "rs7412"],
  isCompound: true,
  compoundLogic: (snps: Map<string, string>): VariantInterpretation | null => {
    const rs429 = snps.get("rs429358");
    const rs7412val = snps.get("rs7412");
    if (!rs429 && !rs7412val) return null;

    const has429C = rs429?.includes("C");
    const has7412T = rs7412val?.includes("T");
    const is429CC = rs429 === "CC";
    const is7412TT = rs7412val === "TT";

    if (is429CC) {
      return { genotype: `rs429358: ${rs429} / rs7412: ${rs7412val || "N/A"}`, label: "E4/E4 — Higher Risk", description: "Two copies of APOE4. Associated with higher LDL cholesterol and increased cardiovascular risk. Proactive lifestyle measures are especially beneficial.", color: "red" };
    }
    if (has429C && !has7412T) {
      return { genotype: `rs429358: ${rs429} / rs7412: ${rs7412val || "N/A"}`, label: "E3/E4 — Slightly Elevated Risk", description: "One copy of APOE4. Mildly increased cardiovascular risk. Healthy diet and exercise can significantly mitigate this.", color: "yellow" };
    }
    if (is7412TT) {
      return { genotype: `rs429358: ${rs429 || "N/A"} / rs7412: ${rs7412val}`, label: "E2/E2 — Lower LDL", description: "Two copies of APOE2. Generally associated with lower LDL cholesterol. Rarely linked to type III hyperlipoproteinemia.", color: "green" };
    }
    if (has7412T && !has429C) {
      return { genotype: `rs429358: ${rs429 || "N/A"} / rs7412: ${rs7412val}`, label: "E2/E3 — Favorable", description: "One copy of APOE2. Tends toward lower LDL cholesterol levels.", color: "green" };
    }
    return { genotype: `rs429358: ${rs429 || "N/A"} / rs7412: ${rs7412val || "N/A"}`, label: "E3/E3 — Average", description: "The most common genotype. Average lipid metabolism and cardiovascular risk profile.", color: "blue" };
  },
  variants: [],
  description: "APOE is a major gene involved in cholesterol transport and lipid metabolism. Three common isoforms (E2, E3, E4) are determined by two SNPs and influence cardiovascular health risk.",
  tips: [
    "E4 carriers: Focus on heart-healthy diet (Mediterranean diet recommended)",
    "Regular cardiovascular exercise is especially beneficial for E4 carriers",
    "Get lipid panel tested regularly",
    "Omega-3 fatty acids may help manage cholesterol levels",
  ],
  studies: [
    { pmid: "17620451", title: "APOE genotype and cardiovascular disease risk", journal: "Atherosclerosis", year: 2007 },
  ],
  disclaimer: "APOE status is one of many factors affecting cardiovascular health. This is not a diagnosis. Discuss your results with your healthcare provider.",
};

const alcoholFlush: TraitDefinition = {
  id: "alcohol-flush",
  name: "Alcohol Flush Reaction",
  subtitle: "Acetaldehyde metabolism",
  category: "health",
  gene: "ALDH2",
  rsids: ["rs671"],
  variants: [
    { genotype: "GG", label: "Normal Metabolism", description: "Full ALDH2 enzyme activity. Normal acetaldehyde metabolism after drinking alcohol.", color: "green" },
    { genotype: "AG", label: "Partial Flush", description: "Reduced ALDH2 activity (~60% reduction). May experience facial flushing, nausea, or rapid heartbeat after drinking. Increased esophageal cancer risk with regular alcohol use.", color: "yellow" },
    { genotype: "AA", label: "Severe Flush", description: "Minimal ALDH2 activity (~95% reduction). Severe flushing reaction to alcohol. Significantly elevated cancer risk from alcohol consumption.", color: "red" },
  ],
  description: "The ALDH2 gene encodes the enzyme that clears acetaldehyde, a toxic byproduct of alcohol metabolism. The *2 variant causes a buildup of acetaldehyde, leading to the 'Asian flush' reaction.",
  funFact: "This variant is carried by ~540 million people, primarily of East Asian descent. It's one of the most common enzyme deficiencies in humans.",
  tips: [
    "If you have the flush reaction, limiting alcohol is strongly recommended",
    "Acetaldehyde is a Group 1 carcinogen — flush reaction is a warning signal",
    "No amount of 'tolerance building' can fix an enzyme deficiency",
    "Antihistamines may hide the flush but don't stop the toxic acetaldehyde buildup",
  ],
  studies: [
    { pmid: "19264983", title: "ALDH2 and esophageal cancer risk", journal: "PLoS Med", year: 2009 },
  ],
  disclaimer: "This trait relates to alcohol metabolism only. It is not a recommendation for or against alcohol consumption. Consult your doctor for health advice.",
};

const celiacRisk: TraitDefinition = {
  id: "celiac-risk",
  name: "Celiac Disease Risk",
  subtitle: "HLA-DQ gluten sensitivity markers",
  category: "health",
  gene: "HLA-DQ",
  rsids: ["rs2187668"],
  variants: [
    { genotype: "TT", label: "Higher Risk (HLA-DQ2+)", description: "Homozygous for HLA-DQ2.5 risk allele. Significantly increased genetic susceptibility to celiac disease. Does NOT mean you have celiac — additional triggers are needed.", color: "red" },
    { genotype: "CT", label: "Moderate Risk", description: "Heterozygous carrier. Moderately increased susceptibility. Most carriers never develop celiac disease.", color: "yellow" },
    { genotype: "CC", label: "Lower Risk", description: "Does not carry the primary HLA-DQ2.5 risk allele. Very low (but not zero) risk for celiac disease.", color: "green" },
  ],
  description: "HLA-DQ2 and HLA-DQ8 are immune system genes that present gluten peptides to T cells. Carrying specific variants is necessary (but not sufficient) for developing celiac disease.",
  tips: [
    "Higher risk does NOT mean you have celiac disease — only ~3% of carriers develop it",
    "If you have digestive symptoms, ask your doctor about celiac antibody testing",
    "Do NOT start a gluten-free diet before getting tested — it can cause false negatives",
  ],
  studies: [
    { pmid: "18509540", title: "HLA-DQ and celiac disease risk", journal: "Nat Genet", year: 2008 },
  ],
  disclaimer: "Genetic risk is not a diagnosis. Many people with these markers never develop celiac disease. Consult a gastroenterologist for proper evaluation.",
};

const vitaminD: TraitDefinition = {
  id: "vitamin-d",
  name: "Vitamin D Levels",
  subtitle: "Vitamin D binding and conversion",
  category: "health",
  gene: "GC",
  rsids: ["rs2282679"],
  variants: [
    { genotype: "TT", label: "Lower Levels Likely", description: "Associated with significantly lower circulating vitamin D levels. May need higher intake or more sun exposure.", color: "red" },
    { genotype: "GT", label: "Moderately Lower", description: "Intermediate vitamin D binding protein levels. Monitor your levels.", color: "yellow" },
    { genotype: "GG", label: "Normal Levels", description: "Typical vitamin D binding protein. Standard sun exposure and diet usually sufficient.", color: "green" },
  ],
  description: "The GC gene encodes vitamin D binding protein, which transports vitamin D in your blood. Variants affect how efficiently you maintain vitamin D levels.",
  tips: [
    "Get your vitamin D blood levels tested (25-OH-D test)",
    "If genetically predisposed to lower levels, consider supplementation (D3 preferred)",
    "Aim for 20-30 minutes of midday sun exposure when possible",
    "Vitamin D-rich foods: fatty fish, egg yolks, fortified milk",
  ],
  studies: [
    { pmid: "20541252", title: "Common genetic determinants of vitamin D insufficiency", journal: "Lancet", year: 2010 },
  ],
  disclaimer: "Get your vitamin D levels tested before supplementing. This is not medical advice.",
};

// ─── PHYSICAL TRAITS ─────────────────────────────────────────────────

const eyeColor: TraitDefinition = {
  id: "eye-color",
  name: "Eye Color",
  subtitle: "Iris pigmentation genetics",
  category: "physical",
  gene: "HERC2/OCA2",
  rsids: ["rs12913832"],
  variants: [
    { genotype: "GG", label: "Likely Blue/Green", description: "Reduced OCA2 expression leads to less melanin in the iris. Most likely blue or green eyes.", color: "blue" },
    { genotype: "AG", label: "Green/Hazel", description: "Intermediate melanin production. Often green, hazel, or lighter brown eyes.", color: "green" },
    { genotype: "AA", label: "Likely Brown", description: "Full OCA2 expression. High melanin in the iris, typically brown eyes.", color: "yellow" },
  ],
  description: "This SNP in HERC2 controls the expression of the OCA2 gene, the primary determinant of iris color. It acts as a master switch for melanin production in the eye.",
  funFact: "All blue-eyed people share a single common ancestor who lived near the Black Sea 6,000-10,000 years ago!",
  studies: [
    { pmid: "18172690", title: "A single SNP in HERC2 determines human blue-brown eye color", journal: "Am J Hum Genet", year: 2008 },
  ],
};

const earwax: TraitDefinition = {
  id: "earwax-type",
  name: "Earwax Type",
  subtitle: "Wet vs dry earwax",
  category: "physical",
  gene: "ABCC11",
  rsids: ["rs17822931"],
  variants: [
    { genotype: "CC", label: "Wet Earwax", description: "Wet, sticky earwax. Also associated with stronger body odor (more active apocrine glands).", color: "blue" },
    { genotype: "CT", label: "Wet Earwax", description: "Wet type is dominant. Similar to CC — wet, honey-colored earwax.", color: "blue" },
    { genotype: "TT", label: "Dry Earwax", description: "Dry, flaky, gray earwax. Also associated with less body odor. Very common in East Asian populations.", color: "green" },
  ],
  description: "The ABCC11 gene controls the type of earwax you produce and also influences body odor by affecting apocrine sweat gland secretions.",
  funFact: "In Japan, ~95% of people have dry earwax (TT). This is why deodorant is much less commonly used there!",
  studies: [
    { pmid: "16444273", title: "A SNP in the ABCC11 gene determines earwax type", journal: "Nat Genet", year: 2006 },
  ],
};

const hairThickness: TraitDefinition = {
  id: "hair-thickness",
  name: "Hair Thickness",
  subtitle: "Hair follicle cross-section",
  category: "physical",
  gene: "EDAR",
  rsids: ["rs3827760"],
  variants: [
    { genotype: "CC", label: "Thicker Hair", description: "Associated with thicker hair strands, more active sebaceous glands, and shovel-shaped incisors. Common in East Asian populations.", color: "blue" },
    { genotype: "CT", label: "Intermediate", description: "Intermediate hair thickness.", color: "green" },
    { genotype: "TT", label: "Typical Thickness", description: "Standard hair follicle cross-section. Most common in European and African populations.", color: "gray" },
  ],
  description: "The EDAR gene influences hair follicle development. A gain-of-function variant common in East Asians produces thicker hair, more sweat glands, and distinctive tooth shape.",
  funFact: "This same variant also affects tooth shape (shovel-shaped incisors) and sweat gland density!",
  studies: [
    { pmid: "23426440", title: "Modeling recent human evolution in mice", journal: "Cell", year: 2013 },
  ],
};

const freckling: TraitDefinition = {
  id: "freckling",
  name: "Freckling",
  subtitle: "Melanocortin-1 receptor variants",
  category: "physical",
  gene: "MC1R",
  rsids: ["rs1805007"],
  variants: [
    { genotype: "TT", label: "Strong Freckling", description: "Two copies of MC1R variant. Very likely to have freckles, red hair tendency, and fair skin.", color: "red" },
    { genotype: "CT", label: "Some Freckling", description: "One copy. May have some freckles, especially with sun exposure. Possibly lighter or reddish hair tones.", color: "yellow" },
    { genotype: "CC", label: "Less Likely", description: "No MC1R R151C variant. Less predisposed to freckling (other variants may still contribute).", color: "green" },
  ],
  description: "MC1R is the major gene controlling skin and hair pigmentation. Certain variants shift melanin production toward pheomelanin (red/yellow) rather than eumelanin (brown/black).",
  funFact: "Red hair only needs one gene, but it's recessive — both parents must carry a variant for the classic red hair phenotype.",
  tips: [
    "MC1R variants are associated with higher UV sensitivity — use sunscreen!",
    "If you carry variants, you may be more sensitive to pain (MC1R affects pain pathways too)",
  ],
  studies: [
    { pmid: "11260232", title: "MC1R variants, melanoma and red hair", journal: "Hum Mol Genet", year: 2001 },
  ],
};

const unibrow: TraitDefinition = {
  id: "unibrow",
  name: "Unibrow Tendency",
  subtitle: "Eyebrow hair connectivity",
  category: "physical",
  gene: "PAX3",
  rsids: ["rs7559271"],
  variants: [
    { genotype: "CC", label: "More Likely", description: "Increased tendency for connected eyebrows (synophrys).", color: "blue" },
    { genotype: "CT", label: "Moderate", description: "Some tendency toward thicker eyebrow growth in the middle.", color: "green" },
    { genotype: "TT", label: "Less Likely", description: "Lower genetic tendency for eyebrow connectivity.", color: "gray" },
  ],
  description: "PAX3 is a transcription factor involved in facial development. Variants near this gene influence eyebrow thickness and connectivity.",
  funFact: "Frida Kahlo famously embraced her unibrow as a symbol of identity and cultural pride.",
  studies: [
    { pmid: "26926045", title: "A genome-wide association scan of facial hair features", journal: "Nat Commun", year: 2016 },
  ],
};

// ─── FOOD & NUTRITION ────────────────────────────────────────────────

const caffeine: TraitDefinition = {
  id: "caffeine-metabolism",
  name: "Caffeine Metabolism",
  subtitle: "How fast you process caffeine",
  category: "nutrition",
  gene: "CYP1A2",
  rsids: ["rs762551"],
  variants: [
    { genotype: "AA", label: "Fast Metabolizer", description: "Rapid caffeine clearance. Coffee may actually be protective for your heart. You probably handle espresso after dinner just fine.", color: "green" },
    { genotype: "AC", label: "Moderate", description: "Intermediate caffeine metabolism. Moderate coffee intake is likely fine.", color: "blue" },
    { genotype: "CC", label: "Slow Metabolizer", description: "Caffeine lingers much longer in your system. More than 2 cups/day may increase heart disease risk. Avoid afternoon coffee for better sleep.", color: "red" },
  ],
  description: "CYP1A2 is the primary enzyme responsible for breaking down caffeine in your liver. Your genotype determines whether caffeine is cleared quickly or slowly from your body.",
  funFact: "Fast metabolizers who drink 1-3 cups of coffee per day actually have a LOWER risk of heart attack compared to non-drinkers!",
  tips: [
    "Fast metabolizers: Enjoy your coffee — it may be protective",
    "Slow metabolizers: Limit to 1-2 cups before noon",
    "Slow metabolizers: Watch for hidden caffeine in chocolate, tea, and energy drinks",
    "Half-life of caffeine in slow metabolizers: ~8 hours vs ~3 hours for fast metabolizers",
  ],
  studies: [
    { pmid: "16522833", title: "Coffee, CYP1A2 genotype, and risk of myocardial infarction", journal: "JAMA", year: 2006 },
  ],
};

const lactose: TraitDefinition = {
  id: "lactose-tolerance",
  name: "Lactose Tolerance",
  subtitle: "Lactase persistence into adulthood",
  category: "nutrition",
  gene: "MCM6/LCT",
  rsids: ["rs4988235"],
  variants: [
    { genotype: "TT", label: "Lactose Tolerant", description: "Lactase persistence. Your body continues producing the lactase enzyme into adulthood. Dairy digestion is effortless.", color: "green" },
    { genotype: "CT", label: "Likely Tolerant", description: "One copy of the persistence allele. Most people with this genotype can digest dairy without issues.", color: "green" },
    { genotype: "CC", label: "Likely Intolerant", description: "No lactase persistence. Your lactase production likely declined after childhood. Dairy may cause bloating, gas, or cramping.", color: "red" },
  ],
  description: "Most mammals stop producing lactase after weaning. A mutation near the LCT gene allows some humans to keep producing it, enabling dairy digestion throughout life. This mutation arose independently multiple times in pastoral populations.",
  funFact: "Lactase persistence evolved independently at least 5 times in different populations — in Europe, East Africa, the Middle East, and Central Asia. It's a textbook example of convergent evolution!",
  tips: [
    "If intolerant: Aged cheeses and yogurt are often better tolerated (bacteria pre-digest lactose)",
    "Lactase enzyme supplements can help with occasional dairy consumption",
    "Plant milks and lactose-free dairy are widely available alternatives",
    "Calcium can come from leafy greens, almonds, sardines, and fortified foods",
  ],
  studies: [
    { pmid: "11788828", title: "Identification of a variant associated with adult-type hypolactasia", journal: "Nat Genet", year: 2002 },
  ],
};

const bitterTaste: TraitDefinition = {
  id: "bitter-taste",
  name: "Bitter Taste Perception",
  subtitle: "PTC/PROP tasting ability",
  category: "nutrition",
  gene: "TAS2R38",
  rsids: ["rs713598", "rs1726866", "rs10246939"],
  isCompound: true,
  compoundLogic: (snps: Map<string, string>): VariantInterpretation | null => {
    const rs1 = snps.get("rs713598");
    const rs2 = snps.get("rs1726866");
    const rs3 = snps.get("rs10246939");
    if (!rs1 && !rs2 && !rs3) return null;

    let pavCount = 0;
    let aviCount = 0;
    let total = 0;

    if (rs1) { total++; if (rs1.includes("G")) pavCount++; if (rs1.includes("C")) aviCount++; }
    if (rs2) { total++; if (rs2.includes("A")) pavCount++; if (rs2.includes("G")) aviCount++; }
    if (rs3) { total++; if (rs3.includes("C")) pavCount++; if (rs3.includes("T")) aviCount++; }

    if (total === 0) return null;

    const pavRatio = pavCount / total;
    const aviRatio = aviCount / total;

    if (pavRatio > 0.7) {
      return { genotype: "PAV/PAV (Super Taster)", label: "Super Taster", description: "You have two copies of the PAV haplotype. Intensely sensitive to bitter compounds (PTC/PROP). Broccoli, Brussels sprouts, grapefruit, and dark coffee may taste very bitter.", color: "purple" };
    }
    if (aviRatio > 0.7) {
      return { genotype: "AVI/AVI (Non-Taster)", label: "Non-Taster", description: "You have two copies of the AVI haplotype. Low sensitivity to PTC/PROP bitter compounds. Brassica vegetables likely taste mild to you.", color: "green" };
    }
    return { genotype: "PAV/AVI (Taster)", label: "Medium Taster", description: "One copy of each haplotype. Moderate sensitivity to bitter compounds. You can detect PTC but less intensely than super tasters.", color: "blue" };
  },
  variants: [],
  description: "TAS2R38 encodes a bitter taste receptor. Three SNPs together form haplotypes (PAV = taster, AVI = non-taster) that determine your sensitivity to bitter compounds like PTC, PROP, and similar chemicals in cruciferous vegetables.",
  funFact: "Super tasters make up ~25% of the population. They often dislike black coffee, dark chocolate, and hoppy beer — but they're also better at detecting spoiled food!",
  tips: [
    "Super tasters: Try roasting or sautéing bitter vegetables to reduce bitterness",
    "Non-tasters: You may need to watch salt and fat intake (less bitter sensitivity = less natural aversion)",
    "Super tasters tend to prefer fewer and more selective food choices",
  ],
  studies: [
    { pmid: "12595690", title: "Positional cloning of the human quantitative trait locus underlying taste sensitivity to PTC", journal: "Science", year: 2003 },
  ],
};

const cilantro: TraitDefinition = {
  id: "cilantro-taste",
  name: "Cilantro Taste",
  subtitle: "Soap-like taste perception",
  category: "nutrition",
  gene: "OR6A2",
  rsids: ["rs72921001"],
  variants: [
    { genotype: "CC", label: "Normal Taste", description: "Cilantro likely tastes fresh and herbal to you.", color: "green" },
    { genotype: "CT", label: "Mildly Soapy", description: "May detect a slight soapy note but can generally enjoy cilantro.", color: "yellow" },
    { genotype: "TT", label: "Soapy Taste", description: "Cilantro likely tastes like soap to you! Your olfactory receptor is highly sensitive to the aldehyde compounds in cilantro.", color: "red" },
  ],
  description: "OR6A2 is an olfactory receptor gene that detects specific aldehydes present in cilantro. Variants affect how strongly you perceive these compounds, with some people experiencing a strong soapy or metallic taste.",
  funFact: "Julia Child famously hated cilantro. About 4-14% of people (varying by ethnicity) experience the soapy taste.",
  studies: [
    { pmid: "22927851", title: "A genetic variant near olfactory receptor genes influences cilantro preference", journal: "Flavour", year: 2012 },
  ],
};

const aspirinResponse: TraitDefinition = {
  id: "asparagus-smell",
  name: "Asparagus Smell Detection",
  subtitle: "Urine odor perception after asparagus",
  category: "nutrition",
  gene: "OR2M7",
  rsids: ["rs4481887"],
  variants: [
    { genotype: "GG", label: "Strong Detector", description: "Highly likely to detect the characteristic smell in urine after eating asparagus.", color: "blue" },
    { genotype: "AG", label: "May Detect", description: "Intermediate ability to detect asparagus metabolite odor.", color: "green" },
    { genotype: "AA", label: "Cannot Detect", description: "Unlikely to smell anything unusual after eating asparagus. The metabolites are still there — you just can't smell them!", color: "gray" },
  ],
  description: "After eating asparagus, your body produces sulfur-containing metabolites. This gene determines whether your olfactory receptors can detect these compounds in urine.",
  funFact: "For a long time, scientists debated whether 'asparagus pee' was about production or detection. Turns out almost everyone produces it, but only some can smell it!",
  studies: [
    { pmid: "27911045", title: "Sniffing out significant 'Pee values': genome-wide association study of asparagus anosmia", journal: "BMJ", year: 2016 },
  ],
};

// ─── INTELLIGENCE ────────────────────────────────────────────────────

const bdnfMemory: TraitDefinition = {
  id: "bdnf-memory",
  name: "Memory & Learning",
  subtitle: "Brain-derived neurotrophic factor",
  category: "intelligence",
  gene: "BDNF",
  rsids: ["rs6265"],
  variants: [
    { genotype: "CC", label: "Typical BDNF", description: "Normal BDNF secretion. Standard memory formation and synaptic plasticity.", color: "green" },
    { genotype: "CT", label: "Slightly Reduced", description: "One copy of Met variant. Mildly reduced activity-dependent BDNF secretion. Mostly compensated by other factors.", color: "blue" },
    { genotype: "TT", label: "Reduced BDNF", description: "Two copies of Met variant. Reduced BDNF secretion may affect episodic memory and hippocampal function. Exercise is especially beneficial.", color: "yellow" },
  ],
  description: "BDNF is a growth factor critical for neuron survival, memory formation, and learning. The Val66Met polymorphism affects how efficiently BDNF is released in response to neural activity.",
  funFact: "Exercise increases BDNF levels by 2-3x regardless of genotype — it's often called 'Miracle-Gro for the brain.'",
  tips: [
    "Aerobic exercise is the #1 way to boost BDNF naturally",
    "Intermittent fasting has been shown to increase BDNF levels",
    "Adequate sleep is critical for BDNF-dependent memory consolidation",
    "Social engagement and learning new skills also stimulate BDNF production",
  ],
  studies: [
    { pmid: "12553913", title: "The BDNF val66met polymorphism affects activity-dependent secretion of BDNF and human memory", journal: "Cell", year: 2003 },
  ],
};

const drd2Focus: TraitDefinition = {
  id: "drd2-focus",
  name: "Focus & Attention",
  subtitle: "Dopamine receptor density",
  category: "intelligence",
  gene: "DRD2",
  rsids: ["rs1800497"],
  variants: [
    { genotype: "CC", label: "Higher D2 Density", description: "More dopamine D2 receptors. Associated with better reward learning, focus, and lower addiction risk.", color: "green" },
    { genotype: "CT", label: "Moderate", description: "Intermediate D2 receptor density. Balanced dopamine signaling.", color: "blue" },
    { genotype: "TT", label: "Lower D2 Density", description: "Fewer D2 receptors (Taq1A A1/A1). May need more stimulation for motivation. Higher novelty-seeking tendency.", color: "yellow" },
  ],
  description: "The DRD2 gene encodes the dopamine D2 receptor, critical for reward processing, motivation, and sustained attention. Receptor density affects how you respond to rewards and maintain focus.",
  tips: [
    "Lower D2: Break tasks into smaller rewards to maintain motivation",
    "Regular exercise increases D2 receptor density over time",
    "Mindfulness practice can help improve sustained attention",
  ],
  studies: [
    { pmid: "18391945", title: "DRD2/ANKK1 TaqIA polymorphism and brain function", journal: "Genes Brain Behav", year: 2008 },
  ],
};

const kibra: TraitDefinition = {
  id: "kibra-memory",
  name: "Episodic Memory",
  subtitle: "Memory encoding efficiency",
  category: "intelligence",
  gene: "KIBRA",
  rsids: ["rs17070145"],
  variants: [
    { genotype: "TT", label: "Enhanced Memory", description: "Associated with better episodic memory performance and more efficient hippocampal activation.", color: "green" },
    { genotype: "CT", label: "Good Memory", description: "One copy of the T allele. Generally good memory encoding.", color: "blue" },
    { genotype: "CC", label: "Typical Memory", description: "Standard memory performance. Benefits more from mnemonic techniques and spaced repetition.", color: "gray" },
  ],
  description: "KIBRA (WWC1) is involved in synaptic plasticity and memory consolidation in the hippocampus. The T allele is associated with better episodic memory performance across multiple studies.",
  funFact: "This was one of the first genes discovered to influence normal human memory variation, found in a study of over 300 Swiss university students.",
  studies: [
    { pmid: "16906130", title: "KIBRA is associated with episodic memory", journal: "Science", year: 2006 },
  ],
};

// ─── SPORTS ──────────────────────────────────────────────────────────

const actn3Sprinter: TraitDefinition = {
  id: "actn3-sprinter",
  name: "Muscle Fiber Type",
  subtitle: "Sprinter vs endurance genetics",
  category: "sports",
  gene: "ACTN3",
  rsids: ["rs1815739"],
  variants: [
    { genotype: "CC", label: "Power/Sprint", description: "Full alpha-actinin-3 in fast-twitch fibers. Optimized for explosive power, sprinting, and strength sports.", color: "red" },
    { genotype: "CT", label: "Mixed Type", description: "One working copy. Good for both power and endurance activities. Most versatile athletic profile.", color: "blue" },
    { genotype: "TT", label: "Endurance", description: "No alpha-actinin-3 (R577X). Fast-twitch fibers shift toward endurance characteristics. Better suited for long-distance events.", color: "green" },
  ],
  description: "ACTN3 encodes alpha-actinin-3, a structural protein found exclusively in fast-twitch muscle fibers. The R577X (TT) variant causes a complete absence of this protein, shifting muscle properties toward endurance.",
  funFact: "Almost every Olympic sprinter ever tested has at least one C allele. Meanwhile, ~18% of the world population is TT — it's not a deficiency, just a different optimization!",
  tips: [
    "CC: You may excel at sprinting, weightlifting, and explosive sports",
    "TT: Consider endurance sports like marathon running, cycling, or swimming",
    "CT: You have the most flexibility — experiment with different sports",
    "Training matters more than genetics — these are tendencies, not limits",
  ],
  studies: [
    { pmid: "18043716", title: "ACTN3 genotype is associated with human elite athletic performance", journal: "Am J Hum Genet", year: 2003 },
  ],
};

const vo2max: TraitDefinition = {
  id: "vo2max-response",
  name: "VO2 Max Trainability",
  subtitle: "Aerobic capacity response to training",
  category: "sports",
  gene: "PPARGC1A",
  rsids: ["rs8192678"],
  variants: [
    { genotype: "GG", label: "High Responder", description: "Likely to see significant VO2 max improvements with aerobic training. Strong mitochondrial biogenesis response.", color: "green" },
    { genotype: "GA", label: "Moderate Responder", description: "Average aerobic training response. Consistent training still yields good results.", color: "blue" },
    { genotype: "AA", label: "Lower Responder", description: "May need more training volume to achieve the same VO2 max improvements. Doesn't mean you can't be fit — just may take more effort.", color: "yellow" },
  ],
  description: "PPARGC1A (PGC-1α) is the master regulator of mitochondrial biogenesis — the process of creating new mitochondria in your cells. It directly affects how your body responds to aerobic training.",
  tips: [
    "Lower responders: High-intensity interval training (HIIT) can be more effective than steady-state",
    "Consistency is more important than intensity for all genotypes",
    "Cold exposure can also activate PGC-1α and boost mitochondrial biogenesis",
  ],
  studies: [
    { pmid: "13129993", title: "PGC-1alpha and exercise", journal: "Nature", year: 2002 },
  ],
};

const injuryRisk: TraitDefinition = {
  id: "tendon-injury",
  name: "Tendon Injury Risk",
  subtitle: "Collagen and connective tissue",
  category: "sports",
  gene: "COL5A1",
  rsids: ["rs12722"],
  variants: [
    { genotype: "TT", label: "More Flexible", description: "Associated with greater flexibility and range of motion, but higher risk of tendon/ligament injuries like Achilles tendinopathy.", color: "yellow" },
    { genotype: "CT", label: "Moderate", description: "Intermediate collagen properties. Balanced flexibility and tendon strength.", color: "blue" },
    { genotype: "CC", label: "Stiffer Tendons", description: "Denser collagen structure. Less flexible but more resistant to tendon injuries. Better for explosive movements.", color: "green" },
  ],
  description: "COL5A1 encodes type V collagen, which regulates the diameter of collagen fibrils in tendons and ligaments. Variants affect the balance between flexibility and structural integrity.",
  tips: [
    "TT: Extra warm-up and eccentric exercises to protect tendons",
    "CC: Regular stretching to maintain range of motion",
    "All types: Progressive loading and adequate recovery prevent injuries",
  ],
  studies: [
    { pmid: "19793828", title: "COL5A1 gene variants and Achilles tendinopathy", journal: "Br J Sports Med", year: 2009 },
  ],
};

const recoverySpeed: TraitDefinition = {
  id: "recovery-speed",
  name: "Exercise Recovery",
  subtitle: "Inflammation and recovery rate",
  category: "sports",
  gene: "IL6",
  rsids: ["rs1800795"],
  variants: [
    { genotype: "GG", label: "Fast Recovery", description: "Higher baseline IL-6 production. Faster inflammatory response and recovery from exercise-induced muscle damage.", color: "green" },
    { genotype: "GC", label: "Average Recovery", description: "Moderate inflammatory response. Standard recovery times.", color: "blue" },
    { genotype: "CC", label: "Slower Recovery", description: "Lower IL-6 production. May need more rest days between intense workouts.", color: "yellow" },
  ],
  description: "IL-6 is a cytokine involved in the acute phase inflammatory response to exercise. It plays a dual role: promoting inflammation for repair and anti-inflammatory effects during recovery.",
  tips: [
    "Slower recovery: Allow 48-72 hours between training the same muscle group",
    "Prioritize sleep quality — most recovery happens during deep sleep",
    "Tart cherry juice and omega-3s may help reduce exercise-induced inflammation",
  ],
  studies: [
    { pmid: "16474177", title: "IL-6 genotype and exercise-induced muscle damage", journal: "J Appl Physiol", year: 2006 },
  ],
};

// ─── SLEEP ───────────────────────────────────────────────────────────

const morningPerson: TraitDefinition = {
  id: "chronotype",
  name: "Chronotype",
  subtitle: "Morning lark vs night owl",
  category: "sleep",
  gene: "PER2",
  rsids: ["rs516134"],
  variants: [
    { genotype: "TT", label: "Early Bird", description: "Strong morning preference. Your circadian clock runs slightly fast. Peak alertness in the morning.", color: "green" },
    { genotype: "CT", label: "Intermediate", description: "Flexible chronotype. Can adapt to both early and late schedules reasonably well.", color: "blue" },
    { genotype: "CC", label: "Night Owl", description: "Evening preference. Your circadian clock runs slightly slow. Peak alertness comes later in the day.", color: "purple" },
  ],
  description: "PER2 is a core circadian clock gene that influences your internal body clock timing. Variants affect when your body naturally wants to wake up and go to sleep.",
  funFact: "Night owls aren't lazy — their circadian clock is literally set differently! Forcing a night owl to wake at 5am is like making a morning lark stay up until 3am.",
  tips: [
    "Work with your chronotype, not against it, when possible",
    "Night owls: Morning bright light exposure can help shift your clock earlier",
    "Early birds: Avoid bright screens in the evening to maintain your natural rhythm",
    "Both: Consistent sleep/wake times matter more than total sleep hours",
  ],
  studies: [
    { pmid: "19150996", title: "Genome-wide association of sleep and circadian phenotypes", journal: "BMC Med Genet", year: 2009 },
  ],
};

const sleepDepth: TraitDefinition = {
  id: "sleep-depth",
  name: "Sleep Depth",
  subtitle: "How deeply you sleep",
  category: "sleep",
  gene: "ADA",
  rsids: ["rs73598374"],
  variants: [
    { genotype: "CC", label: "Deeper Sleeper", description: "Higher adenosine deaminase activity. Faster adenosine buildup during waking hours leads to deeper, more restorative sleep.", color: "green" },
    { genotype: "CT", label: "Moderate", description: "Intermediate adenosine metabolism. Average sleep depth.", color: "blue" },
    { genotype: "TT", label: "Light Sleeper", description: "Slower adenosine buildup. May have lighter sleep and need more sleep hours to feel rested.", color: "yellow" },
  ],
  description: "Adenosine deaminase (ADA) breaks down adenosine, the molecule that builds 'sleep pressure' during the day. Faster breakdown means more intense sleep drive when you finally go to bed.",
  tips: [
    "Light sleepers: Optimize sleep environment (dark, cool, quiet)",
    "Consider a white noise machine if you wake easily",
    "Avoid caffeine after noon (it blocks adenosine receptors)",
    "Consistent bedtime helps establish stronger sleep pressure cycles",
  ],
  studies: [
    { pmid: "15930159", title: "Adenosine deaminase polymorphism and sleep", journal: "J Sleep Res", year: 2005 },
  ],
};

const sleepDuration: TraitDefinition = {
  id: "sleep-duration",
  name: "Natural Sleep Duration",
  subtitle: "How much sleep you need",
  category: "sleep",
  gene: "DEC2/BHLHE41",
  rsids: ["rs121912617"],
  variants: [
    { genotype: "AA", label: "Short Sleeper", description: "Rare variant associated with naturally needing less sleep (6 hours or less) without negative effects. The 'Thatcher gene.'", color: "purple" },
    { genotype: "AG", label: "Slightly Shorter", description: "One copy of the short-sleep variant. May function well on slightly less than 8 hours.", color: "blue" },
    { genotype: "GG", label: "Standard", description: "Typical sleep needs. Most people with this genotype need 7-9 hours for optimal function.", color: "green" },
  ],
  description: "DEC2 (BHLHE41) is a transcription factor that regulates circadian rhythm genes. A rare mutation allows some people to genuinely need less sleep without cognitive impairment.",
  funFact: "True short sleepers are extremely rare (<1% of the population). Most people who think they're short sleepers are actually sleep-deprived!",
  tips: [
    "If GG: Prioritize getting 7-9 hours — no supplement replaces sleep",
    "Don't try to train yourself to need less sleep — it doesn't work for most genotypes",
    "Quality matters as much as quantity — minimize disruptions",
  ],
  studies: [
    { pmid: "19574949", title: "The transcriptional repressor DEC2 regulates sleep length in mammals", journal: "Science", year: 2009 },
  ],
};

const caffeineAndSleep: TraitDefinition = {
  id: "caffeine-sleep",
  name: "Caffeine Sleep Sensitivity",
  subtitle: "Adenosine receptor sensitivity",
  category: "sleep",
  gene: "ADORA2A",
  rsids: ["rs5751876"],
  variants: [
    { genotype: "CC", label: "Caffeine Resistant", description: "Less sensitive to caffeine's sleep-disrupting effects. Can drink coffee later in the day with less impact.", color: "green" },
    { genotype: "CT", label: "Moderate Sensitivity", description: "Average sensitivity. Caffeine after early afternoon may affect sleep.", color: "blue" },
    { genotype: "TT", label: "Highly Sensitive", description: "Very sensitive to caffeine's effects on sleep. Even morning coffee may reduce deep sleep quality.", color: "red" },
  ],
  description: "ADORA2A encodes the A2a adenosine receptor, one of the main targets of caffeine in the brain. Variants affect how strongly caffeine blocks your sleep drive signal.",
  tips: [
    "TT: Limit caffeine to before 10am, or consider switching to half-caf",
    "Even CC types should avoid caffeine within 6 hours of bedtime",
    "Decaf still contains some caffeine — true zero-caffeine options: herbal tea, water",
  ],
  studies: [
    { pmid: "22174352", title: "ADORA2A and caffeine-induced sleep disturbance", journal: "Neuropsychopharmacology", year: 2012 },
  ],
};

// ─── LONGEVITY ───────────────────────────────────────────────────────

const foxo3: TraitDefinition = {
  id: "foxo3-longevity",
  name: "Longevity Gene",
  subtitle: "FOXO3 and cellular protection",
  category: "longevity",
  gene: "FOXO3",
  rsids: ["rs2802292"],
  variants: [
    { genotype: "TT", label: "Longevity Variant", description: "Associated with significantly increased lifespan in multiple populations. Enhanced cellular stress resistance, autophagy, and stem cell maintenance.", color: "green" },
    { genotype: "GT", label: "One Copy", description: "One longevity-associated allele. Some benefit to cellular protection pathways.", color: "blue" },
    { genotype: "GG", label: "Typical", description: "Standard FOXO3 activity. Lifestyle factors play an even bigger role for longevity.", color: "gray" },
  ],
  description: "FOXO3 is a master regulator of genes involved in cellular stress resistance, autophagy (cellular cleanup), metabolism, and immunity. It's one of the most consistently replicated longevity-associated genes across ethnicities.",
  funFact: "FOXO3 is the only human longevity gene that has been replicated in virtually every population studied — Japanese, German, Chinese, Italian, American, and more.",
  tips: [
    "Regardless of genotype, you can activate FOXO3 through lifestyle:",
    "Caloric restriction / intermittent fasting activates FOXO3",
    "Regular exercise strongly upregulates FOXO3 activity",
    "Green tea polyphenols and resveratrol may support FOXO3 pathways",
  ],
  studies: [
    { pmid: "18765803", title: "FOXO3A genotype is strongly associated with human longevity", journal: "PNAS", year: 2008 },
    { pmid: "24349080", title: "FOXO3 longevity interactome", journal: "Aging Cell", year: 2014 },
  ],
};

const telomerase: TraitDefinition = {
  id: "telomere-length",
  name: "Telomere Maintenance",
  subtitle: "Cellular aging rate",
  category: "longevity",
  gene: "TERT",
  rsids: ["rs2736100"],
  variants: [
    { genotype: "CC", label: "Longer Telomeres", description: "Associated with longer telomere length and potentially slower cellular aging.", color: "green" },
    { genotype: "AC", label: "Average", description: "Intermediate telomere length maintenance.", color: "blue" },
    { genotype: "AA", label: "Shorter Telomeres", description: "Associated with shorter telomere length. Lifestyle factors become even more important for cellular health.", color: "yellow" },
  ],
  description: "TERT encodes the catalytic subunit of telomerase, the enzyme that maintains telomere length. Telomeres are protective caps on chromosomes that shorten with each cell division — a molecular clock of aging.",
  funFact: "Elizabeth Blackburn won the 2009 Nobel Prize for discovering telomerase. Chronic stress has been shown to accelerate telomere shortening by up to 10 years of additional aging.",
  tips: [
    "Exercise is the strongest known telomere-preserving activity",
    "Chronic psychological stress accelerates telomere shortening",
    "Meditation has been shown to increase telomerase activity",
    "Adequate sleep helps maintain telomere length",
  ],
  studies: [
    { pmid: "19412176", title: "TERT variants and telomere length", journal: "Nat Genet", year: 2009 },
  ],
};

const sirtuin: TraitDefinition = {
  id: "sirt1-aging",
  name: "SIRT1 Metabolic Health",
  subtitle: "NAD+ dependent deacetylase",
  category: "longevity",
  gene: "SIRT1",
  rsids: ["rs7895833"],
  variants: [
    { genotype: "AA", label: "Enhanced SIRT1", description: "Associated with higher SIRT1 expression. Better metabolic health, insulin sensitivity, and cellular stress response.", color: "green" },
    { genotype: "AG", label: "Moderate", description: "Intermediate SIRT1 activity. Standard metabolic regulation.", color: "blue" },
    { genotype: "GG", label: "Typical", description: "Standard SIRT1 expression. NAD+ support and lifestyle factors can help optimize.", color: "gray" },
  ],
  description: "SIRT1 is a longevity-associated protein activated by caloric restriction and NAD+. It regulates metabolism, DNA repair, inflammation, and cellular aging across multiple organ systems.",
  tips: [
    "Intermittent fasting directly activates SIRT1",
    "NAD+ precursors (NMN, NR) may support SIRT1 activity",
    "Resveratrol is a well-studied SIRT1 activator",
    "Regular exercise increases SIRT1 expression",
  ],
  studies: [
    { pmid: "22882745", title: "SIRT1 polymorphisms and longevity", journal: "Age", year: 2013 },
  ],
};

const klotho: TraitDefinition = {
  id: "klotho-aging",
  name: "Klotho Anti-Aging",
  subtitle: "Cognitive and physical aging",
  category: "longevity",
  gene: "KL",
  rsids: ["rs9536314"],
  variants: [
    { genotype: "GT", label: "KL-VS Carrier", description: "One copy of the KL-VS variant. Associated with higher Klotho levels, better cognition, and greater longevity. The 'sweet spot.'", color: "green" },
    { genotype: "GG", label: "Non-Carrier", description: "Standard Klotho levels. Normal aging trajectory.", color: "blue" },
    { genotype: "TT", label: "Homozygous", description: "Two copies. Paradoxically may not be beneficial — associated with reduced Klotho levels and shorter lifespan.", color: "yellow" },
  ],
  description: "Klotho is an anti-aging hormone that declines with age. The KL-VS variant increases circulating Klotho levels when present in one copy, protecting against cognitive decline and cardiovascular disease.",
  funFact: "Named after Clotho, one of the three Fates in Greek mythology who spun the thread of life. About 20% of people carry one copy of KL-VS.",
  tips: [
    "Exercise is the strongest known Klotho-boosting activity",
    "Vitamin D status affects Klotho expression — maintain adequate levels",
    "Reducing phosphate in diet may help preserve Klotho levels",
  ],
  studies: [
    { pmid: "25271523", title: "Klotho KL-VS heterozygosity is associated with lower risk of all-cause mortality", journal: "J Gerontol", year: 2015 },
  ],
};

// ─── EXTRA TRAITS ────────────────────────────────────────────────────

const sneezeSun: TraitDefinition = {
  id: "sun-sneezing",
  name: "Photic Sneeze Reflex",
  subtitle: "Sneezing from bright light",
  category: "physical",
  gene: "ZEB2",
  rsids: ["rs10427255"],
  variants: [
    { genotype: "CC", label: "Sun Sneezer", description: "Likely to sneeze when suddenly exposed to bright light. Known as ACHOO syndrome (Autosomal Compelling Helio-Ophthalmic Outburst).", color: "blue" },
    { genotype: "CT", label: "Possibly", description: "May experience occasional photic sneezing.", color: "green" },
    { genotype: "TT", label: "Not a Sun Sneezer", description: "Unlikely to experience sneezing triggered by bright light.", color: "gray" },
  ],
  description: "The photic sneeze reflex affects 18-35% of people. It's thought to involve crossed wiring between the optic nerve and the trigeminal nerve (which controls sneezing).",
  funFact: "This is officially called ACHOO syndrome — one of the best acronyms in medicine!",
  studies: [
    { pmid: "20585627", title: "Web-based genome-wide association study identifies photic sneeze variants", journal: "PLoS Genet", year: 2010 },
  ],
};

const painSensitivity: TraitDefinition = {
  id: "pain-sensitivity",
  name: "Pain Sensitivity",
  subtitle: "Opioid receptor sensitivity",
  category: "health",
  gene: "OPRM1",
  rsids: ["rs1799971"],
  variants: [
    { genotype: "AA", label: "Typical", description: "Standard opioid receptor function. Normal pain sensitivity.", color: "green" },
    { genotype: "AG", label: "Increased Sensitivity", description: "May experience more pain from the same stimulus. May also need higher doses of opioid pain medications.", color: "yellow" },
    { genotype: "GG", label: "Higher Sensitivity", description: "Increased pain sensitivity. Reduced response to opioid pain relief. May benefit from alternative pain management strategies.", color: "red" },
  ],
  description: "OPRM1 encodes the mu-opioid receptor, the primary target of endorphins and opioid pain medications. The A118G variant affects receptor binding and pain perception.",
  tips: [
    "Higher sensitivity: Discuss pain management options with your doctor before procedures",
    "Non-opioid alternatives (NSAIDs, nerve blocks, physical therapy) may be more effective",
    "Mindfulness and cognitive behavioral therapy can help with chronic pain",
  ],
  studies: [
    { pmid: "15608640", title: "OPRM1 A118G and pain sensitivity", journal: "J Pain", year: 2005 },
  ],
  disclaimer: "Pain is influenced by many factors beyond genetics. This is not a guide for medication dosing. Always follow your doctor's instructions.",
};

const muscleBuilding: TraitDefinition = {
  id: "muscle-building",
  name: "Muscle Building Response",
  subtitle: "Myostatin and muscle growth",
  category: "sports",
  gene: "MSTN",
  rsids: ["rs1805086"],
  variants: [
    { genotype: "AA", label: "Enhanced Growth", description: "Reduced myostatin activity. Greater potential for muscle hypertrophy with resistance training.", color: "green" },
    { genotype: "AG", label: "Moderate", description: "Slightly reduced myostatin inhibition. Good muscle building potential.", color: "blue" },
    { genotype: "GG", label: "Typical", description: "Normal myostatin levels. Standard muscle growth response to training.", color: "gray" },
  ],
  description: "Myostatin is a protein that limits muscle growth. Reduced myostatin activity allows for greater muscle hypertrophy. While rare mutations cause extreme muscle growth, common variants have more subtle effects.",
  funFact: "Belgian Blue cattle have a natural myostatin mutation that makes them incredibly muscular — the 'double-muscled' phenotype.",
  tips: [
    "Resistance training is the primary driver of muscle growth regardless of genotype",
    "Adequate protein intake (1.6-2.2g/kg) maximizes muscle protein synthesis",
    "Sleep and recovery are when muscle growth actually happens",
  ],
  studies: [
    { pmid: "15138717", title: "Myostatin and muscle mass regulation", journal: "Curr Opin Clin Nutr Metab Care", year: 2004 },
  ],
};

const vitaminC: TraitDefinition = {
  id: "vitamin-c",
  name: "Vitamin C Levels",
  subtitle: "Ascorbic acid transport",
  category: "nutrition",
  gene: "SLC23A1",
  rsids: ["rs33972313"],
  variants: [
    { genotype: "CC", label: "Normal Transport", description: "Efficient vitamin C absorption and transport. Standard dietary intake is usually sufficient.", color: "green" },
    { genotype: "CT", label: "Slightly Reduced", description: "Mildly reduced vitamin C transport. May benefit from slightly higher intake.", color: "yellow" },
    { genotype: "TT", label: "Reduced Transport", description: "Significantly reduced vitamin C absorption. Higher dietary intake or supplementation recommended.", color: "red" },
  ],
  description: "SLC23A1 encodes a sodium-dependent vitamin C transporter. Variants affect how efficiently your body absorbs and distributes vitamin C from food and supplements.",
  tips: [
    "If reduced transport: Eat more vitamin C-rich foods (citrus, bell peppers, strawberries, broccoli)",
    "Vitamin C is best absorbed in smaller frequent doses rather than one large dose",
    "Cooking destroys vitamin C — eat fruits and vegetables raw when possible",
  ],
  studies: [
    { pmid: "20519559", title: "SLC23A1 variants and vitamin C levels", journal: "Am J Clin Nutr", year: 2010 },
  ],
};

const omega3: TraitDefinition = {
  id: "omega3-metabolism",
  name: "Omega-3 Metabolism",
  subtitle: "Fatty acid desaturase activity",
  category: "nutrition",
  gene: "FADS1",
  rsids: ["rs174547"],
  variants: [
    { genotype: "TT", label: "Efficient Converter", description: "Higher FADS1 activity. Better at converting plant-based ALA to EPA/DHA. Vegetarian omega-3 sources may be sufficient.", color: "green" },
    { genotype: "CT", label: "Moderate", description: "Intermediate conversion ability. May benefit from some direct EPA/DHA sources.", color: "blue" },
    { genotype: "CC", label: "Poor Converter", description: "Lower FADS1 activity. Less efficient at converting ALA to usable EPA/DHA. Direct sources (fish oil, algae) recommended.", color: "yellow" },
  ],
  description: "FADS1 encodes fatty acid desaturase, which converts plant-based omega-3 (ALA) to the active forms (EPA/DHA) used by your brain and body.",
  funFact: "This variant has been under strong evolutionary selection in different populations based on traditional diets — meat-heavy vs plant-heavy.",
  tips: [
    "Poor converters: Prioritize fatty fish (salmon, sardines) or algae-based DHA supplements",
    "Flaxseed and walnuts provide ALA but conversion to DHA is limited for CC genotype",
    "Aim for 250-500mg combined EPA/DHA daily from direct sources",
  ],
  studies: [
    { pmid: "21829377", title: "FADS gene cluster and omega-3 metabolism", journal: "Curr Opin Lipidol", year: 2011 },
  ],
};

// ─── AGGREGATE ───────────────────────────────────────────────────────

export const ALL_TRAITS: TraitDefinition[] = [
  // Personality
  comtWarriorWorrier, serotoninTransporter, oxytocin, riskTaking, resilience,
  // Health
  mthfr, apoe, alcoholFlush, celiacRisk, vitaminD, painSensitivity,
  // Physical
  eyeColor, earwax, hairThickness, freckling, unibrow, sneezeSun,
  // Nutrition
  caffeine, lactose, bitterTaste, cilantro, aspirinResponse, vitaminC, omega3,
  // Intelligence
  bdnfMemory, drd2Focus, kibra,
  // Sports
  actn3Sprinter, vo2max, injuryRisk, recoverySpeed, muscleBuilding,
  // Sleep
  morningPerson, sleepDepth, sleepDuration, caffeineAndSleep,
  // Longevity
  foxo3, telomerase, sirtuin, klotho,
];

// Lookup maps
export const TRAIT_BY_ID = new Map<string, TraitDefinition>(
  ALL_TRAITS.map((t) => [t.id, t])
);

export const ALL_REQUIRED_RSIDS: Set<string> = new Set(
  ALL_TRAITS.flatMap((t) => t.rsids)
);

export const RSID_TO_TRAITS: Map<string, TraitDefinition[]> = (() => {
  const map = new Map<string, TraitDefinition[]>();
  for (const trait of ALL_TRAITS) {
    for (const rsid of trait.rsids) {
      const existing = map.get(rsid) || [];
      existing.push(trait);
      map.set(rsid, existing);
    }
  }
  return map;
})();
