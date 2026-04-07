import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadImage } from "@/lib/api";

export const dynamic = "force-dynamic";

const ALLOWED_PREFIXES = ["recettes", "events", "equipe"] as const;
type AllowedPrefix = (typeof ALLOWED_PREFIXES)[number];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const prefixRaw = (formData.get("prefix") as string) || "events";

  if (!file) {
    return NextResponse.json({ success: false, error: "Aucun fichier fourni" }, { status: 400 });
  }

  const prefix: AllowedPrefix = (ALLOWED_PREFIXES as readonly string[]).includes(prefixRaw)
    ? (prefixRaw as AllowedPrefix)
    : "events";

  const result = await uploadImage(session.token, file, prefix);

  if (!result.success) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
