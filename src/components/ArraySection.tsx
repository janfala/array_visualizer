import { useState } from "react";
import ArrayAlgorithms from "./ArrayAlgorithms";

type ArrayProps = {
  size: number;
  algorithm: string;
};

// I use this so that i can make ArrayVisual smaller (there is probably a way better way to do this)
const ArraySection = ({ size, algorithm }: ArrayProps) => {
  const [isAudio, setIsAudio] = useState<boolean>(true);

  const SORTING_DELAY = 25; // TODO this should be dependend on arr size -> larger array -> shorter delay
  const AUDIO_DURATION = 0.15;

  let audioCtx: any = null; // for sound

  async function sleep(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, SORTING_DELAY));
  }

  async function delayAndNotes(vals: number[]): Promise<void> {
    await sleep();
    if (!isAudio) return;

    vals.forEach((val) => playNote(200 + val * 500));
  }

  // I stole this from https://www.youtube.com/watch?v=_AwSlHlpFuc
  // It sounds worse for me, but i don't want to break my speakers my changing these values too much
  function playNote(freq: number): void {
    if (audioCtx === null) {
      audioCtx = new (AudioContext || AudioContext || window.AudioContext)();
    }

    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + AUDIO_DURATION);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + AUDIO_DURATION);
    osc.connect(node);
    node.connect(audioCtx.destination);
  }

  return (
    <>
      <ArrayAlgorithms
        size={size}
        algorithm={algorithm}
        delayAndNotes={delayAndNotes}
        sleep={sleep}
        isAudio={isAudio}
        setIsAudio={setIsAudio}
      />
    </>
  );
};

export default ArraySection;
