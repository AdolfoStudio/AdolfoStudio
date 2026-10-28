// Sintetiza todo el audio del video desde cero (sin samples externos)
// y lo escribe como WAV 16-bit estéreo en public/.
// Uso: node scripts/generate-audio.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
mkdirSync(OUT, { recursive: true });

// Ruido pseudoaleatorio con semilla: el audio sale idéntico en cada ejecución.
let seed = 1234567;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rand() * 2 - 1;

// Filtro de variables de estado (lowpass / bandpass) con frecuencia variable.
const svf = () => {
  let low = 0;
  let band = 0;
  return (x, freq, q = 0.7) => {
    const f = 2 * Math.sin((Math.PI * Math.min(freq, SR / 6)) / SR);
    low += f * band;
    const high = x - low - band / q;
    band += f * high;
    return { low, band };
  };
};

const buffer = (seconds) => [
  new Float32Array(Math.round(seconds * SR)),
  new Float32Array(Math.round(seconds * SR)),
];

const normalize = ([l, r], peakDb) => {
  let peak = 0;
  for (let i = 0; i < l.length; i++) {
    peak = Math.max(peak, Math.abs(l[i]), Math.abs(r[i]));
  }
  const gain = Math.pow(10, peakDb / 20) / (peak || 1);
  for (let i = 0; i < l.length; i++) {
    l[i] *= gain;
    r[i] *= gain;
  }
};

const writeWav = (name, [l, r]) => {
  const n = l.length;
  const buf = Buffer.alloc(44 + n * 4);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 4, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    const s = (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767)));
    buf.writeInt16LE(s(l[i]), 44 + i * 4);
    buf.writeInt16LE(s(r[i]), 46 + i * 4);
  }
  writeFileSync(join(OUT, name), buf);
  console.log(`${name}: ${(n / SR).toFixed(2)}s`);
};

// Un golpe de bajo: seno con caída de tono y cola exponencial, saturado suave.
const addKick = ([l, r], at, { amp = 1, f0 = 85, f1 = 46, decay = 0.22, len = 0.9 } = {}) => {
  const start = Math.round(at * SR);
  let phase = 0;
  for (let i = 0; i < len * SR && start + i < l.length; i++) {
    const t = i / SR;
    const freq = f1 + (f0 - f1) * Math.exp(-t / 0.045);
    phase += (2 * Math.PI * freq) / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / decay);
    const v = Math.tanh(1.6 * (Math.sin(phase) + 0.18 * Math.sin(2 * phase))) * env * amp;
    l[start + i] += v;
    r[start + i] += v;
  }
};

// ── 1. Cama musical: drone grave + latido lento (60 BPM, "lub-dub") ──────────
{
  const dur = 10;
  const bed = buffer(dur);
  const [l, r] = bed;
  // Drone: Mi grave con quinta, respiración lenta. Sube un poco en la placa 2,
  // se corta en el remate (6 s) y vuelve más bajo para el cierre.
  const lp = [svf(), svf()];
  for (let i = 0; i < l.length; i++) {
    const t = i / SR;
    const fadeIn = Math.min(1, t / 1.8);
    const fadeOut = t > 9.1 ? Math.max(0, (10 - t) / 0.9) : 1;
    const tension = t >= 3 && t < 6 ? 1.25 : 1;
    const drop = t >= 5.95 && t < 6.9 ? 0.15 : t >= 6.9 ? 0.75 : 1;
    const breath = 0.8 + 0.2 * Math.sin(2 * Math.PI * 0.25 * t);
    const tone =
      Math.sin(2 * Math.PI * 41.2 * t) +
      0.35 * Math.sin(2 * Math.PI * 82.4 * t + 0.3) +
      0.18 * Math.sin(2 * Math.PI * 61.74 * t + 1.1) +
      0.06 * Math.sin(2 * Math.PI * 123.5 * t);
    const air = noise() * 0.05;
    const v = (tone * 0.32 + air) * fadeIn * fadeOut * tension * drop * breath;
    // Un poco de ancho estéreo: filtros distintos por canal.
    l[i] += lp[0](v, 220).low;
    r[i] += lp[1](v, 260).low;
  }
  // Latido: cada segundo, salvo el silencio de autoridad tras el remate.
  for (let s = 0; s < 10; s++) {
    if (s === 6) continue; // el impacto ocupa ese lugar
    const amp = s < 3 ? 0.55 + s * 0.1 : s < 6 ? 0.85 : 0.6;
    const fade = s >= 9 ? 0.5 : 1;
    addKick(bed, s, { amp: amp * fade });
    addKick(bed, s + 0.24, { amp: amp * 0.55 * fade, f0: 75, decay: 0.18 });
  }
  normalize(bed, -4);
  writeWav("pulse-bed.wav", bed);
}

// ── 2. Whoosh suave: ruido con barrido de banda, pico a los 0.45 s ──────────
{
  const dur = 0.75;
  const peakAt = 0.45;
  const wh = buffer(dur);
  const f = [svf(), svf()];
  for (let i = 0; i < wh[0].length; i++) {
    const t = i / SR;
    const env =
      t < peakAt
        ? Math.pow(t / peakAt, 2.2)
        : Math.exp(-(t - peakAt) / 0.09);
    const sweep = t < peakAt ? 350 + 2600 * Math.pow(t / peakAt, 1.5) : 2950 * Math.exp(-(t - peakAt) / 0.12) + 400;
    const pan = 0.5 + 0.35 * Math.sin(Math.PI * (t / dur - 0.5));
    wh[0][i] = f[0](noise(), sweep, 1.4).band * env * (1 - pan + 0.5);
    wh[1][i] = f[1](noise(), sweep * 1.05, 1.4).band * env * (pan + 0.5);
  }
  normalize(wh, -6);
  writeWav("whoosh.wav", wh);
}

// ── 3. Golpe seco: thump grave corto + clic filtrado ────────────────────────
{
  const hit = buffer(0.5);
  addKick(hit, 0, { amp: 1, f0: 140, f1: 55, decay: 0.07, len: 0.5 });
  const f = svf();
  for (let i = 0; i < 0.03 * SR; i++) {
    const t = i / SR;
    const v = f(noise(), 3200, 0.8).low * Math.exp(-t / 0.006) * 0.9;
    hit[0][i] += v;
    hit[1][i] += v;
  }
  normalize(hit, -3);
  writeWav("hit.wav", hit);
}

// ── 4. Impacto del remate: subida de 0.8 s + boom sub con cola larga ────────
// El golpe cae exactamente a 0.8 s del inicio del archivo.
{
  const riseLen = 0.8;
  const dur = 3.2;
  const imp = buffer(dur);
  const [l, r] = imp;
  // Subida: ruido que se abre y crece (reverse swell).
  const fr = [svf(), svf()];
  for (let i = 0; i < riseLen * SR; i++) {
    const t = i / SR;
    const p = t / riseLen;
    const env = Math.pow(p, 3) * 0.55;
    l[i] += fr[0](noise(), 200 + 4000 * p * p, 0.9).band * env;
    r[i] += fr[1](noise(), 210 + 4100 * p * p, 0.9).band * env;
  }
  const at = riseLen;
  // Boom sub con caída de tono larga.
  addKick(imp, at, { amp: 1.5, f0: 110, f1: 32, decay: 0.9, len: 2.4 });
  // Cuerpo medio y transitorio para que se sienta también en el móvil.
  addKick(imp, at, { amp: 0.5, f0: 260, f1: 90, decay: 0.08, len: 0.4 });
  const fc = [svf(), svf()];
  const start = Math.round(at * SR);
  for (let i = 0; i < 1.6 * SR && start + i < l.length; i++) {
    const t = i / SR;
    const crack = Math.exp(-t / 0.012) * 0.8;
    const tail = Math.exp(-t / 0.45) * 0.12;
    l[start + i] += fc[0](noise(), 1800 * Math.exp(-t / 0.3) + 120, 0.7).low * (crack + tail);
    r[start + i] += fc[1](noise(), 1700 * Math.exp(-t / 0.3) + 120, 0.7).low * (crack + tail);
  }
  normalize(imp, -1.5);
  writeWav("impact.wav", imp);
}
