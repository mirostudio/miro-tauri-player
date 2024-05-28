import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface LinearProgressBarInterface {
  setProgress(percent: number): void;
}

const VaryingPart = forwardRef<LinearProgressBarInterface>(
  function VaryingPart(_props, ref) : JSX.Element {
    const [progressPercent, setProgressPercent] = useState<number>(0);

    useImperativeHandle(ref, () => ({
      setProgress(percent: number): void {
        const validated = Number.parseFloat(Math.min(Math.max(percent, 0), 100).toFixed(2));
        setProgressPercent(validated);
        if (validated !== progressPercent) {
          setProgressPercent(validated);
        }
      },
    }) as LinearProgressBarInterface, []);

    return (
      <>
        <rect x={0} y={-5} width={progressPercent} height={10} rx={2} ry={2} fill="#333355" />
        <text x={45} y={2} fontSize={7} fill="#EEEEEE">{progressPercent}%</text>
      </>
    );
  });

const LinearProgressBar = forwardRef<LinearProgressBarInterface>(
  function LinearProgressBar(_props, ref) : JSX.Element {
    const refVaryingPart = useRef<LinearProgressBarInterface>(null);

    useImperativeHandle(ref, () => ({
      setProgress(percent: number): void {
        refVaryingPart.current?.setProgress(percent);
      },
    }) as LinearProgressBarInterface, []);

    return (
      <svg viewBox="0 -5 100 10"
        style={{width: 200, height: 20}}>
        <rect x={0} y={-5} width={100} height={10} rx={2} ry={2} fill="#888888" />
        <VaryingPart ref={refVaryingPart}/>
      </svg>
    );
  });

export { LinearProgressBar, type LinearProgressBarInterface }
