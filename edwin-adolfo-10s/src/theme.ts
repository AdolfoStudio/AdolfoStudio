import { loadFont } from "@remotion/fonts";
import { Easing, staticFile } from "remotion";

export const colors = {
  bg: "#0A0A0A",
  gold: "#D4A017",
  cream: "#F5F0E8",
};

// Fuentes guardadas en public/fonts (render estable y sin depender de la red).
// loadFont() bloquea el render hasta que cada fuente está lista.
loadFont({ family: "Bebas Neue", url: staticFile("fonts/BebasNeue-Regular.woff2") });
loadFont({
  family: "Playfair Display",
  url: staticFile("fonts/PlayfairDisplay-Italic.woff2"),
  style: "italic",
});
loadFont({ family: "Inter", url: staticFile("fonts/Inter-Regular.woff2") });
loadFont({
  family: "JetBrains Mono",
  url: staticFile("fonts/JetBrainsMono-Regular.woff2"),
});

export const fonts = {
  // Títulos grandes
  display: "'Bebas Neue', sans-serif",
  // Citas (siempre en itálica)
  quote: "'Playfair Display', serif",
  // Cuerpo
  body: "'Inter', sans-serif",
  // Etiquetas: mayúsculas y tracking amplio
  label: "'JetBrains Mono', monospace",
};

// Curva de salida suave y decidida: arranca rápido y se asienta sin rebote.
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// Placas en frames (30 fps)
export const PLATES = {
  hook: { from: 0, duration: 90 },
  tension: { from: 90, duration: 90 },
  remate: { from: 180, duration: 75 },
  cierre: { from: 255, duration: 45 },
};
