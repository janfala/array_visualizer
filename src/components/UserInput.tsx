import { FormEventHandler } from "react";

type userProps = {
  handleInputs: FormEventHandler;
  size: number;
};

const UserInput = ({ handleInputs, size }: userProps) => {
  return (
    <div>
      <h3>Input array size</h3>
      <p>{size}</p>
      <form onSubmit={(event) => handleInputs(event)}>
        <input
          type="range"
          name="size"
          placeholder="150"
          onChange={(event) => handleInputs(event)}
          required
          max={300}
          min={10}
          defaultValue={size}
        />
        <select name="algorithm" defaultValue={"bubble"} onChange={(event) => handleInputs(event)}>
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
      </form>
    </div>
  );
};

export default UserInput;
