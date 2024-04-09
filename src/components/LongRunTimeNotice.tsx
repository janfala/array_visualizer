import { MouseEventHandler } from "react";

type NoticeProps = {
  handleNoticeDisplay: MouseEventHandler<HTMLElement>;
};

const LongRuntimeNotice = ({ handleNoticeDisplay }: NoticeProps) => {
  const preferredAlgosForLargeSize = ["merge", "quick"]; // not a set so i can map
  return (
    <>
      <p>
        This algorithm might take a long time for your input size.
        <br />
        Feel free to try it out anyway, otherwise you could try a differnt algorithm or lower your input size
        <br />
        Better options for larger sizes might be:
      </p>
      <div className="algorithmSuggestions">
        {preferredAlgosForLargeSize.map((algorithmPrefix, idx) => (
          <p key={idx} className="suggestedAlgorithm">
            {algorithmPrefix.charAt(0).toUpperCase() + algorithmPrefix.slice(1) + "Sort"}
          </p>
        ))}
        <button onClick={handleNoticeDisplay}>Don't show again</button>
      </div>
    </>
  );
};

export default LongRuntimeNotice;
