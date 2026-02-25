import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

interface UserProfile {
  hasUploadedDNA: boolean;
  snpCount: number;
  uploadedAt?: unknown;
  format?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export async function createOrUpdateUserProfile(
  uid: string,
  data: Partial<UserProfile>
) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
  } else {
    await setDoc(userRef, {
      hasUploadedDNA: false,
      snpCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...data,
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveSNPResults(
  uid: string,
  snps: Map<string, string>,
  format: string
) {
  // Save SNPs as a single document
  const snpRef = doc(db, "users", uid, "snpResults", "data");
  const snpObj: Record<string, string> = {};
  snps.forEach((value, key) => {
    snpObj[key] = value;
  });

  await setDoc(snpRef, {
    snps: snpObj,
    savedAt: serverTimestamp(),
  });

  // Update user profile
  await createOrUpdateUserProfile(uid, {
    hasUploadedDNA: true,
    snpCount: snps.size,
    uploadedAt: serverTimestamp(),
    format,
  });
}

export async function getUserSNPs(
  uid: string
): Promise<Map<string, string> | null> {
  const snpRef = doc(db, "users", uid, "snpResults", "data");
  const snap = await getDoc(snpRef);

  if (!snap.exists()) return null;

  const data = snap.data();
  const snps = new Map<string, string>();
  if (data.snps) {
    Object.entries(data.snps).forEach(([key, value]) => {
      snps.set(key, value as string);
    });
  }
  return snps;
}
