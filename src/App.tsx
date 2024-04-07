import UserInput from "./components/UserInput";
import ArrayVisual from "./components/ArrayVisual";
import { useState } from "react";

function App() {
  const [size, setSize] = useState<number>(0);
  const [algorithm, setAlgorithm] = useState<string>("");

  function handleInputs(e: SubmitEvent | any): void {
    e.preventDefault();

    let inputSize: number;
    let inputAlgo: string;

    // I am probably doing this wrong lol (wanted to submit form onChange of <select>)
    if (e.type === "submit") {
      inputSize = e.target.elements["size"].valueAsNumber;
      inputAlgo = e.target.elements["algorithm"].value;
    } else {
      inputSize = e.target.form.elements["size"].valueAsNumber;
      inputAlgo = e.target.form.elements["algorithm"].value;
    }

    if (inputSize > 300) {
      alert("Max size is 300");
      return;
    }

    if (!inputSize || !inputAlgo) {
      return;
    }

    changeState(inputSize, inputAlgo);
  }

  // maybe useful in future
  function changeState(size: number, algo: string): void {
    setSize(size);
    setAlgorithm(algo);
  }

  return (
    <>
      <UserInput handleInputs={handleInputs} />
      <ArrayVisual size={size} algorithm={algorithm} />
    </>
  );
}

export default App;
