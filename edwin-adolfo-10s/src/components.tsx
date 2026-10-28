import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { clamp, colors, easeIn, easeOut, fonts } from "./theme";

// Fondo oscuro con una viñeta mínima para dar profundidad sin "efecto".
export const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: colors.bg,
      backgroundImage:
        "radial-gradient(ellipse 80% 60% at 50% 45%, #141312 0%, #0A0A0A 70%)",
    }}
  />
);

// Línea de texto que sube desde una máscara: entra como si se escribiera en piedra.
export const RevealLine: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ overflow: "hidden", paddingTop: "0.06em" }}>
      <div
        style={{
          translate: interpolate(
            frame,
            [delay, delay + 18],
            ["0px 110%", "0px 0%"],
            { ...clamp, easing: easeOut },
          ),
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Salida común de cada placa: se apaga y sube un poco en los últimos frames.
export const PlateExit: React.FC<{
  children: React.ReactNode;
  frames?: number;
}> = ({ children, frames = 8 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const start = durationInFrames - frames;
  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(frame, [start, durationInFrames], [1, 0], {
          ...clamp,
          easing: easeIn,
        }),
        translate: interpolate(
          frame,
          [start, durationInFrames],
          ["0px 0px", "0px -40px"],
          { ...clamp, easing: easeIn },
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Etiqueta en JetBrains Mono, mayúsculas y tracking amplio.
export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({ children, color = colors.gold, delay = 0, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: fonts.label,
        fontSize: 32,
        letterSpacing: "0.32em",
        textTransform: "uppercase",
        color,
        opacity: interpolate(frame, [delay, delay + 12], [0, 1], clamp),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Marco fijo: firma arriba a la izquierda y contador de placa a la derecha.
export const Chrome: React.FC<{ index: number }> = ({ index }) => (
  <AbsoluteFill
    style={{
      padding: "150px 90px",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    }}
  >
    <Label color={colors.cream} style={{ opacity: 0.55 }}>
      Edwin Adolfo
    </Label>
    <Label color={colors.cream} style={{ opacity: 0.55 }}>
      {String(index).padStart(2, "0")} / 04
    </Label>
  </AbsoluteFill>
);
