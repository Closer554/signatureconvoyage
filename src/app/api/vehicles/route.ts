import { NextRequest, NextResponse } from "next/server";

type VpicMake = { Make_ID?: number; Make_Name?: string };
type VpicModel = { Model_ID?: number; Model_Name?: string };

const vehicleTypes: Record<string, string> = {
  moto: "motorcycle",
  poids_lourd: "truck",
  bus: "bus",
};

const toSlug = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

async function getOpenCarData(resource: string, query: string, make: string) {
  const makeSlug = toSlug(make);
  const url = resource === "makes" ? "https://cardata.wiki/makes" : `https://cardata.wiki/${makeSlug}`;
  const response = await fetch(url, { next: { revalidate: 604800 } });
  if (!response.ok) throw new Error(`cardata.wiki returned ${response.status}`);
  const html = await response.text();
  const normalizedQuery = query.toLocaleLowerCase("fr");

  if (resource === "makes") {
    const matches = html.matchAll(
      /href="\/([^"/]+)"><div class="font-medium text-sm[^"]*">([^<]+)<\/div><div class="text-xs text-slate-400">\d+/g,
    );
    return Array.from(matches)
      .map((match) => ({ id: match[1], label: match[2] }))
      .filter((item) => item.label.toLocaleLowerCase("fr").includes(normalizedQuery))
      .slice(0, 8);
  }

  const escapedSlug = makeSlug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(
    `href="/${escapedSlug}/([^"]+)"><div class="font-medium text-sm[^"]*">[^<]*<!-- --> <!-- -->([^<]+)</div>`,
    "g",
  );
  return Array.from(html.matchAll(pattern))
    .map((match) => ({ id: match[1], label: match[2] }))
    .filter((item) => item.label.toLocaleLowerCase("fr").includes(normalizedQuery))
    .slice(0, 8);
}

export async function GET(request: NextRequest) {
  const resource = request.nextUrl.searchParams.get("resource");
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const category = request.nextUrl.searchParams.get("category") ?? "voiture";
  const make = request.nextUrl.searchParams.get("make")?.trim() ?? "";

  try {
    if ((category === "voiture" || category === "utilitaire") && resource) {
      const suggestions = await getOpenCarData(resource, query, make);
      return NextResponse.json({ suggestions, source: "cardata.wiki" });
    }

    if (resource === "makes") {
      const type = vehicleTypes[category] ?? "car";
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/${encodeURIComponent(type)}?format=json`;
      const response = await fetch(url, { next: { revalidate: 604800 } });
      if (!response.ok) throw new Error(`vPIC returned ${response.status}`);
      const data = (await response.json()) as { Results?: VpicMake[] };
      const normalizedQuery = query.toLocaleLowerCase("fr");
      const suggestions = (data.Results ?? [])
        .filter((item) => item.Make_Name?.toLocaleLowerCase("fr").includes(normalizedQuery))
        .slice(0, 8)
        .map((item) => ({ id: String(item.Make_ID ?? item.Make_Name), label: item.Make_Name! }));
      return NextResponse.json({ suggestions });
    }

    if (resource === "models") {
      if (make.length < 2) return NextResponse.json({ suggestions: [] });
      const url = `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(make)}?format=json`;
      const response = await fetch(url, { next: { revalidate: 604800 } });
      if (!response.ok) throw new Error(`vPIC returned ${response.status}`);
      const data = (await response.json()) as { Results?: VpicModel[] };
      const normalizedQuery = query.toLocaleLowerCase("fr");
      const suggestions = (data.Results ?? [])
        .filter((item) => item.Model_Name?.toLocaleLowerCase("fr").includes(normalizedQuery))
        .slice(0, 8)
        .map((item) => ({ id: String(item.Model_ID ?? item.Model_Name), label: item.Model_Name! }));
      return NextResponse.json({ suggestions });
    }

    return NextResponse.json({ suggestions: [] }, { status: 400 });
  } catch {
    return NextResponse.json(
      { suggestions: [], error: "Le catalogue de véhicules est momentanément indisponible." },
      { status: 503 },
    );
  }
}
