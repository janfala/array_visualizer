import { useEffect, useState } from "react";

type ArrayProps = {
  size: number;
  algorithm: string;
};

const ArrayVisual = ({ size, algorithm }: ArrayProps) => {
  const [arr, setArr] = useState<number[]>([]);
  const [curBar, setCurBar] = useState<number>(); // index of cursor
  const [comparing, setComparing] = useState<number | Set<number>>(); // to visualize further parts (e.g.: ranges of subarray in merge sort)

  const [sortedPart, setSortedPart] = useState<Set<number>>(new Set());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAudio, setIsAudio] = useState<boolean>(false);

  const delay = 25;
  let audioCtx: any = null; // for sound

  useEffect(() => {
    resetSortedPart();
    setArr(genRandomValues(size));
    resetCursors();
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
        await delayAndNotes([arr[i], arr[j]]);

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
        await delayAndNotes([array[i], array[j]]);

        array[j + 1] = array[j];

        setComparing(j);
        setCurBar(i);
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
        await delayAndNotes([array[i], array[j]]);

        setCurBar(j);

        if (array[j] < array[lowest]) {
          setComparing(j);
          lowest = j;
        }

        setArr([...array]);
      }
      if (lowest !== i) {
        const tmp = array[i];
        array[i] = array[lowest];
        array[lowest] = tmp;
      }
    }
  }

  // was really struggling to figure out how to animate the indicies with merge sort, because of the recursion, so I stole an algo with helper method from here:
  // https://github.com/clementmihailescu/Sorting-Visualizer-Tutorial/blob/master/src/sortingAlgorithms/sortingAlgorithms.js.
  async function mergeSort() {
    let array = [...arr];

    if (array.length <= 1) {
      return;
    }

    const auxiliaryArray = array.slice();
    await mergeSortHelper(array, 0, array.length - 1, auxiliaryArray);
  }

  async function mergeSortHelper(
    mainArray: Array<number>,
    startIdx: number,
    endIdx: number,
    auxiliaryArray: Array<number>
  ) {
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (startIdx === endIdx) {
      return;
    }

    const middleIdx = Math.floor((startIdx + endIdx) / 2);
    await mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray);
    await mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray);
    await doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray);
  }

  async function doMerge(
    mainArray: Array<number>,
    startIdx: number,
    middleIdx: number,
    endIdx: number,
    auxiliaryArray: Array<number>
  ) {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        insertValueAtIndex(auxiliaryArray[i], k);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        insertValueAtIndex(auxiliaryArray[j], k);
        mainArray[k++] = auxiliaryArray[j++];
      }

      changeComparingSet(startIdx, endIdx);
      setCurBar(k);
      delayAndNotes([auxiliaryArray[i], auxiliaryArray[j]]).catch((rej) => console.log(rej));
    }
    while (i <= middleIdx) {
      mainArray[k] = auxiliaryArray[i];
      insertValueAtIndex(auxiliaryArray[i++], k);
      setCurBar(k++);
    }
    while (j <= endIdx) {
      mainArray[k] = auxiliaryArray[j];
      insertValueAtIndex(auxiliaryArray[j++], k);
      setCurBar(k++);
    }
  }

  async function quickSort(): Promise<void> {
    let array = [...arr];
    array.slice(0);

    await quickSortHelper(array, 0, array.length - 1);
  }

  async function quickSortHelper(array: number[], start: number, end: number) {
    if (start >= end) {
      return;
    }
    let pivot = start,
      left = start + 1,
      right = end;

    delayAndNotes([array[left], array[right]]);
    changeComparingSet(left, right);
    setCurBar(pivot);

    while (right >= left) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      if (array[right] < array[pivot] && array[left] > array[pivot]) {
        let temp = array[right];
        array[right] = array[left];
        array[left] = temp;
      }
      if (array[right] >= array[pivot]) {
        right--;
      }
      if (array[left] <= array[pivot]) {
        left++;
      }

      setCurBar(pivot);
      changeComparingSet(left, right); // i mean you are comparing to the pivot value i guess

      delayAndNotes([array[left], array[right]]);
      setArr([...array]);
    }

    if (pivot !== right) {
      let temp = array[right];
      array[right] = array[pivot];
      array[pivot] = temp;

      setArr([...array]);
      delayAndNotes([array[pivot], array[right]]);
    }
    await quickSortHelper(array, start, right - 1);
    await quickSortHelper(array, right + 1, end);
  }

  async function changeComparingSet(idx1: number, idx2: number) {
    setComparing(-1);

    let bars = new Set<number>();
    bars.add(idx1);
    bars.add(idx2);
    setComparing(bars);
  }

  async function insertValueAtIndex(value: number, idx: number) {
    const array = arr;
    array[idx] = value;
    await new Promise((resolve) => setTimeout(resolve, delay));
    setArr([...array]);
  }

  async function playEndAnimation() {
    const sortedArr = [...arr];
    const sortedIdxs = new Set(sortedPart);

    setComparing(-1); // reset comparing

    for (let i = sortedArr.length - 1; i >= 0; i--) {
      await delayAndNotes([sortedArr[i]]);

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

    switch (algorithm) {
      case "quick":
        await quickSort();
        break;
      case "insertion":
        await insertionSort();
        break;
      case "selection":
        await selectionSort();
        break;
      case "merge":
        await mergeSort();
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }

    await playEndAnimation();
  }

  async function delayAndNotes(vals: number[]) {
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (!isAudio) return;

    for (let i = 0; i < vals.length; i++) {
      playNote(200 + vals[i] * 500);
    }
  }

  function handleNewArray() {
    resetSortedPart();
    setArr(genRandomValues(size));
    resetCursors();
  }

  function resetCursors() {
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

    const dur = 0.3;
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

  function handleSound() {
    isAudio ? setIsAudio(false) : setIsAudio(true);
  }

  return (
    <>
      {isRunning ? (
        <>
          <button disabled>Start Sorting!</button>
          <button disabled>Generate new Array</button>
          <label className="switch">
            <input type="checkbox" className="soundToggle" disabled />
            <span>Sound</span>
          </label>
        </>
      ) : (
        <>
          {size !== 0 && (
            <button onClick={async () => await handleSort().catch((err) => console.log(err.message))}>
              Start Sorting!
            </button>
          )}
          {size !== 0 && <button onClick={() => handleNewArray()}>Generate new Array</button>}
          <label className="switch">
            <input type="checkbox" className="soundToggle" onChange={handleSound} />
            <span>Sound</span>
          </label>
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
                  : typeof comparing === "number"
                  ? idx === comparing // I am so sorry this is so ugly
                    ? { height: `${val * 100}%`, backgroundColor: "greenyellow" }
                    : { height: `${val * 100}%` }
                  : comparing?.has(idx)
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
