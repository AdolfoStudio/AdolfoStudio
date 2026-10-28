import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Label, RevealLine } from "../components";
import { clamp, colors, easeOut, fonts } from "../theme";

// Isotipo oficial de Adolfo Studio (extraído de la web, public/adolfo-studio-mark.svg),
// redibujado inline para poder trazarlo. Mismo dibujo, dorado del brief.
const MARK_CIRCLES = [
  { r: 15, w: 0.8 },
  { r: 7, w: 0.6 },
];
const MARK_LINES = [
  [16, 1, 16, 9, 0.8],
  [16, 23, 16, 31, 0.8],
  [1, 16, 9, 16, 0.8],
  [23, 16, 31, 16, 0.8],
  [3.9, 3.9, 9.2, 9.2, 0.6],
  [22.8, 22.8, 28.1, 28.1, 0.6],
  [28.1, 3.9, 22.8, 9.2, 0.6],
  [9.2, 22.8, 3.9, 28.1, 0.6],
];

const AdolfoStudioMark: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const draw = (start: number, end: number) =>
    interpolate(frame, [start, end], [1, 0], { ...clamp, easing: easeOut });

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {MARK_CIRCLES.map(({ r, w }, i) => (
        <circle
          key={r}
          cx="16"
          cy="16"
          r={r}
          stroke={colors.gold}
          strokeWidth={w}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={draw(i * 3, 16 + i * 3)}
          transform="rotate(-90 16 16)"
        />
      ))}
      {MARK_LINES.map(([x1, y1, x2, y2, w], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={colors.gold}
          strokeWidth={w}
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={draw(8 + i, 18 + i)}
        />
      ))}
    </svg>
  );
};

// Placa 4 (8,5–10 s): cierre. Isotipo trazado, firma en Bebas, etiqueta
// en mono y una pregunta que abre conversación.
export const Placa4Cierre: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{ justifyContent: "center", alignItems: "center", padding: "0 90px" }}
    >
      <AdolfoStudioMark size={150} />
      <RevealLine
        delay={4}
        style={{
          fontFamily: fonts.display,
          fontSize: 196,
          lineHeight: 0.95,
          color: colors.cream,
          letterSpacing: "0.02em",
          marginTop: 48,
          textAlign: "center",
        }}
      >
        Edwin Adolfo
      </RevealLine>
      <Label
        delay={10}
        style={{
          marginTop: 24,
          fontSize: 30,
          letterSpacing: "0.36em",
          // compensa el tracking final para que quede centrada
          paddingLeft: "0.36em",
        }}
      >
        Estrategia · Marca · Madrid
      </Label>
      <div
        style={{
          width: 120,
          height: 2,
          marginTop: 72,
          marginBottom: 56,
          backgroundColor: colors.cream,
          opacity: 0.35,
          scale: `${interpolate(frame, [12, 24], [0, 1], {
            ...clamp,
            easing: easeOut,
          })} 1`,
        }}
      />
      <div
        style={{
          fontFamily: fonts.quote,
          fontStyle: "italic",
          fontSize: 72,
          lineHeight: 1.15,
          color: colors.cream,
          textAlign: "center",
          opacity: interpolate(frame, [16, 26], [0, 1], clamp),
          translate: interpolate(frame, [16, 28], ["0px 24px", "0px 0px"], {
            ...clamp,
            easing: easeOut,
          }),
        }}
      >
        ¿Y la tuya,
        <br />
        qué problema tiene?
      </div>
    </AbsoluteFill>
  );
};
