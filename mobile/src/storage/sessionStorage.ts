import * as SecureStore from "expo-secure-store";

import { BopSession } from "@/api/bopApi";

const SESSION_KEY = "bop.session.v1";

export async function loadStoredSession(): Promise<BopSession | null> {
  const rawSession = await SecureStore.getItemAsync(SESSION_KEY);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession) as BopSession;
  } catch {
    await clearStoredSession();
    return null;
  }
}

export async function saveStoredSession(session: BopSession): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearStoredSession(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
