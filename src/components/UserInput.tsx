import { FormEventHandler } from "react";

type userProps = {
  handleSizing: FormEventHandler;
};

const UserInput = ({ handleSizing }: userProps) => {
  return (
    <div>
      <h3>Input array size</h3>
      <form onSubmit={handleSizing}>
        <input type="number" name="size" placeholder="150" required />
        <select name="algorithm">
          <option value="bubble">Bubble Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="merge">Merge Sort</option>
        </select>
        <button>Confirm Settings</button>
      </form>
    </div>
  );
};

export default UserInput;
