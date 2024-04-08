type ArrayProps = {
  size: number;
  arr: number[];
  comparing: number | Set<number>;
  curBar: number | Set<number>;
};

const DrawArray = ({ size, arr, comparing, curBar }: ArrayProps) => {
  return (
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
  );
};

export default DrawArray;
