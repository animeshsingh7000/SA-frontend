
import { Any } from "../../types/global.type";

export default function ProgressBar({
    name,
    totalNumber,  
    now,
    min,
    max,
    width,
    background
}: {
    name: string,
    totalNumber: Any,
    now: Any;
    min: Any;
    max: Any;
    width: Any;
    background: Any
}) {
  
  return (
    <div className="progress-txt">
        <div className="name-with-number">
            <div className="name">{name}</div>
            <div className="number">{now}</div>
        </div>
        <div className="progress">
            <div
            className="progress-bar"
            role="progressbar"
            aria-valuenow={now}
            aria-valuemin={min}
            aria-valuemax={max}
            style={{ 
                maxWidth: width+"%",
                background: background
            }}
            >
                <span className="title"></span>
            </div>
        </div>
    </div>
  );
}
