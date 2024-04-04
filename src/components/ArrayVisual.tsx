import { useEffect, useState } from "react";

type ArrayProps = {
  size: number;
  algorithm: string;
};

const ArrayVisual = ({ size, algorithm }: ArrayProps) => {
  const [arr, setArr] = useState<number[]>([]);
  const [curBar, setCurBar] = useState<number>(); // index of cursor
  const [comparing, setComparing] = useState<number>();

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
        await delayAndNotes(arr[i], arr[j], 25);

        setCurBar(j);
        setComparing(j + 1);

        if (array[j] > array[j + 1]) {
          let tmp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = tmp;
          setArr([...array]);
        }
      }
    }
  }

  async function insertionSort() {
    const array = [...arr];

    for (let i = 1; i < array.length; i++) {
      let currentValue = array[i];
      let j;

      for (j = i - 1; j >= 0 && array[j] > currentValue; j--) {
        await delayAndNotes(array[i], array[j], 25);

        array[j + 1] = array[j];

        setComparing(j);
        setCurBar(j + 1);
      }

      array[j + 1] = currentValue;
      setArr([...array]);
    }
  }

  async function selectionSort() {
    const array = [...arr];

    for (let i = 0; i < array.length; i++) {
      let lowest = i;

      for (let j = i + 1; j < array.length; j++) {
        await delayAndNotes(array[i], array[j], 25);

        setCurBar(j);

        if (array[j] < array[lowest]) {
          setComparing(j);
          lowest = j;
        }

        setArr([...array]);
      }
      if (lowest !== i) {
        // Swap
        [array[i], array[lowest]] = [array[lowest], array[i]];
      }
    }
  }

  async function playEndAnimation() {
    const sortedArr = [...arr];
    const sortedIdxs = new Set(sortedPart);
    setComparing(-1);

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

    // might change to switch later
    if (algorithm === "bubble") {
      await bubbleSort();
    } else if (algorithm === "insertion") {
      await insertionSort();
    } else if (algorithm === "selection") {
      await selectionSort();
    }

    playEndAnimation();
  }

  async function delayAndNotes(firstVal: number, secondVal: number, timeAmount: number) {
    await new Promise((resolve) => setTimeout(resolve, timeAmount));

    playNote(200 + firstVal * 500);
    playNote(200 + secondVal * 500);
  }

  function handleNewArray() {
    resetSortedPart();
    setArr(genRandomValues(size));
    resetCurBar();
  }

  function resetCurBar() {
    setCurBar(-1); // will never show
    setComparing(-1);
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
            <button onClick={async () => await handleSort().catch((err) => console.log(err.message))}>
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
              className={idx === curBar ? "bar cursor" : "bar normal"}
              style={
                sortedPart.has(idx)
                  ? { height: `${val * 100}%`, backgroundColor: "green" }
                  : idx === comparing // I am so sorry this is so ugly
                  ? { height: `${val * 100}%`, backgroundColor: "greenyellow" }
                  : { height: `${val * 100}%` }
              }
            ></div>
          ))}
      </div>
    </>
  );
};

export default ArrayVisual;
