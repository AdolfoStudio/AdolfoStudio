import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Label, PlateExit, RevealLine } from "../components";
import { clamp, colors, easeOut, fonts } from "../theme";

// Placa 1 (0–3 s): el hook. Las líneas suben una a una y una raya dorada
// tacha "VISIBILIDAD": ese no es el problema.
export const Placa1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const line: React.CSSProperties = {
    fontFamily: fonts.display,
    fontSize: 168,
    lineHeight: 0.92,
    color: colors.cream,
  };

  return (
    <PlateExit>
      <AbsoluteFill
        style={{ justifyContent: "center", padding: "0 90px", gap: 0 }}
      >
        <Label delay={0} style={{ marginBottom: 48 }}>
          Diagnóstico
        </Label>
        <RevealLine delay={4} style={line}>
          Tu marca
        </RevealLine>
        <RevealLine delay={10} style={line}>
          no tiene
        </RevealLine>
        <RevealLine delay={16} style={line}>
          problema de
        </RevealLine>
        <div style={{ position: "relative", alignSelf: "flex-start" }}>
          <RevealLine
            delay={24}
            style={{
              ...line,
              fontSize: 236,
              opacity: interpolate(frame, [58, 70], [1, 0.4], clamp),
            }}
          >
            visibilidad.
          </RevealLine>
          <div
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "50%",
              height: 12,
              backgroundColor: colors.gold,
              transformOrigin: "left center",
              scale: `${interpolate(frame, [52, 66], [0, 1], {
                ...clamp,
                easing: easeOut,
              })} 1`,
            }}
          />
        </div>
      </AbsoluteFill>
    </PlateExit>
  );
};
