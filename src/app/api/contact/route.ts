import { NextResponse } from "next/server";

import { submitContact } from "@/lib/lead-service";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête illisible" },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: parsed.error.issues[0]?.message ?? "Vérifiez les champs du formulaire.",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const result = await submitContact(parsed.data);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
