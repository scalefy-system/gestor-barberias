"use client";

import type { AuthUser } from "@/types";

const KEY = "bh_user";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  try {
    localStorage.setItem(KEY, JSON.stringify(user));
  } catch {}
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(KEY);
  } catch {}
}

export async function signIn(email: string, password: string): Promise<AuthUser> {
  await new Promise((r) => setTimeout(r, 700));
  if (!email.includes("@") || password.length < 4) {
    throw new Error("Credenciales inválidas");
  }
  const user: AuthUser = { email, name: email.split("@")[0] };
  setStoredUser(user);
  return user;
}

export async function signOut() {
  clearStoredUser();
}
