import { NextResponse } from "next/server";

import { submitLead } from "@/lib/lead-service";
import { quoteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = quoteSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Données invalides",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await submitLead(parsed.data);
    return NextResponse.json(result, { status: result.ok ? 200 : 502 });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Requête illisible" },
      { status: 400 },
    );
  }
}
