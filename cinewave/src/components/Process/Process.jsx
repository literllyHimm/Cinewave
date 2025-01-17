import { useContext } from "react";
import "./Process.scss";
import { SharedContext } from "../../SharedContext";
import { BiErrorAlt } from "react-icons/bi";
import { BsFillCheckCircleFill } from "react-icons/bs";

function Process() {
  const { processing } = useContext(SharedContext);
  let msg = null;

  switch (processing.success) {
    case true:
      msg = "Success";
      break;
    case false:
      msg = "Error";
      break;
    default:
      msg = "Processing...";
  }

  return (
    <div className="process">
      {processing.started && (
        <>
          {processing.success === true && (
            <BsFillCheckCircleFill
              className={`icon ${processing.success && "success"}`}
            />
          )}
          {processing.success === false && (
            <BiErrorAlt className={`icon ${!processing.success && "error"}`} />
          )}

          {processing.success !== true && processing.success !== false && (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}

          {msg}
        </>
      )}
    </div>
  );
}

export default Process;
