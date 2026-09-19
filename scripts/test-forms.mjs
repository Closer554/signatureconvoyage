// Run with Node >= 22.15: node scripts/test-forms.mjs
// All provider requests are intercepted; no credentials or network are needed.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const sourceRoot = new URL("../src/", import.meta.url);
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return { url: new URL(`${specifier.slice(2)}.ts`, sourceRoot).href, shortCircuit: true };
    }
    return nextResolve(specifier === "next/server" ? "next/server.js" : specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(sourceRoot.href) && url.endsWith(".ts")) {
      const { outputText } = ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      });
      return { format: "module", source: outputText, shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});

const originalFetch = globalThis.fetch;
const envKeys = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "RESEND_TO_EMAIL"];
const originalEnv = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]));
let requests = [];
let providerResponse = {};

// Install before importing the actual SDK. Unexpected requests fail instead of
// falling through to the network, including while modules initialize.
globalThis.fetch = async (url, options) => {
  assert.equal(String(url), "https://api.resend.com/emails");
  assert.equal(options.method, "POST");
  requests.push(JSON.parse(options.body));
  if (providerResponse.throws) throw new Error("Simulated connection failure");
  return Response.json(providerResponse.body, { status: providerResponse.status });
};

const { contactSchema } = await import("../src/lib/validation.ts");
const { POST: postContact } = await import("../src/app/api/contact/route.ts");
const { POST: postLead } = await import("../src/app/api/leads/route.ts");

beforeEach((context) => {
  process.env.RESEND_API_KEY = "re_test_only_never_send";
  process.env.RESEND_FROM_EMAIL = "Signature Convoyage <forms@example.com>";
  delete process.env.RESEND_TO_EMAIL;
  requests = [];
  providerResponse = { status: 200, body: { id: "email-test-id" } };
  context.mock.method(console, "info", () => {});
  context.mock.method(console, "error", () => {});
});

after(() => {
  hooks.deregister();
  globalThis.fetch = originalFetch;
  for (const key of envKeys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
});

const contact = {
  type: "contact",
  firstname: "Camille",
  lastname: "Martin",
  email: "camille@example.com",
  phone: "0601020304",
  message: "Transport de mon véhicule.",
  consent: true,
};
const business = { ...contact, type: "b2b", company: "Agence Exemple", volume: "12" };
const driver = {
  ...contact,
  type: "driver",
  city: "Paris",
  radius: "100 km",
  status: "Micro-entreprise",
  licence: "10 ans",
};
const quote = {
  profile: "Particulier",
  departure: "Paris, France",
  arrival: "Lyon, France",
  vehicleCategory: "voiture",
  vehicleMake: "Renault",
  vehicleModel: "Clio",
  vehicleYear: "2021",
  running: "Oui",
  date: "2026-12-10",
  name: "Camille Martin",
  phone: "0601020304",
  email: "camille@example.com",
  comment: "Remise des clés à l’accueil.",
  consent: true,
};

async function post(handler, body) {
  const response = await handler(new Request("https://signature-convoyage.fr/api/test", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }));
  return { status: response.status, body: await response.json() };
}

test("contact validation trims values and requires consent and contact details", () => {
  assert.equal(contactSchema.parse({ ...contact, firstname: " Camille " }).firstname, "Camille");
  for (const field of ["firstname", "lastname", "email", "phone", "message", "consent"]) {
    const invalid = { ...contact };
    delete invalid[field];
    assert.equal(contactSchema.safeParse(invalid).success, false, `Required: ${field}`);
  }
  for (const consent of [false, "true", "on", 1]) {
    assert.equal(contactSchema.safeParse({ ...contact, consent }).success, false);
  }
  assert.equal(contactSchema.safeParse({ ...contact, email: "invalid" }).success, false);
  assert.equal(contactSchema.safeParse({ ...contact, message: " " }).success, false);
  assert.equal(contactSchema.safeParse({ ...contact, message: "x".repeat(5_001) }).success, false);
});

test("business validation requires a company; driver validation requires its specific fields", () => {
  assert.equal(contactSchema.safeParse(business).success, true);
  assert.equal(contactSchema.safeParse({ ...contact, type: "b2b" }).success, false);
  assert.equal(contactSchema.safeParse(driver).success, true);
  for (const field of ["city", "radius", "status", "licence"]) {
    const invalid = { ...driver };
    delete invalid[field];
    assert.equal(contactSchema.safeParse(invalid).success, false, `Required: ${field}`);
  }
  assert.equal(contactSchema.safeParse({ ...driver, status: "Unknown" }).success, false);
});

for (const [name, handler, validBody] of [
  ["contact", postContact, contact],
  ["quote", postLead, quote],
]) {
  test(`${name} API rejects malformed JSON and invalid data before contacting the provider`, async () => {
    const malformed = await handler(new Request("https://signature-convoyage.fr/api/test", {
      method: "POST", body: "{",
    }));
    assert.equal(malformed.status, 400);
    assert.equal((await malformed.json()).ok, false);
    const invalid = await post(handler, { ...validBody, consent: false });
    assert.equal(invalid.status, 400);
    assert.equal(invalid.body.ok, false);
    assert.deepEqual(requests, []);
  });

  test(`${name} API reports provider rejection and never returns a success without an email id`, async () => {
    for (const failure of [
      { status: 403, body: { name: "validation_error", message: "Sender domain not verified" } },
      { status: 200, body: {} },
      { throws: true },
    ]) {
      providerResponse = failure;
      const result = await post(handler, validBody);
      assert.equal(result.status, 502);
      assert.equal(result.body.ok, false);
      assert.ok(result.body.error);
    }
    assert.equal(requests.length, 3);
  });

  test(`${name} API rejects missing provider configuration without making a provider request`, async () => {
    for (const key of ["RESEND_API_KEY", "RESEND_FROM_EMAIL"]) {
      const previous = process.env[key];
      delete process.env[key];
      const result = await post(handler, validBody);
      assert.equal(result.status, 502);
      assert.equal(result.body.ok, false);
      process.env[key] = previous;
    }
    assert.deepEqual(requests, []);
  });
}

test("contact sends to the requested business inbox, with reply-to and safe HTML plus plain text", async () => {
  const message = `<script>alert("test")</script> & l'accueil`;
  const result = await post(postContact, { ...contact, firstname: "<Camille>", message });
  assert.deepEqual(result, { status: 200, body: { ok: true } });
  assert.equal(requests.length, 1);
  const email = requests[0];
  assert.deepEqual(email.to, ["contact@signature-convoyage.fr"]);
  assert.equal(email.from, process.env.RESEND_FROM_EMAIL);
  assert.equal(email.reply_to, contact.email);
  assert.equal(email.subject, "Nouvelle demande de contact — Signature Convoyage");
  assert.ok(email.html.includes("&lt;Camille&gt;"));
  assert.ok(email.html.includes("&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt; &amp; l&#039;accueil"));
  assert.equal(email.html.includes("<script>"), false);
  assert.ok(email.text.includes(message));
});

test("explicit recipient overrides are split and trimmed; an empty override uses the business inbox", async () => {
  process.env.RESEND_TO_EMAIL = " first@example.com, , second@example.com ";
  assert.equal((await post(postContact, contact)).status, 200);
  assert.deepEqual(requests[0].to, ["first@example.com", "second@example.com"]);
  process.env.RESEND_TO_EMAIL = " ";
  assert.equal((await post(postContact, contact)).status, 200);
  assert.deepEqual(requests[1].to, ["contact@signature-convoyage.fr"]);
});

test("business and driver submissions include their type-specific details", async () => {
  assert.equal((await post(postContact, business)).status, 200);
  assert.equal((await post(postContact, driver)).status, 200);
  assert.equal(requests[0].subject, "Nouvelle demande professionnelle — Signature Convoyage");
  assert.ok(requests[0].text.includes("Société : Agence Exemple"));
  assert.ok(requests[0].text.includes("Volume mensuel approximatif : 12"));
  assert.equal(requests[1].subject, "Nouvelle candidature convoyeur — Signature Convoyage");
  for (const value of [driver.city, driver.radius, driver.status, driver.licence]) {
    assert.ok(requests[1].text.includes(value));
  }
});

test("quote delivery preserves the route, vehicle, date, reply-to, and requested inbox", async () => {
  const result = await post(postLead, quote);
  assert.deepEqual(result, { status: 200, body: { ok: true } });
  assert.equal(requests.length, 1);
  const email = requests[0];
  assert.deepEqual(email.to, ["contact@signature-convoyage.fr"]);
  assert.equal(email.reply_to, quote.email);
  assert.equal(email.subject, "Nouvelle demande de devis — Signature Convoyage");
  for (const value of [quote.departure, quote.arrival, "Voiture · Renault · Clio · 2021", "10 décembre 2026", quote.comment]) {
    assert.ok(email.text.includes(value), value);
  }
});
