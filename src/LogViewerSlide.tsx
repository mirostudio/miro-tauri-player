

import { useEffect, useRef } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { Event as TauriEvent } from '@tauri-apps/api/event'
import CenteredCard from "./widgets/CenteredCard";

const MAX_LOG_ENTRIES: number = 5;

function LogViewerSlide() : JSX.Element {
  const paperRef = useRef<HTMLDivElement>(null);

  const beEventHandler = (event: TauriEvent<string>) => {
    if (!paperRef.current) { return; }
    const containerDiv = paperRef.current as HTMLDivElement;
    const text = JSON.stringify(event.payload);
    const elem = document.createElement("div");
    elem.innerHTML = text;
    containerDiv.appendChild(elem);
    if (containerDiv.childElementCount > MAX_LOG_ENTRIES) {
      containerDiv.removeChild(containerDiv.children.item(0) as Node);
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
