import { useEffect, useState } from "react";

type ArrayProps = {
  size: number;
  algorithm: string;
};

// On my next project I should think about the differnt components before starting to code, so files like this one don't happen
const ArrayVisual = ({ size, algorithm }: ArrayProps) => {
  const [arr, setArr] = useState<number[]>([]);

  // indicies to visualize whats happening
  const [curBar, setCurBar] = useState<number | Set<number>>(-1); // -1 will never be shown
  const [comparing, setComparing] = useState<number | Set<number>>(-1);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAudio, setIsAudio] = useState<boolean>(true);

  const SORTING_DELAY = 25; // TODO maybe this should be dependend on arr size -> larger array -> shorter delay
  const AUDIO_DURATION = 0.15;

  let audioCtx: any = null; // for sound

  useEffect(() => {
    handleNewArray();
  }, [size]);

  function genRandomValues(size: number): number[] {
    const set = new Set<number>();

    // want no duplicates in my array
    while (set.size !== size) {
      const rndmVal = Math.random();
      set.add(rndmVal);
    }

    return Array.from(set);
  }

  async function bubbleSort(): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - 1 - i; j++) {
        await delayAndNotes([arr[j], arr[j + 1]]);

        setCurBar(j);
        setComparing(j + 1);

        if (arr[j] > arr[j + 1]) {
          let tmp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = tmp;
        }
      }
    }
  }

  async function insertionSort(): Promise<void> {
    for (let i = 1; i < arr.length; i++) {
      setComparing(i);
      let currentValue = arr[i];
      let j;

      for (j = i - 1; j >= 0 && arr[j] > currentValue; j--) {
        await delayAndNotes([arr[i], arr[j + 1]]);
        setCurBar(j);
        arr[j + 1] = arr[j];
      }

      arr[j + 1] = currentValue;
    }
  }

  async function selectionSort(): Promise<void> {
    for (let i = 0; i < arr.length; i++) {
      let lowest = i;

      for (let j = i + 1; j < arr.length; j++) {
        await delayAndNotes([arr[i], arr[j]]);
        setCurBar(j);

        if (arr[j] < arr[lowest]) {
          lowest = j;
          setComparing(j);
        }
      }

      if (lowest !== i) {
        const tmp = arr[i];
        arr[i] = arr[lowest];
        arr[lowest] = tmp;
      }
    }
  }

  // was struggling because of the recursion, so I stole this with a helper method from here:
  // https://github.com/clementmihailescu/Sorting-Visualizer-Tutorial/blob/master/src/sortingAlgorithms/sortingAlgorithms.js.
  async function mergeSort(): Promise<void> {
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
  ): Promise<void> {
    await sleep();

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
  ): Promise<void> {
    let k = startIdx;
    let i = startIdx;
    let j = middleIdx + 1;

    while (i <= middleIdx && j <= endIdx) {
      await sleep();

      if (auxiliaryArray[i] <= auxiliaryArray[j]) {
        insertValueAtIndex(auxiliaryArray[i], k);
        mainArray[k++] = auxiliaryArray[i++];
      } else {
        insertValueAtIndex(auxiliaryArray[j], k);
        mainArray[k++] = auxiliaryArray[j++];
      }

      changeVisualSets(startIdx, endIdx, false);
      setCurBar(k);
      delayAndNotes([auxiliaryArray[i], auxiliaryArray[j]]);
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
    arr.slice(0);

    await quickSortHelper(arr, 0, arr.length - 1);
  }

  async function quickSortHelper(array: number[], start: number, end: number): Promise<void> {
    if (start >= end) {
      return;
    }
    let pivot = start,
      left = start + 1,
      right = end;

    delayAndNotes([array[left], array[right]]);
    changeVisualSets(left, right, false);
    setCurBar(pivot);

    while (right >= left) {
      await sleep();

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

      changeVisualSets(left, right, true);
      setComparing(pivot);

      delayAndNotes([array[left], array[right]]);
    }

    if (pivot !== right) {
      let temp = array[right];
      array[right] = array[pivot];
      array[pivot] = temp;

      delayAndNotes([array[pivot], array[right]]);
    }

    await quickSortHelper(array, start, right - 1);
    await quickSortHelper(array, right + 1, end);
  }

  async function changeVisualSets(idx1: number, idx2: number, isCursor: boolean): Promise<void> {
    resetCursors();

    let bars = new Set<number>();
    bars.add(idx1);
    bars.add(idx2);

    isCursor ? setCurBar(bars) : setComparing(bars);
  }

  async function insertValueAtIndex(value: number, idx: number): Promise<void> {
    await sleep();
    arr[idx] = value;
  }

  async function playEndAnimation(): Promise<void> {
    await sleep();
    resetCursors();

    let sortedSet: Set<number> = new Set();
    setComparing(sortedSet);

    for (let i = 0; i < arr.length; i++) {
      await delayAndNotes([arr[i]]);

      setCurBar(i + 1);
      sortedSet.add(i);
    }

    setIsRunning(false);
  }

  function isArrSorted(): boolean {
    // Check if comparing is neither a Set(-> after playEndAnimation()) or !-1 (at start or after a reset)
    if (!(comparing instanceof Set) && comparing !== -1) {
      alert("Something went wrong, sorry!");
      handleNewArray();
      return false;
    }

    // could technically be undefined
    if (comparing instanceof Set && comparing.size === arr.length) {
      return true;
    }

    return false;
  }

  async function handleSort(): Promise<void> {
    if (isArrSorted()) {
      alert("Array is already sorted");
      return;
    }

    setIsRunning(true);

    await visualizeAlgorithm();
    await playEndAnimation();
  }

  async function visualizeAlgorithm(): Promise<void> {
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
      case "bubble":
        await bubbleSort();
        break;
      default:
        throw new Error(`Unknown algorithm: ${algorithm}`);
    }
  }

  function handleNewArray(): void {
    resetCursors();
    setArr(genRandomValues(size));
  }

  function resetCursors(): void {
    // -1 will never shown
    setCurBar(-1);
    setComparing(-1);
  }

  function handleSound(): void {
    isAudio ? setIsAudio(false) : setIsAudio(true);
  }

  async function sleep() {
    await new Promise((resolve) => setTimeout(resolve, SORTING_DELAY));
  }

  async function delayAndNotes(vals: number[]): Promise<void> {
    await sleep();
    if (!isAudio) return;

    vals.forEach((val) => playNote(200 + val * 500));
  }

  // I stole this from https://www.youtube.com/watch?v=_AwSlHlpFuc
  // It sounds worse for me, but i don't want to brek my speakers my changing these values too much
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
          {size !== 0 && <button onClick={handleNewArray}>Generate new Array</button>}
          {size !== 0 && (
            <label className="switch">
              <input type="checkbox" className="soundToggle" onChange={handleSound} defaultChecked />
              <span>Sound</span>
            </label>
          )}
        </>
      )}
      <div className="arrContainer">
        {size !== 0 &&
          arr.map((val, idx) => (
            <div
              key={idx}
              className={
                (typeof curBar === "number" && idx === curBar) || (curBar instanceof Set && curBar.has(idx))
                  ? "bar cursor"
                  : "bar normal"
              }
              style={
                (typeof comparing === "number" && idx === comparing) || (comparing instanceof Set && comparing.has(idx))
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
