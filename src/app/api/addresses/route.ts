import { NextRequest, NextResponse } from "next/server";

type GeoplateformeResult = {
  fulltext?: string;
  city?: string;
  zipcode?: string;
  x?: number;
  y?: number;
};

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (query.length < 3) return NextResponse.json({ suggestions: [] });

  const url = new URL("https://data.geopf.fr/geocodage/completion/");
  url.searchParams.set("text", query.slice(0, 160));
  url.searchParams.set("type", "StreetAddress");
  url.searchParams.set("maximumResponses", "6");

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Geoplateforme returned ${response.status}`);

    const data = (await response.json()) as { results?: GeoplateformeResult[] };
    const suggestions = (data.results ?? [])
      .filter((item) => item.fulltext)
      .map((item) => ({
        label: item.fulltext!,
        city: item.city ?? "",
        postcode: item.zipcode ?? "",
        longitude: item.x,
        latitude: item.y,
      }));

    return NextResponse.json(
      { suggestions },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=86400" } },
    );
  } catch {
    return NextResponse.json(
      { suggestions: [], error: "Le service d’adresses est momentanément indisponible." },
      { status: 503 },
    );
  }
}
