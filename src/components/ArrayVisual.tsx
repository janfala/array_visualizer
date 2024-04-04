import { useEffect, useState } from "react";

type ArrayProps = {
  size: number;
  algorithm: string;
};

const ArrayVisual = ({ size, algorithm }: ArrayProps) => {
  const [arr, setArr] = useState<number[]>([]);
  const [curBar, setCurBar] = useState<number>(); // index of cursor
  const [sortedPart, setSortedPart] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState<boolean>(false);

  let audioCtx: any = null; // for sound

  useEffect(() => {
    resetSortedPart();
    setArr(genRandomValues(size));
    resetCurBar();
  }, [size]);

  function genRandomValues(size: number): number[] {
    const set = new Set<number>();

    while (set.size !== size) {
      const rndmVal = Math.random();
      set.add(rndmVal);
    }

    return Array.from(set);
  }

  async function bubbleSort() {
    const array = [...arr];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        setCurBar(j);

        await new Promise((resolve) => setTimeout(resolve, 25));

        playNote(200 + array[i] * 500);
        playNote(200 + array[j] * 500);

        if (array[j] > array[j + 1]) {
          let tmp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = tmp;
          setArr([...array]);
        }
      }
    }
  }

  async function insertionSort(): Promise<any> {
    const array = [...arr];

    for (let i = 1; i < array.length; i++) {
      let currentValue = array[i];
      let j;

      for (j = i - 1; j >= 0 && array[j] > currentValue; j--) {
        array[j + 1] = array[j];
        setCurBar(j);

        await new Promise((resolve) => setTimeout(resolve, 25));

        playNote(200 + array[i] * 500);
        playNote(200 + array[j] * 500);
      }
      array[j + 1] = currentValue;
      setArr([...array]);
    }
  }

  async function playEndAnimation() {
    const sortedArr = [...arr];
    const sortedIdxs = new Set(sortedPart);

    for (let i = sortedArr.length - 1; i >= 0; i--) {
      playNote(200 + sortedArr[i] * 500);
      await new Promise((resolve) => setTimeout(resolve, 25));
      sortedIdxs.add(i);
      setCurBar(i);
      setSortedPart(sortedIdxs);
    }

    setIsRunning(false);
  }

  async function handleSort() {
    if (sortedPart.size === arr.length) {
      alert("Array is already sorted!");
      return;
    }

    setIsRunning(true);

    if (algorithm === "bubble") {
      await bubbleSort();
    } else if (algorithm === "insertion") {
      await insertionSort();
    }
  }

  function handleNewArray() {
    resetSortedPart();
    setArr(genRandomValues(size));
    resetCurBar();
  }

  function resetCurBar() {
    setCurBar(-1); // will never show
  }

  function resetSortedPart() {
    setSortedPart(new Set());
  }

  // i stole this from https://www.youtube.com/watch?v=_AwSlHlpFuc
  function playNote(freq: number) {
    if (audioCtx === null) {
      audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }

    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
  }

  return (
    <>
      {isRunning ? (
        <>
          <button disabled>Start Sorting!</button>
          <button disabled>Generate new Array</button>
        </>
      ) : (
        <>
          {size !== 0 && (
            <button
              onClick={async () =>
                await handleSort()
                  .then(playEndAnimation)
                  .catch((err) => console.log(err.message))
              }
            >
              Start Sorting!
            </button>
          )}
          {size !== 0 && <button onClick={() => handleNewArray()}>Generate new Array</button>}
        </>
      )}
      <div className="arrContainer">
        {size !== 0 &&
          arr.map((val, idx) => (
            <div
              key={idx}
              className={idx === curBar ? "cursor bar" : "bar normal"}
              style={
                sortedPart.has(idx)
                  ? { height: `${val * 100}%`, backgroundColor: "green" }
                  : { height: `${val * 100}%` }
              }
            ></div>
          ))}
      </div>
    </>
  );
};

export default ArrayVisual;
