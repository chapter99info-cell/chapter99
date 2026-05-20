import type { StaffRole, StaffSession } from "../types";
import { supabase } from "./supabase";

const SESSION_STORAGE_KEY = "trip2talk.staffSession";
const DEMO_PIN = "1937";

interface VerifyPinResponse {
  session_token: string;
  role: StaffRole;
  label: string;
  expires_at: string;
}

export function readStoredStaffSession(): StaffSession | null {
  const rawSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    const session = JSON.parse(rawSession) as StaffSession;
    if (new Date(session.expiresAt).getTime() <= Date.now()) {
      clearStoredStaffSession();
      return null;
    }

    return session;
  } catch {
    clearStoredStaffSession();
    return null;
  }
}

export function storeStaffSession(session: StaffSession) {
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredStaffSession() {
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function verifyStaffPin(pin: string): Promise<StaffSession> {
  if (!/^\d{4}$/.test(pin)) {
    throw new Error("Enter a 4-digit staff PIN.");
  }

  if (supabase) {
    const { data, error } = await supabase
      .rpc("verify_staff_pin", { provided_pin: pin })
      .single<VerifyPinResponse>();

    if (error || !data) {
      throw new Error(error?.message || "PIN verification failed.");
    }

    return {
      token: data.session_token,
      role: data.role,
      label: data.label,
      expiresAt: data.expires_at,
    };
  }

  if (pin !== DEMO_PIN) {
    throw new Error("Invalid demo PIN. Connect Supabase for production PIN checks.");
  }

  return {
    token: "demo-session",
    role: "admin",
    label: "Demo Admin",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
  };
}
