

import { useEffect, useRef, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { Event as TauriEvent } from '@tauri-apps/api/event'
import CenteredCard from "./widgets/CenteredCard";

function LogViewerSlide() : JSX.Element {
  const paperRef = useRef<HTMLDivElement>(null);

  const beEventHandler = (event: TauriEvent<string>) => {
    if (paperRef.current) {
      const currentText = paperRef.current.innerHTML;
      paperRef.current.innerHTML = currentText + JSON.stringify(event.payload) + "\n<br/>\n";
    }
  };

  useEffect(() => {
    let unlisten: Function | null = null;
    appWindow.listen<string>('my-window-event', beEventHandler).then((u : Function) => {
      unlisten = u;
    });
    return () => {
      if (unlisten) { unlisten(); }
    };
  });

  return (
    <>
      <CenteredCard>
        <div className="font-extrabold">Log texts:</div>
        <div ref={paperRef} className="p-4 border-solid max-h-52 overflow-y-scroll border-black bg-gray-400">
        </div>
      </CenteredCard>
    </>
  );
}

export { LogViewerSlide };
