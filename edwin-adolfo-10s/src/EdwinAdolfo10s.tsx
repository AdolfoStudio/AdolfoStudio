import { Audio } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Sequence, staticFile, useVideoConfig } from "remotion";
import { Background, Chrome } from "./components";
import { Placa1Hook } from "./scenes/Placa1Hook";
import { Placa2Tension } from "./scenes/Placa2Tension";
import { Placa3Remate } from "./scenes/Placa3Remate";
import { Placa4Cierre } from "./scenes/Placa4Cierre";
import { PLATES } from "./theme";

export const EdwinAdolfo10s: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <Background />

      <Sequence
        name="Placa 1 · Hook"
        from={PLATES.hook.from}
        durationInFrames={PLATES.hook.duration}
      >
        <Chrome index={1} />
        <Placa1Hook />
      </Sequence>

      <Sequence
        name="Placa 2 · Tensión"
        from={PLATES.tension.from}
        durationInFrames={PLATES.tension.duration}
      >
        <Chrome index={2} />
        <Placa2Tension />
      </Sequence>

      <Sequence
        name="Placa 3 · Remate"
        from={PLATES.remate.from}
        durationInFrames={PLATES.remate.duration}
      >
        <Chrome index={3} />
        <Placa3Remate />
      </Sequence>

      <Sequence
        name="Placa 4 · Cierre"
        from={PLATES.cierre.from}
        durationInFrames={PLATES.cierre.duration}
      >
        <Placa4Cierre />
      </Sequence>

      {/* Audio: cama musical durante todo el video */}
      <Audio name="Pulso grave" src={staticFile("pulse-bed.wav")} volume={0.85} />

      {/* Cambio 1 → 2: whoosh (pico a 0,45 s del archivo) + golpe seco en el corte */}
      <Audio
        name="Whoosh 1→2"
        src={staticFile("whoosh.wav")}
        from={PLATES.tension.from - Math.round(0.45 * fps)}
        volume={0.5}
      />
      <Audio
        name="Golpe 1→2"
        src={staticFile("hit.wav")}
        from={PLATES.tension.from}
        volume={0.35}
      />

      {/* Remate: subida + impacto; el golpe cae a 0,8 s del archivo */}
      <Audio
        name="Impacto remate"
        src={staticFile("impact.wav")}
        from={PLATES.remate.from - Math.round(0.8 * fps)}
        volume={1}
      />

      {/* Cambio 3 → 4: whoosh + golpe seco */}
      <Audio
        name="Whoosh 3→4"
        src={staticFile("whoosh.wav")}
        from={PLATES.cierre.from - Math.round(0.45 * fps)}
        volume={0.7}
      />
      <Audio
        name="Golpe 3→4"
        src={staticFile("hit.wav")}
        from={PLATES.cierre.from}
        volume={0.7}
      />
    </AbsoluteFill>
  );
};
