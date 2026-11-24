import type { Reading, Trait } from "./types";

const r = (genotype: string, label: string, text: string, tone: Reading["tone"]): Reading => ({ genotype, label, text, tone });
const count = (g: string, allele: string) => [...g].filter((b) => b === allele).length;

const ARRAY = "Consumer arrays can be wrong at a single site. Anything that would change your care needs a clinical test first.";

// Heart and lipids

/** rs429358 C and rs7412 T never sit on the same copy in practice, so counts give the pair. */
const APOE: Record<string, Reading> = {
  "0,2": r("ε2/ε2", "Two ε2 copies", "Usually lower LDL. In a minority, mostly with other causes present, it leads to a build-up of remnant particles that raises both cholesterol and triglycerides.", "notable"),
  "0,1": r("ε2/ε3", "One ε2 copy", "LDL tends to run lower than average.", "differs"),
  "0,0": r("ε3/ε3", "Two ε3 copies", "The most common result, and the reference for the others.", "typical"),
  "1,1": r("ε2/ε4", "One ε2 and one ε4 copy", "The two versions pull LDL in opposite directions.", "differs"),
  "1,0": r("ε3/ε4", "One ε4 copy", "LDL tends to run a little higher. ε4 is also linked with a higher chance of late-onset Alzheimer disease. Most people with one copy do not develop it.", "notable"),
  "2,0": r("ε4/ε4", "Two ε4 copies", "LDL tends to run higher. Two copies carry a clearly higher chance of late-onset Alzheimer disease. It is not certain, and a genetic counselor can put it in context.", "notable"),
};

const apoe: Trait = {
  id: "apoe", name: "Apolipoprotein E", gene: "APOE", group: "lipids", rsids: ["rs429358", "rs7412"], evidence: 3,
  about: "APOE makes a protein that carries fat and cholesterol in blood and brain. Two markers together define the ε2, ε3 and ε4 versions.",
  limits: `The link with coronary disease is modest, and APOE does not diagnose Alzheimer disease. ${ARRAY}`,
  read: (get) => {
    const a = get("rs429358"), b = get("rs7412");
    return a && b ? APOE[`${count(a, "C")},${count(b, "T")}`] ?? null : null;
  },
  outcomes: Object.values(APOE),
  labs: ["ldl", "apob", "nonhdl", "triglycerides"],
  sensitive: "APOE also relates to Alzheimer disease risk. Some people would rather not know, and you cannot un-know it.",
  pmids: ["17878422", "9343467"],
};

const sort1: Trait = {
  id: "sort1-ldl", name: "LDL at the SORT1 locus", gene: "SORT1", group: "lipids", rsids: ["rs646776"], evidence: 3,
  about: "This part of chromosome 1 changes how much sortilin the liver makes, which changes how much LDL reaches the blood.",
  limits: "It is one of hundreds of markers that move LDL. Your measured LDL says far more than this does.",
  table: {
    CC: { label: "Lower LDL tendency", text: "Two copies of the version linked with lower LDL.", tone: "differs" },
    CT: { label: "Slightly lower LDL tendency", text: "One copy of the version linked with lower LDL.", tone: "differs" },
    TT: { label: "Common result", text: "The most common result. Neither copy lowers LDL here.", tone: "typical" },
  },
  labs: ["ldl", "apob", "nonhdl"], pmids: ["20686566"],
};

const pcsk9: Trait = {
  id: "pcsk9-r46l", name: "PCSK9 R46L", gene: "PCSK9", group: "lipids", rsids: ["rs11591147"], evidence: 3,
  about: "PCSK9 tells liver cells to remove their LDL receptors. The uncommon T version weakens that signal, so more LDL is cleared.",
  limits: "Having the common result is ordinary. It is not a risk finding.",
  table: {
    GG: { label: "Common result", text: "The usual PCSK9 at this site.", tone: "typical" },
    GT: { label: "Lower LDL tendency", text: "One copy of R46L, linked with lower lifelong LDL and less coronary disease.", tone: "differs" },
    TT: { label: "Lower LDL tendency", text: "Two copies of R46L, which is rare and linked with lower LDL.", tone: "differs" },
  },
  labs: ["ldl", "apob", "nonhdl"], pmids: ["16554528"],
};

const lpa: Trait = {
  id: "lpa", name: "Lipoprotein(a)", gene: "LPA", group: "lipids", rsids: ["rs10455872"], evidence: 3,
  about: "Lp(a) is an LDL-like particle whose level is set mostly by genes and barely moves with diet. The G version goes with higher Lp(a) and more coronary disease.",
  limits: "Many people with high Lp(a) carry neither copy of this marker. Only a blood test answers the question.",
  table: {
    AA: { label: "No copies", text: "You do not carry this marker. Lp(a) can still be high for other reasons.", tone: "typical" },
    AG: { label: "One copy", text: "Linked with higher Lp(a). A one-time Lp(a) blood test would settle it.", tone: "notable" },
    GG: { label: "Two copies", text: "Linked with clearly higher Lp(a). A one-time Lp(a) blood test would settle it.", tone: "notable" },
  },
  labs: ["lpa_nmol", "lpa_mg"], pmids: ["20032323"],
};

const apoa5: Trait = {
  id: "apoa5", name: "Triglycerides at APOA5", gene: "APOA5", group: "lipids", rsids: ["rs662799"], evidence: 3,
  about: "Apolipoprotein A-V helps clear triglycerides after meals. The G version goes with higher triglycerides.",
  limits: "Food, alcohol, weight, blood sugar and medicines move triglycerides more than this marker does.",
  table: {
    AA: { label: "Common result", text: "No copies of the version linked with higher triglycerides.", tone: "typical" },
    AG: { label: "Higher triglyceride tendency", text: "One copy of the version linked with higher triglycerides.", tone: "notable" },
    GG: { label: "Higher triglyceride tendency", text: "Two copies of the version linked with higher triglycerides.", tone: "notable" },
  },
  labs: ["triglycerides"], pmids: ["11588264"],
};

// Blood sugar

const gckr: Trait = {
  id: "gckr", name: "Glucokinase regulator", gene: "GCKR", group: "glucose", rsids: ["rs1260326"], evidence: 3,
  about: "GCKR sets how readily the liver takes up glucose. The T version goes with slightly lower fasting glucose and slightly higher triglycerides.",
  limits: "The two effects are small and run in opposite directions.",
  table: {
    CC: { label: "No T copies", text: "Neither effect applies.", tone: "typical" },
    CT: { label: "One T copy", text: "Slightly lower fasting glucose and slightly higher triglycerides, on average.", tone: "differs" },
    TT: { label: "Two T copies", text: "Lower fasting glucose and higher triglycerides, on average.", tone: "differs" },
  },
  labs: ["triglycerides", "glucose"], pmids: ["18556336", "18678614"],
};

const tcf7l2: Trait = {
  id: "tcf7l2", name: "Type 2 diabetes at TCF7L2", gene: "TCF7L2", group: "glucose", rsids: ["rs7903146"], evidence: 3,
  about: "TCF7L2 is the strongest common marker for type 2 diabetes. The T version goes with less insulin released after meals.",
  limits: "In the Diabetes Prevention Program, lifestyle change lowered progression in every genotype. This is one factor among many.",
  table: {
    CC: { label: "Common result", text: "No copies of the risk version.", tone: "typical" },
    CT: { label: "One risk copy", text: "A moderately higher chance of type 2 diabetes than average.", tone: "notable" },
    TT: { label: "Two risk copies", text: "A higher chance of type 2 diabetes than average.", tone: "notable" },
  },
  labs: ["hba1c", "glucose"], pmids: ["16415884", "16855264"],
};

// Iron

const HFE = {
  hom: r("C282Y/C282Y", "Two C282Y copies", "The genotype behind most hereditary hemochromatosis. Many people with it have raised iron, and a smaller share develop illness. Ferritin and transferrin saturation show whether iron is building up.", "notable"),
  comp: r("C282Y/H63D", "One C282Y and one H63D", "Iron can run somewhat high. Illness from iron alone is uncommon.", "notable"),
  carrier: r("C282Y carrier", "One C282Y copy", "A carrier. Iron overload from this alone is not expected.", "differs"),
  h63hom: r("H63D/H63D", "Two H63D copies", "Iron may run slightly high. Illness from this alone is uncommon.", "differs"),
  h63: r("H63D carrier", "One H63D copy", "Common, with little effect on iron.", "typical"),
  none: r("Neither", "No HFE copies found", "Neither of the two common HFE versions was found.", "typical"),
};
const hfe: Trait = {
  id: "hfe", name: "Hereditary hemochromatosis", gene: "HFE", group: "iron", rsids: ["rs1800562", "rs1799945"], evidence: 3,
  about: "HFE helps the body sense how much iron it has. Two versions, C282Y and H63D, can let too much in.",
  limits: `In a study that followed people with two C282Y copies, illness from iron was documented in about 28% of men and 1% of women. ${ARRAY}`,
  read: (get) => {
    const a = get("rs1800562"), b = get("rs1799945");
    if (!a || !b) return null;
    const y = count(a, "A"), h = count(b, "G");
    if (y === 2) return HFE.hom;
    if (y === 1) return h >= 1 ? HFE.comp : HFE.carrier;
    return h === 2 ? HFE.h63hom : h === 1 ? HFE.h63 : HFE.none;
  },
  outcomes: Object.values(HFE),
  labs: ["ferritin", "tsat", "iron"], pmids: ["18199861", "8696333"],
};

// Vitamins and fats

const MTHFR = {
  tt: r("677 TT", "Two C677T copies", "The enzyme works less well when warm and homocysteine can run higher, mainly when folate is low.", "notable"),
  both: r("677 CT, 1298 AC", "One copy of each", "A common combination. Homocysteine is usually normal.", "differs"),
  ct: r("677 CT", "One C677T copy", "Very common, with little effect by itself.", "typical"),
  cc: r("1298 CC", "Two A1298C copies", "Little measurable effect on homocysteine.", "typical"),
  ac: r("1298 AC", "One A1298C copy", "Very common, with no meaningful effect by itself.", "typical"),
  none: r("Neither", "Neither common version", "Neither C677T nor A1298C was found.", "typical"),
};
const mthfr: Trait = {
  id: "mthfr", name: "MTHFR and folate", gene: "MTHFR", group: "vitamins", rsids: ["rs1801133", "rs1801131"], evidence: 3,
  about: "MTHFR makes the form of folate that keeps homocysteine low. Two common versions, C677T and A1298C, slow it to different degrees.",
  limits: "The American College of Medical Genetics recommends against routine MTHFR testing. The CDC says people with these versions can process every type of folate, including folic acid, and that folic acid is the only type shown to help prevent neural tube defects.",
  read: (get) => {
    const a = get("rs1801133"), b = get("rs1801131");
    if (!a || !b) return null;
    const t = count(a, "A"), c = count(b, "G");
    if (t === 2) return MTHFR.tt;
    if (t === 1) return c >= 1 ? MTHFR.both : MTHFR.ct;
    return c === 2 ? MTHFR.cc : c === 1 ? MTHFR.ac : MTHFR.none;
  },
  outcomes: Object.values(MTHFR),
  labs: ["homocysteine", "folate", "b12"], pmids: ["7647779", "23288205", "14608052"],
};

const fut2: Trait = {
  id: "fut2-b12", name: "B12 and secretor status", gene: "FUT2", group: "vitamins", rsids: ["rs601338"], evidence: 2,
  about: "FUT2 decides whether blood-group sugars appear in the gut and saliva. People with two A copies, called non-secretors, tend to show higher B12 in blood.",
  limits: "B12 in blood is an imperfect guide to B12 in cells. Methylmalonic acid is the usual tie-breaker.",
  table: {
    AA: { label: "Non-secretor", text: "B12 in blood tends to read higher.", tone: "differs" },
    AG: { label: "Secretor", text: "The most common kind of result.", tone: "typical" },
    GG: { label: "Secretor", text: "B12 in blood tends to read a little lower than in non-secretors.", tone: "typical" },
  },
  labs: ["b12"], pmids: ["18776911"],
};

const gc: Trait = {
  id: "vitamin-d", name: "Vitamin D binding protein", gene: "GC", group: "vitamins", rsids: ["rs2282679"], evidence: 3,
  about: "This protein carries vitamin D in blood. The G version goes with lower measured 25-hydroxyvitamin D.",
  limits: "Sun, skin tone, season, weight and diet matter more. The marker cannot tell you your level.",
  table: {
    TT: { label: "Common result", text: "No copies of the version linked with lower vitamin D.", tone: "typical" },
    GT: { label: "Somewhat lower tendency", text: "One copy of the version linked with lower vitamin D.", tone: "differs" },
    GG: { label: "Lower tendency", text: "Two copies of the version linked with lower vitamin D.", tone: "notable" },
  },
  labs: ["vitd"], pmids: ["20541252"],
};

const slc23a1: Trait = {
  id: "vitamin-c", name: "Vitamin C transport", gene: "SLC23A1", group: "vitamins", rsids: ["rs33972313"], evidence: 2,
  about: "SLC23A1 moves vitamin C into the body. Each T copy went with about 6 µmol/L less vitamin C in blood.",
  limits: "Diet moves vitamin C far more than this.",
  table: {
    CC: { label: "Common result", text: "The usual transporter.", tone: "typical" },
    CT: { label: "Slightly lower tendency", text: "One copy of the version linked with lower vitamin C.", tone: "differs" },
    TT: { label: "Lower tendency", text: "Two copies, which is rare.", tone: "differs" },
  },
  pmids: ["20519558"],
};

const fads1: Trait = {
  id: "omega3-metabolism", name: "Omega-3 conversion", gene: "FADS1", group: "vitamins", rsids: ["rs174547"], evidence: 3,
  about: "FADS1 turns plant fats into the longer omega-3 and omega-6 fats. The C version does this less.",
  limits: "It does not show your omega-3 level, and eating fish bypasses the step.",
  table: {
    TT: { label: "More conversion", text: "Plant omega-3 is converted at the higher rate.", tone: "typical" },
    CT: { label: "In between", text: "One copy of the slower version.", tone: "differs" },
    CC: { label: "Less conversion", text: "Two copies of the slower version. Blood EPA tends to be lower.", tone: "differs" },
  },
  labs: ["omega3"], pmids: ["21829377"],
};

// Liver, kidney, inflammation

const ugt1a1: Trait = {
  id: "gilbert", name: "Gilbert syndrome", gene: "UGT1A1", group: "organs", rsids: ["rs887829"], evidence: 3,
  about: "UGT1A1 clears bilirubin. The T version travels with a change that slows it, the usual cause of Gilbert syndrome.",
  limits: "This marker stands in for the *28 change and does not read it directly. UGT1A1 also affects how a few medicines are cleared, which needs a clinical test.",
  table: {
    CC: { label: "Usual clearance", text: "No copies of the slower version.", tone: "typical" },
    CT: { label: "One slower copy", text: "Bilirubin may run slightly higher.", tone: "differs" },
    TT: { label: "Two slower copies", text: "Fits the Gilbert pattern: bilirubin can read a little high, often after fasting or illness, without liver disease.", tone: "notable" },
  },
  labs: ["bilirubin", "alt", "ast"], pmids: ["7565971", "19414484"],
};

const abcg2: Trait = {
  id: "uric-acid", name: "Uric acid transport", gene: "ABCG2", group: "organs", rsids: ["rs2231142"], evidence: 3,
  about: "ABCG2 moves uric acid out of the body. The T version, Q141K, cuts transport by about half in cells and goes with higher uric acid and gout.",
  limits: "Kidney function, diet and medicines also set uric acid.",
  table: {
    GG: { label: "Common result", text: "The usual transporter.", tone: "typical" },
    GT: { label: "One Q141K copy", text: "Uric acid tends to run higher.", tone: "notable" },
    TT: { label: "Two Q141K copies", text: "Uric acid tends to run clearly higher.", tone: "notable" },
  },
  labs: ["uric", "creatinine"], pmids: ["19506252"],
};

const crp: Trait = {
  id: "crp-baseline", name: "C-reactive protein baseline", gene: "CRP", group: "organs", rsids: ["rs1205"], evidence: 2,
  about: "Markers in the CRP gene set a person's usual CRP level. The T version goes with a lower baseline.",
  limits: "A genetic baseline for CRP does not itself change heart risk, which was tested directly in large studies. A cold moves CRP far more.",
  table: {
    CC: { label: "Common result", text: "No copies of the lower-baseline version.", tone: "typical" },
    CT: { label: "Slightly lower baseline", text: "One copy of the lower-baseline version.", tone: "differs" },
    TT: { label: "Lower baseline", text: "Two copies of the lower-baseline version.", tone: "differs" },
  },
  labs: ["hscrp"], pmids: ["21325005"],
};

// Food and drink

const lactase: Trait = {
  id: "lactose-tolerance", name: "Lactase persistence", gene: "MCM6 / LCT", group: "food", rsids: ["rs4988235"], evidence: 3,
  about: "Most mammals stop making lactase after weaning. The A version, common in people with European ancestry, keeps lactase active.",
  limits: "Other versions do the same job in African and Middle Eastern populations, so GG does not settle it for everyone.",
  table: {
    AA: { label: "Lactase persists", text: "You likely digest milk sugar as an adult.", tone: "typical" },
    AG: { label: "Lactase persists", text: "One copy is usually enough to digest milk sugar.", tone: "typical" },
    GG: { label: "Lactase likely declines", text: "Lactase often falls after childhood. Many people still manage small amounts.", tone: "differs" },
  },
  pmids: ["11788828"],
};

const caffeine: Trait = {
  id: "caffeine-metabolism", name: "Caffeine metabolism", gene: "CYP1A2", group: "food", rsids: ["rs762551"], evidence: 2,
  about: "CYP1A2 breaks down caffeine in the liver. The A version responds more to things that switch the enzyme on.",
  limits: "In the original study the difference appeared only in smokers. Pregnancy, some medicines and smoking matter more.",
  table: {
    AA: { label: "Faster when induced", text: "Often called the fast result. The effect shows mainly in smokers.", tone: "typical" },
    AC: { label: "In between", text: "One copy of each version.", tone: "typical" },
    CC: { label: "Less inducible", text: "Often called the slow result. One study linked it with more heart attacks among heavy coffee drinkers.", tone: "differs" },
  },
  pmids: ["10233211", "16522833"],
};

const aldh2: Trait = {
  id: "alcohol-flush", name: "Alcohol flush", gene: "ALDH2", group: "food", rsids: ["rs671"], evidence: 3,
  about: "ALDH2 clears acetaldehyde, the toxic product of alcohol. The A version has very little activity and is common in East Asia.",
  limits: "A common result here says nothing about safe drinking.",
  table: {
    GG: { label: "Working enzyme", text: "Acetaldehyde is cleared in the usual way.", tone: "typical" },
    AG: { label: "Reduced enzyme", text: "Drinking often causes flushing. With regular drinking, esophageal cancer risk is clearly higher than in people with the working enzyme.", tone: "notable" },
    AA: { label: "Inactive enzyme", text: "Even a little alcohol usually causes a strong reaction.", tone: "notable" },
  },
  pmids: ["19320537"],
};

const celiac: Trait = {
  id: "celiac-risk", name: "Celiac susceptibility", gene: "HLA-DQ2.5", group: "food", rsids: ["rs2187668"], evidence: 3,
  about: "Nearly everyone with celiac disease carries HLA-DQ2 or DQ8. This marker stands in for DQ2.5, the most common type.",
  limits: "Most carriers never develop celiac disease. DQ8 and DQ2.2 are not read, so CC does not rule it out.",
  table: {
    CC: { label: "No DQ2.5 marker", text: "The main risk type was not found. Other types were not checked.", tone: "typical" },
    CT: { label: "One DQ2.5 copy", text: "Celiac disease is possible. If you have symptoms, ask about antibody testing before you cut out gluten.", tone: "notable" },
    TT: { label: "Two DQ2.5 copies", text: "A higher chance than one copy, and still not a diagnosis. Testing needs gluten in the diet.", tone: "notable" },
  },
  labs: ["ttg"], pmids: ["18509540"],
};

const TAS = {
  pav: r("PAV/PAV", "Strong bitter taster", "Broccoli, kale and black coffee may taste sharply bitter.", "typical"),
  het: r("PAV/AVI", "Medium bitter taster", "One sensitive and one insensitive version.", "typical"),
  avi: r("AVI/AVI", "Weak bitter taster", "The bitter compound PTC is probably faint or absent for you.", "differs"),
  mix: r("Mixed", "Less common combination", "Your three markers do not form the two usual versions.", "differs"),
};
const bitter: Trait = {
  id: "bitter-taste", name: "Bitter taste", gene: "TAS2R38", group: "food", rsids: ["rs713598", "rs1726866", "rs10246939"], evidence: 3,
  about: "TAS2R38 is a bitter taste receptor. Three markers usually travel together as a taster version, PAV, and a non-taster version, AVI.",
  limits: "It covers one family of bitter compounds. Liking a food is a different thing.",
  read: (get) => {
    const g = [get("rs713598"), get("rs1726866"), get("rs10246939")];
    if (g.some((x) => !x)) return null;
    const [a, b, c] = [count(g[0]!, "G"), count(g[1]!, "G"), count(g[2]!, "C")];
    if (a !== b || b !== c) return TAS.mix;
    return a === 2 ? TAS.pav : a === 1 ? TAS.het : TAS.avi;
  },
  outcomes: Object.values(TAS),
  pmids: ["12595690", "15723792"],
};

const cilantro: Trait = {
  id: "cilantro-taste", name: "Cilantro", gene: "near OR6A2", group: "food", rsids: ["rs72921001"], evidence: 1,
  about: "A marker beside a cluster of smell receptors has a small effect on whether cilantro tastes of soap.",
  limits: "The effect is small. Most people with any result do not taste soap.",
  table: {
    CC: { label: "Soapy taste slightly more likely", text: "Neither copy is the version that makes soapiness less likely.", tone: "typical" },
    AC: { label: "In between", text: "One copy of the version that makes soapiness less likely.", tone: "typical" },
    AA: { label: "Soapy taste slightly less likely", text: "Two copies of the version that makes soapiness less likely.", tone: "differs" },
  },
  pmids: [],
  dois: [{ doi: "10.1186/2044-7248-1-22", title: "A genetic variant near olfactory receptor genes influences cilantro preference", journal: "Flavour", year: 2012 }],
};

// Body

const eye: Trait = {
  id: "eye-color", name: "Eye color", gene: "HERC2 / OCA2", group: "body", rsids: ["rs12913832"], evidence: 3,
  about: "This site controls OCA2, which sets how much pigment the iris makes.",
  limits: "Other genes adjust the shade.",
  table: {
    GG: { label: "Blue likely", text: "Little pigment in the iris.", tone: "differs" },
    AG: { label: "Brown, hazel or green", text: "In between.", tone: "differs" },
    AA: { label: "Brown likely", text: "Full pigment in the iris.", tone: "typical" },
  },
  pmids: ["18252222", "18172690"],
};

const mc1r: Trait = {
  id: "freckling", name: "Red hair and sun sensitivity", gene: "MC1R", group: "body", rsids: ["rs1805007"], evidence: 3,
  about: "MC1R decides which pigment skin and hair make. The T version, R151C, makes more red pigment and is linked with fair skin.",
  limits: "Several other MC1R versions do the same and are not read here.",
  table: {
    CC: { label: "No R151C copies", text: "Other MC1R versions may still apply.", tone: "typical" },
    CT: { label: "One R151C copy", text: "Fairer skin and freckles are more likely.", tone: "differs" },
    TT: { label: "Two R151C copies", text: "Red hair and skin that burns are likely. Sun protection matters more.", tone: "notable" },
  },
  pmids: ["7581459"],
};

const edar: Trait = {
  id: "hair-thickness", name: "Hair thickness", gene: "EDAR", group: "body", rsids: ["rs3827760"], evidence: 3,
  about: "The G version, V370A, arose in East Asia around 30,000 years ago and goes with thicker hair and more sweat glands.",
  limits: "Hair texture has many other causes.",
  table: {
    AA: { label: "No V370A copies", text: "The result most common outside East Asia and the Americas.", tone: "typical" },
    AG: { label: "One V370A copy", text: "Hair tends to be thicker.", tone: "differs" },
    GG: { label: "Two V370A copies", text: "Hair tends to be thick and straight.", tone: "differs" },
  },
  pmids: ["23415220"],
};

const earwax: Trait = {
  id: "earwax-type", name: "Earwax", gene: "ABCC11", group: "body", rsids: ["rs17822931"], evidence: 3,
  about: "A single letter decides whether earwax is wet or dry. The same gene affects body odor.",
  limits: "Nothing about your health follows from this.",
  table: {
    CC: { label: "Wet", text: "Wet earwax.", tone: "typical" },
    CT: { label: "Wet", text: "Wet earwax. The wet version is dominant.", tone: "typical" },
    TT: { label: "Dry", text: "Dry earwax, and usually less body odor.", tone: "differs" },
  },
  pmids: ["16444273"],
};

const actn3: Trait = {
  id: "actn3-sprinter", name: "Fast-twitch muscle protein", gene: "ACTN3", group: "body", rsids: ["rs1815739"], evidence: 2,
  about: "ACTN3 makes a protein found only in fast muscle fibers. Two T copies mean none is made. Elite sprinters rarely have that result.",
  limits: "It says nothing about how good you can get at a sport.",
  table: {
    CC: { label: "Protein made", text: "Both copies make the protein.", tone: "typical" },
    CT: { label: "Protein made", text: "One copy makes the protein.", tone: "typical" },
    TT: { label: "Protein absent", text: "Common and healthy. Muscle works normally in daily life.", tone: "differs" },
  },
  pmids: ["12879365"],
};

// Sleep and mind

const ada: Trait = {
  id: "sleep-depth", name: "Deep sleep", gene: "ADA", group: "mind", rsids: ["rs73598374"], evidence: 1,
  about: "Adenosine builds sleep pressure through the day and ADA clears it. The T version clears it more slowly. In a small sleep-lab study, carriers had more deep sleep.",
  limits: "The study was small.",
  table: {
    CC: { label: "Common result", text: "The usual enzyme.", tone: "typical" },
    CT: { label: "More deep sleep in one study", text: "One copy of the slower version.", tone: "differs" },
    TT: { label: "Rare", text: "Two copies are too rare to have been studied well.", tone: "differs" },
  },
  pmids: ["16221767"],
};

const comt: Trait = {
  id: "comt-warrior-worrier", name: "COMT Val158Met", gene: "COMT", group: "mind", rsids: ["rs4680"], evidence: 1,
  about: "COMT breaks down dopamine. The A version, Met, makes a less active enzyme.",
  limits: "The enzyme difference is solid. Claims about personality, such as warrior or worrier, have not held up well.",
  table: {
    GG: { label: "Val/Val", text: "The more active enzyme.", tone: "typical" },
    AG: { label: "Val/Met", text: "In between.", tone: "typical" },
    AA: { label: "Met/Met", text: "The less active enzyme.", tone: "differs" },
  },
  pmids: ["15457404"],
};

const bdnf: Trait = {
  id: "bdnf-memory", name: "BDNF Val66Met", gene: "BDNF", group: "mind", rsids: ["rs6265"], evidence: 1,
  about: "BDNF helps neurons grow. The T version, Met, changes how it is released in cells.",
  limits: "Memory differences between people with each result are small and inconsistent.",
  table: {
    CC: { label: "Val/Val", text: "The common result.", tone: "typical" },
    CT: { label: "Val/Met", text: "One Met copy.", tone: "differs" },
    TT: { label: "Met/Met", text: "Two Met copies.", tone: "differs" },
  },
  pmids: ["12553913"],
};

// Aging research

const foxo3: Trait = {
  id: "foxo3-longevity", name: "FOXO3", gene: "FOXO3", group: "aging", rsids: ["rs2802292"], evidence: 2,
  about: "The G version was more common among very long-lived men of Japanese descent in Hawaii.",
  limits: "It shifts odds across large groups. It cannot say how long one person will live.",
  table: {
    GG: { label: "Two G copies", text: "More common among the long-lived in that study.", tone: "differs" },
    GT: { label: "One G copy", text: "One copy of the version seen more often in the long-lived.", tone: "differs" },
    TT: { label: "Common result", text: "No G copies.", tone: "typical" },
  },
  pmids: ["18765803"],
};

const klotho: Trait = {
  id: "klotho-aging", name: "Klotho KL-VS", gene: "KL", group: "aging", rsids: ["rs9536314"], evidence: 1,
  about: "KL-VS changes how the klotho protein moves and works in cells. Some studies favor people with one copy.",
  limits: "Results differ between studies.",
  table: {
    TT: { label: "No KL-VS copies", text: "The common result.", tone: "typical" },
    GT: { label: "One KL-VS copy", text: "Linked with better aging outcomes in some studies.", tone: "differs" },
    GG: { label: "Two KL-VS copies", text: "Uncommon, and not linked with the same outcomes.", tone: "differs" },
  },
  pmids: ["11792841", "24164579"],
};

const tert: Trait = {
  id: "telomere-length", name: "Telomere length", gene: "TERT", group: "aging", rsids: ["rs2736100"], evidence: 2,
  about: "Telomeres are the ends of chromosomes. The C version goes with longer ones.",
  limits: "Longer is not simply better. Longer telomeres are also linked with some cancers.",
  table: {
    CC: { label: "Longer, on average", text: "Two copies of the longer-telomere version.", tone: "differs" },
    AC: { label: "In between", text: "One copy of the longer-telomere version.", tone: "typical" },
    AA: { label: "Shorter, on average", text: "No copies of the longer-telomere version.", tone: "differs" },
  },
  pmids: ["23535734"],
};

export const TRAITS: Trait[] = [
  apoe, sort1, pcsk9, lpa, apoa5,
  tcf7l2, gckr,
  hfe,
  mthfr, fut2, gc, fads1, slc23a1,
  ugt1a1, abcg2, crp,
  lactase, caffeine, aldh2, celiac, bitter, cilantro,
  eye, mc1r, edar, earwax, actn3,
  ada, comt, bdnf,
  foxo3, klotho, tert,
];

export const TRAIT_BY_ID = new Map(TRAITS.map((t) => [t.id, t]));
export const ALL_RSIDS: Set<string> = new Set(TRAITS.flatMap((t) => t.rsids));

/** Traits from the previous version that did not survive the evidence check. */
export const RETIRED: Record<string, string> = {
  "serotonin-sensitivity": "The marker is not reliably read by consumer arrays, and the claim did not hold up in larger studies.",
  "oxytocin-empathy": "Links between this marker and empathy have not replicated well.",
  "risk-taking": "The evidence was mixed.",
  "stress-resilience": "The marker we used is not the one studied for resilience.",
  "pain-sensitivity": "It invited conclusions about medicines that a consumer array cannot support.",
  unibrow: "We could not confirm the marker.",
  "asparagus-smell": "Sources disagree on which version does what.",
  "sun-sneezing": "Sources disagree on which version does what.",
  "drd2-focus": "Claims about focus have not held up.",
  "kibra-memory": "The effect on memory is too small and inconsistent.",
  "vo2max-response": "Training response could not be predicted from it.",
  "tendon-injury": "The evidence was mixed.",
  "recovery-speed": "The evidence was mixed.",
  "muscle-building": "The table was wrong, and the version is too rare to be useful.",
  chronotype: "The marker was labeled with the wrong gene.",
  "sleep-duration": "The version is too rare for a consumer array to read reliably.",
  "caffeine-sleep": "Sources disagree on which version does what.",
  "sirt1-aging": "The evidence was too thin.",
};
