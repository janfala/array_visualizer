import { FormEventHandler } from "react";

type userProps = {
  handleInputs: FormEventHandler;
};

const UserInput = ({ handleInputs }: userProps) => {
  return (
    <div>
      <h3>Input array size</h3>
      <form onSubmit={(event) => handleInputs(event)}>
        <input type="number" name="size" placeholder="150" required onChange={(event) => handleInputs(event)} />
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
