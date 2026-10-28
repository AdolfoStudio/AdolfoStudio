# EDWIN ADOLFO · 10 s

Pieza vertical 1080x1920, 30 fps, 300 frames, hecha con Remotion.

| Placa | Tiempo | Contenido |
| --- | --- | --- |
| 1 · Hook | 0–3 s | "Tu marca no tiene problema de visibilidad." |
| 2 · Tensión | 3–6 s | "Tiene problema de relevancia." |
| 3 · Remate | 6–8,5 s | "Sin estrategia no hay paraíso." (dorado) |
| 4 · Cierre | 8,5–10 s | Isotipo Adolfo Studio + EDWIN ADOLFO + pregunta |

- `src/`: composición (`EdwinAdolfo10s.tsx`) y una escena por placa en `src/scenes/`.
- `public/`: audio sintetizado, fuentes locales e isotipo oficial (SVG extraído de la web).
- `scripts/generate-audio.mjs`: genera todo el audio desde cero (`node scripts/generate-audio.mjs`).
- `Renders/`: MP4 final y stills de cada placa.

## Comandos

```bash
npm i
npm run dev                                   # Remotion Studio
npx remotion render EdwinAdolfo10s Renders/edwin-adolfo-10s.mp4 --codec=h264
```
