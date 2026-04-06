import { cookies } from "next/headers";

const API_URL = process.env.CHEFMATE_API_URL || "https://traiteur.zabar.fr/api/v1";
const COOKIE_NAME = "vivante_session";

type SessionUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  roles: string[];
  token: string;
};

/** Authentifie un utilisateur via l'API ChefMate */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: true; user: SessionUser } | { success: false; error: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || json.error) {
    return { success: false, error: json.error || "Identifiants incorrects" };
  }

  const { token, user } = json.data;

  // Vérifier que le user a bien accès (le token est valide)
  const meRes = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!meRes.ok) {
    return { success: false, error: "Impossible de vérifier le compte" };
  }

  return {
    success: true,
    user: { ...user, token },
  };
}

/** Sauvegarde la session dans un cookie HttpOnly */
export async function setSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/** Récupère la session depuis le cookie */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;

  try {
    return JSON.parse(cookie.value) as SessionUser;
  } catch {
    return null;
  }
}

/** Supprime la session */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
