import UserInput from "./components/UserInput";
import ArrayVisual from "./components/ArrayVisual";
import { useState } from "react";

function App() {
  const [size, setSize] = useState(0);
  const [algorithm, setAlgorithm] = useState("");

  function handleSizing(e: any): void {
    e.preventDefault();
    let inputSize: number = Number(e.target.elements["size"].value);
    let inputAlgo: string = e.target.elements["algorithm"].value;

    setSize(inputSize);
    setAlgorithm(inputAlgo);
  }

  return (
    <>
      <UserInput handleSizing={handleSizing} />
      <ArrayVisual size={size} algorithm={algorithm} />
    </>
  );
}

export default App;
