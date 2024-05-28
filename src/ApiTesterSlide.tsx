
import { useEffect, useRef } from "react";
import { invoke } from "@tauri-apps/api";
import { Event as TauriEvent } from '@tauri-apps/api/event'
import { appWindow, WebviewWindow } from '@tauri-apps/api/window'
import EventMessage, { EventMessageInterface } from "./EventMessage";
import "./ApiTesterSlide.css";
import CenteredCard from "./widgets/CenteredCard";

function genRandomName(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function invokeApiWrapper(apiName: string): Promise<any> {
  switch (apiName) {
    case "greet": {
      const name = genRandomName(6);
      return await invoke("greet", { name }) as object;
    }
    case "save": {
      const propname = genRandomName(3);
      return await invoke("save", { propname }) as string;
    }
    case "query": {
      return await invoke("query", {}) as string;
    }
    case "start_thread": {
      const threadname = genRandomName(4);
      return await invoke("start_thread", { threadname }) as string;
    }
    case "stop_thread": {
      return await invoke("stop_thread", {}) as string;
    }
    case "clear_window": {
      return await invoke("clear_window", {}) as string;
    }
    case "set_window": {
      return await invoke("set_window", {}) as string;
    }
    default: {
      return "TODO: Api call not done: " + apiName;
    }
  }
}

function TauriApiTester(): JSX.Element {
  const apiSelect = useRef<HTMLSelectElement>(null);
  const preApiOutput = useRef<HTMLPreElement>(null);
  const eventMessageRef = useRef<EventMessageInterface>(null);

  const beEventHandler = (event: TauriEvent<string>) => {
    if (eventMessageRef.current !== null) {
      eventMessageRef.current.showEvent(event.payload);
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

  const onClickTest = async function (evt: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    evt.preventDefault();
    if (apiSelect.current === null) {
      return;
    }
    const dropdown = apiSelect.current;
    const apiName = dropdown.options[dropdown.selectedIndex].value;

    const retValue = await invokeApiWrapper(apiName);
    console.log(retValue);
    let outputText = "";
    if (retValue === undefined) {
      outputText = "(undefined)";
    } else if (retValue === null) {
      outputText = "(null)";
    } else if (retValue instanceof String) {
      outputText = retValue.toString();
    } else {
      outputText = JSON.stringify(retValue);
    }

    if (preApiOutput.current !== null) {
      preApiOutput.current.innerText = outputText;
    } else {
      console.log(outputText);
    }
  };

  return (
    <CenteredCard>
      <div className="text-center">
        <select className="dropdown" ref={apiSelect}>
          <option value="greet">Greet</option>
          <option value="save">Save some key</option>
          <option value="query">Query saved keys</option>
          <option value="start_thread">Start thread</option>
          <option value="stop_thread">Stop thread</option>
          <option value="clear_window">Clear window</option>
          <option value="set_window">Set window.</option>        
        </select>
        &nbsp;&nbsp;
        <button onClick={onClickTest}>Test the API</button>
        <br></br>
        <pre ref={preApiOutput} className="apioutput"></pre>
        <br/>
        <EventMessage ref={eventMessageRef} />
        <br></br>
      </div>
    </CenteredCard>
  );
}

export default TauriApiTester;
