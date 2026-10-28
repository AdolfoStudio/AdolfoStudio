import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Label, PlateExit, RevealLine } from "../components";
import { clamp, colors, easeOut, fonts } from "../theme";

// Placa 2 (3–6 s): la tensión. La frase entra en cursiva y "RELEVANCIA"
// se comprime letra a letra hasta encajar, mientras todo se acerca despacio.
export const Placa2Tension: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <PlateExit>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          padding: "0 90px",
          transformOrigin: "90px 50%",
          scale: interpolate(frame, [0, 90], [1, 1.04], clamp),
        }}
      >
        <Label delay={0} style={{ marginBottom: 56 }}>
          El problema real
        </Label>
        <RevealLine
          delay={2}
          style={{
            fontFamily: fonts.quote,
            fontStyle: "italic",
            fontSize: 96,
            lineHeight: 1.1,
            color: colors.cream,
          }}
        >
          Tiene problema de
        </RevealLine>
        <div
          style={{
            fontFamily: fonts.display,
            fontSize: 220,
            lineHeight: 0.95,
            marginTop: 24,
            whiteSpace: "nowrap",
            color: colors.cream,
            opacity: interpolate(frame, [12, 24], [0, 1], clamp),
            letterSpacing: interpolate(frame, [12, 56], [0.3, 0], {
              ...clamp,
              easing: easeOut,
            }).toFixed(4) + "em",
          }}
        >
          relevancia.
        </div>
        <div
          style={{
            height: 8,
            marginTop: 18,
            width: 160,
            backgroundColor: colors.gold,
            transformOrigin: "left center",
            scale: `${interpolate(frame, [50, 66], [0, 1], {
              ...clamp,
              easing: easeOut,
            })} 1`,
          }}
        />
      </AbsoluteFill>
    </PlateExit>
  );
};
