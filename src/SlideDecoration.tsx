import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { LinearProgressBar, LinearProgressBarInterface } from "./widgets/LinearProgressBar";
import DockedPanel from "./widgets/DockedPanel";

interface SlideDecorationInterface {
  resetTimer(durationSec: number): void;
}

const SlideDecoration = forwardRef<SlideDecorationInterface>(
  function SlideDecoration(_props, ref) : JSX.Element {
    const refProgressBar = useRef<LinearProgressBarInterface>(null);
    // Start and end time in milliseconds.
    const [timeInterval, setTimeInterval] = useState<[number, number]>([0,0]);
  
    let handleInterval: number | null = null;

    useImperativeHandle(ref, () => ({
      resetTimer(durationSec: number): void {
        const nowMilli = (new Date()).getTime();
        const nowSec = (nowMilli / 1000)|0;
        const endMilli = (nowSec + durationSec) * 1000;
        setTimeInterval([nowMilli, endMilli]);
      }
    }) as SlideDecorationInterface, []);

    useEffect(() => {
      const enable = (timeInterval[0] > 0);
      resetTimer(enable);
      return () => { if (enable) resetTimer(false); };
    }, [timeInterval]);

    const resetTimer = (enable: boolean) => {
      if (handleInterval !== null) {
        window.clearInterval(handleInterval);
      }
      if (enable) {
        handleInterval = window.setInterval(tick, 200);
      }
    };
  
    const tick = () => {
      const [startMilli, endMilli] = timeInterval;
      const nowMilli = (new Date()).getTime();
      const percent = (100.0 * (endMilli - nowMilli) / (endMilli - startMilli));
      refProgressBar.current?.setProgress(percent);
      if (percent < 0) {
        resetTimer(false);
      }
    };

    return (
      <>
        <DockedPanel hdir="end" vdir="end">
          <div className="bg-slate-900 bg-opacity-40 p-2 ">
            <LinearProgressBar ref={refProgressBar}/>
          </div>
        </DockedPanel>
      </>
    );
  });


export { SlideDecoration, type SlideDecorationInterface };
