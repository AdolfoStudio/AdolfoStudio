import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { PlateExit } from "../components";
import { clamp, colors, easeOut, fonts } from "../theme";

// Placa 3 (6–8,5 s): el remate. Cae de golpe con el impacto de audio,
// se asienta en 10 frames y luego respira apenas.
export const Placa3Remate: React.FC = () => {
  const frame = useCurrentFrame();
  const line: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: 172,
    lineHeight: 0.9,
    color: colors.gold,
    whiteSpace: "nowrap",
  };

  return (
    <PlateExit>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 90px",
          transformOrigin: "90px 50%",
          opacity: interpolate(frame, [0, 3], [0, 1], clamp),
          scale: interpolate(frame, [0, 10, 75], [1.14, 1, 1.025], {
            ...clamp,
            easing: easeOut,
          }),
          textShadow: "0 0 80px rgba(212, 160, 23, 0.22)",
        }}
      >
        <div
          style={{
            height: 8,
            width: 160,
            marginBottom: 56,
            backgroundColor: colors.gold,
          }}
        />
        <div style={line}>Sin estrategia</div>
        <div style={line}>no hay</div>
        <div style={{ ...line, fontSize: 318, lineHeight: 0.92 }}>
          paraíso.
        </div>
      </AbsoluteFill>
    </PlateExit>
  );
};
