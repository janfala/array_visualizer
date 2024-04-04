import { useEffect, useState } from "react";

type ArrayProps = {
  size: number;
  algorithm: string;
};

const ArrayVisual = ({ size, algorithm }: ArrayProps) => {
  const [arr, setArr] = useState<number[]>([]);
  const [curBar, setCurBar] = useState(0);
  let key: number = 0;

  useEffect(() => {
    setArr(genRandomValues(size));
  }, [size]);

  function genRandomValues(size: number): number[] {
    let set = new Set<number>();

    while (set.size !== size) {
      let rndmVal = Math.floor(Math.random() * 1000) + 1;
      set.add(rndmVal);
    }

    return Array.from(set);
  }

  async function bubbleSort() {
    let array = [...arr];

    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - 1 - i; j++) {
        setCurBar(array[j]);
        await new Promise((resolve) => setTimeout(resolve, 5));
        if (array[j] > array[j + 1]) {
          let tmp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = tmp;
          setArr([...array]);
        }
      }
    }
  }

  async function handleSort() {
    if (algorithm === "bubble") {
      await bubbleSort();
    }
  }

  return (
    <>
      {size !== 0 && <button onClick={async () => await handleSort()}>Start Sorting!</button>}
      <div className="arrContainer">
        {size !== 0 &&
          arr.map((length) => (
            <div
              key={key++}
              className={length === curBar ? "cursor bar" : "bar normal"}
              style={{ height: length }}
            ></div>
          ))}
      </div>
    </>
  );
};

export default ArrayVisual;
