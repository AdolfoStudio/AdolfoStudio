import { Composition } from "remotion";
import { EdwinAdolfo10s } from "./EdwinAdolfo10s";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="EdwinAdolfo10s"
      component={EdwinAdolfo10s}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
