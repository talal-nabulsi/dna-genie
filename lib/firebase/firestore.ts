import { deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import type { LabPanel, LabValue } from "@/lib/labs/panel";
import { db } from "./config";

const snpRef = (uid: string) => doc(db, "users", uid, "snpResults", "data");
/** Sits under snpResults so the existing owner-only rule covers it. */
const bloodRef = (uid: string) => doc(db, "users", uid, "snpResults", "bloodPanel");

async function touchProfile(uid: string, data: Record<string, unknown>) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  await setDoc(ref, { ...(snap.exists() ? {} : { createdAt: serverTimestamp() }), ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function saveSNPResults(uid: string, snps: Map<string, string>, format: string) {
  await setDoc(snpRef(uid), { snps: Object.fromEntries(snps), savedAt: serverTimestamp() });
  await touchProfile(uid, { hasUploadedDNA: true, snpCount: snps.size, format, uploadedAt: serverTimestamp() });
}

export async function getUserSNPs(uid: string): Promise<Map<string, string> | null> {
  const snap = await getDoc(snpRef(uid));
  return snap.exists() ? new Map(Object.entries((snap.data().snps ?? {}) as Record<string, string>)) : null;
}

export async function deleteSNPResults(uid: string) {
  await deleteDoc(snpRef(uid));
  await touchProfile(uid, { hasUploadedDNA: false, snpCount: 0 });
}

/** Firestore rejects undefined, so absent fields are left out. */
const strip = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

export async function saveBloodPanel(uid: string, panel: LabPanel) {
  await setDoc(bloodRef(uid), { ...strip(panel), savedAt: serverTimestamp() });
}

export async function getBloodPanel(uid: string): Promise<LabPanel | null> {
  const snap = await getDoc(bloodRef(uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return { date: d.date as string, sex: d.sex, values: d.values as LabValue[] };
}

export const deleteBloodPanel = (uid: string) => deleteDoc(bloodRef(uid));
