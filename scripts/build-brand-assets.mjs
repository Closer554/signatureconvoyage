import sharp from 'sharp';
import { mkdir, writeFile, copyFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import potrace from 'potrace';

// Trace the supplied artwork into the existing vector logo system. No fonts or
// generated reinterpretations are used in the production masters.
const root = path.resolve('public/images/logos');
const source = path.resolve('public/logo.png');
const palette = { navy: '#0b2033', gold: '#b79a68', cream: '#fbfaf7' };
const { data, info } = await sharp(source).removeAlpha().raw().toBuffer({ resolveWithObject: true });
if (info.width !== 1254 || info.height !== 1254) {
  throw new Error('Source dimensions changed: review the component regions before rebuilding.');
}
const { width: w, height: h, channels } = info;

async function trace(color, region) {
  const mask = Buffer.alloc(w * h, 255);
  for (let y = region[1]; y < region[3]; y++) for (let x = region[0]; x < region[2]; x++) {
    const i = (y * w + x) * channels;
    const [r, g, b] = data.subarray(i, i + 3);
    const inside = color === 'navy' ? r < 130 && g < 145 && b > r : r > b + 25 && g > b + 10 && r < 235;
    if (inside) mask[y * w + x] = 0;
  }
  const bitmap = await sharp(mask, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  const traced = await new Promise((resolve, reject) => potrace.trace(bitmap, {
    threshold: 128, turdSize: 5, alphaMax: 1,
    optCurve: true, optTolerance: 0.25,
  }, (error, output) => error ? reject(error) : resolve(output)));
  const pathData = traced.match(/<path d="([^"]+)"/)[1];
  const contours = [];
  for (const [, type, coordinates] of pathData.matchAll(/([MCL])([^MCL]*)/g)) {
    if (type === 'M') {
      if (contours.length) contours.at(-1).push({ type: 'Z', points: [] });
      contours.push([]);
    }
    const values = coordinates.trim().split(/[\s,]+/).map(Number);
    const stride = type === 'C' ? 6 : 2;
    for (let i = 0; i < values.length; i += stride) {
      const points = [];
      for (let j = 0; j < stride; j += 2) points.push(values.slice(i + j, i + j + 2));
      contours.at(-1).push({ type, points });
    }
  }
  contours.at(-1).push({ type: 'Z', points: [] });
  if (color === 'gold' && region[1] === 700) {
    for (let i = 0; i < contours.length; i++) {
      const points = contours[i].flatMap(c => c.points);
      const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
      const left = Math.min(...xs), right = Math.max(...xs), top = Math.min(...ys), bottom = Math.max(...ys);
      if (right - left > 80 && bottom - top < 8) {
        const center = (top + bottom) / 2;
        contours[i] = [
          { type: 'M', points: [[left, center - 1.5]] },
          { type: 'L', points: [[right, center - 1.5]] },
          { type: 'L', points: [[right, center + 1.5]] },
          { type: 'L', points: [[left, center + 1.5]] },
          { type: 'Z', points: [] },
        ];
      }
    }
  }
  return { color, contours };
}

const symbol = [await trace('navy', [100, 370, 1180, 690]), await trace('gold', [100, 370, 1180, 690])];
const wordmark = [await trace('navy', [100, 700, 1180, 900]), await trace('gold', [100, 700, 1180, 900])];
const pin = [await trace('gold', [1050, 410, 1180, 590])];
function bounds(groups) {
  const pts = [];
  // Evaluate Bézier extrema: control handles can extend beyond the artwork.
  for (const contour of groups.flatMap(g => g.contours)) {
    let previous;
    for (const command of contour) {
      if (command.type === 'Z') continue;
      const end = command.points.at(-1);
      pts.push(end);
      if (command.type === 'C') {
        const curve = [previous, ...command.points];
        for (const axis of [0, 1]) {
          const [a, b, c, d] = curve.map(p => p[axis]);
          const qa = -a + 3 * b - 3 * c + d, qb = 2 * (a - 2 * b + c), qc = b - a;
          const discriminant = qb * qb - 4 * qa * qc;
          const roots = Math.abs(qa) < 1e-9 ? (Math.abs(qb) > 1e-9 ? [-qc / qb] : []) : discriminant >= 0 ? [(-qb + Math.sqrt(discriminant)) / (2 * qa), (-qb - Math.sqrt(discriminant)) / (2 * qa)] : [];
          for (const t of roots.filter(t => t > 0 && t < 1)) {
            const v = 1 - t;
            pts.push([0, 1].map(k => v ** 3 * curve[0][k] + 3 * v * v * t * curve[1][k] + 3 * v * t * t * curve[2][k] + t ** 3 * curve[3][k]));
          }
        }
      }
      previous = end;
    }
  }
  return [Math.min(...pts.map(p => p[0])), Math.min(...pts.map(p => p[1])), Math.max(...pts.map(p => p[0])), Math.max(...pts.map(p => p[1]))];
}
function place(groups, x, y, scale = 1) {
  const [left, top] = bounds(groups);
  return groups.map(g => ({ ...g, contours: g.contours.map(c => c.map(command => ({ ...command, points: command.points.map(([px, py]) => [+(x + (px - left) * scale).toFixed(3), +(y + (py - top) * scale).toFixed(3)]) }))) }));
}
function fit(groups, width, height, padding) {
  const [x1, y1, x2, y2] = bounds(groups);
  const scale = Math.min((width - padding * 2) / (x2 - x1), (height - padding * 2) / (y2 - y1));
  return place(groups, (width - (x2 - x1) * scale) / 2, (height - (y2 - y1) * scale) / 2, scale);
}
const full = [...symbol, ...wordmark];
const variants = {
  'logo-complet': { width: 1120, height: 560, groups: fit(full, 1120, 560, 32) },
  'logo-horizontal': { width: 1200, height: 230, groups: [...fit(symbol, 580, 230, 24), ...place(wordmark, 620, 72, 0.57)] },
  symbole: { width: 1120, height: 360, groups: fit(symbol, 1120, 360, 32) },
  repere: { width: 256, height: 256, groups: fit(pin, 256, 256, 32) },
};
const d = contours => contours.map(c => c.map(command => command.type + command.points.flat().join(' ')).join('')).join('');
function svg(variant, white = false, background, strokeWidth = 0) {
  const { width, height, groups } = variant;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><title>Signature Convoyage</title>${background ? `<path fill="${background}" d="M0 0H${width}V${height}H0Z"/>` : ''}${groups.map(g => `<path fill="${white ? '#ffffff' : palette[g.color]}"${strokeWidth ? ` stroke="${white ? '#ffffff' : palette[g.color]}" stroke-width="${strokeWidth}" stroke-linejoin="round"` : ''} fill-rule="evenodd" d="${d(g.contours)}"/>`).join('')}</svg>`;
}
async function save(file, content) {
  const dest = path.join(root, file);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, content);
}

// Minimal vector PDF writer: same contours, no raster image or font dependency.
function pdf({ width, height, groups }) {
  let stream = `q\n1 0 0 -1 0 ${height} cm\n`;
  for (const group of groups) {
    const rgb = palette[group.color].slice(1).match(/../g).map(v => (parseInt(v, 16) / 255).toFixed(4));
    stream += `${rgb.join(' ')} rg\n`;
    for (const c of group.contours) stream += c.map(command => `${command.points.flat().join(' ')} ${{ M: 'm', L: 'l', C: 'c', Z: 'h' }[command.type]}`).join('\n') + '\n';
    stream += 'f*\n';
  }
  stream += 'Q\n';
  const objects = ['<< /Type /Catalog /Pages 2 0 R >>', '<< /Type /Pages /Kids [3 0 R] /Count 1 >>', `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${width} ${height}] /Resources << >> /Contents 4 0 R >>`, `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}endstream`];
  let out = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((obj, i) => { offsets.push(Buffer.byteLength(out)); out += `${i + 1} 0 obj\n${obj}\nendobj\n`; });
  const xref = Buffer.byteLength(out);
  out += `xref\n0 5\n0000000000 65535 f \n${offsets.slice(1).map(n => `${String(n).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return out;
}

for (const [name, variant] of Object.entries(variants)) {
  for (const white of [false, true]) {
    const suffix = white ? '-blanc' : '';
    const master = Buffer.from(svg(variant, white));
    await save(`svg/${name}${suffix}.svg`, master);
    for (const size of [1024, 2048, 4096]) {
      await save(`png/${name}${suffix}-transparent-${size}.png`, await sharp(master, { density: 72 * size * 2 / variant.width }).resize({ width: size }).png().toBuffer());
    }
    await save(`webp/${name}${suffix}-transparent-1024.webp`, await sharp(master, { density: 72 * 2048 / variant.width }).resize({ width: 1024 }).webp({ lossless: true }).toBuffer());
  }
  for (const [bgName, background] of [['blanc', '#ffffff'], ['creme', palette.cream]]) {
    await save(`jpg/${name}-fond-${bgName}-2048.jpg`, await sharp(Buffer.from(svg(variant, false, background)), { density: 72 * 4096 / variant.width }).resize({ width: 2048 }).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toBuffer());
  }
  await save(`pdf/${name}.pdf`, pdf(variant));
}
const share = { width: 1200, height: 630, groups: fit(full, 1200, 630, 90) };
await save('reseaux/partage-1200x630.jpg', await sharp(Buffer.from(svg(share, false, palette.cream)), { density: 144 }).resize(1200, 630).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toBuffer());
const avatar = { width: 1080, height: 1080, groups: fit(full, 1080, 1080, 110) };
await save('reseaux/avatar-1080.png', await sharp(Buffer.from(svg(avatar, false, palette.cream)), { density: 144 }).resize(1080, 1080).png().toBuffer());
// Small tabs show the actual car emblem. Slightly strengthen its fine outlines
// at this scale; larger home-screen icons have room for the complete wordmark.
const tabIcon = { width: 32, height: 32, groups: fit(symbol, 32, 32, 1.5) };
const applicationIcon = { width: 512, height: 512, groups: fit(full, 512, 512, 32) };
for (const size of [16, 32, 48, 180, 192, 512]) {
  const small = size <= 48;
  const artwork = small ? tabIcon : applicationIcon;
  await save(`icones/icone-${size}.png`, await sharp(Buffer.from(svg(artwork, false, palette.cream, small ? 0.6 : 0)), { density: 72 * size * 4 / artwork.width }).resize(size, size).png().toBuffer());
}
const maskable = { width: 512, height: 512, groups: fit(full, 512, 512, 92) };
await save('icones/icone-maskable-512.png', await sharp(Buffer.from(svg(maskable, false, palette.cream)), { density: 144 }).resize(512, 512).png().toBuffer());
await save('icones/favicon.svg', svg(tabIcon, false, palette.cream, 0.6));
await mkdir(path.join(root, 'sources'), { recursive: true });
await copyFile(source, path.join(root, 'sources/logo-original.png'));
const sourceHash = createHash('sha256').update(await readFile(source)).digest('hex');
await save('sources/PREPARATION.md', `# Préparation du nouveau logo\n\nSource : public/logo.png (1254 × 1254 px). SHA-256 : ${sourceHash}.\n\nLes contours du PNG fourni sont vectorisés en courbes de Bézier avec Potrace par scripts/build-brand-assets.mjs. Les filets dorés sont rectifiés. Les PNG, WebP et JPEG sont rendus à deux fois la largeur cible puis réduits avec anticrénelage ; les PDF utilisent les mêmes courbes. Les lettres sont des tracés, sans substitution de police. Les aplats sont harmonisés en bleu nuit #0b2033 et or #b79a68. Les exports raster et PDF proviennent de ces SVG. Cette vectorisation ne remplace pas le fichier natif du créateur.\n\nUn essai a été réalisé avec l’outil intégré imagegen, puis écarté car son fond n’était pas réellement transparent. Aucun pixel de cet essai n’est utilisé dans les livrables.\n\nPrompt de l’essai : « Remove the white background and all white spaces inside the lettering, car and pin, yielding actual transparent alpha. Preserve exact contours, lettering, positions, scale ratios, car silhouette, dashed route and golden location pin. Text verbatim: SIGNATURE / CONVOYAGE. Flat navy #0b2033 and gold #b79a68. No redesign. »\n`);
const inventory = [];
for (const file of await readdir(root, { recursive: true })) {
  if (/\.(png|webp|jpg)$/.test(file)) {
    const meta = await sharp(path.join(root, file)).metadata();
    inventory.push({ file: file.replaceAll('\\', '/'), width: meta.width, height: meta.height, format: meta.format, alpha: meta.hasAlpha });
  }
}
await save('inventaire.json', JSON.stringify({ source: 'public/logo.png', sourceSha256: sourceHash, palette, files: inventory }, null, 2) + '\n');
console.log(`Generated ${inventory.length} raster assets, SVG and PDF masters from ${source}.`);
