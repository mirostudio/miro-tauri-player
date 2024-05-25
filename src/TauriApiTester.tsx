
import { useRef } from "react";
import "./TauriApiTester.css";
import { invoke } from "@tauri-apps/api";

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
      return await invoke("greet", { name }) as string;
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
    default: {
      return "TODO: Api call not done: " + apiName;
    }
  }
}

function TauriApiTester(): JSX.Element {
  const apiSelect = useRef<HTMLSelectElement>(null);
  const preApiOutput = useRef<HTMLPreElement>(null);

  const onClickTest = async function (evt: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    evt.preventDefault();
    if (apiSelect.current === null) {
      return;
    }
    const dropdown = apiSelect.current;
    const apiName = dropdown.options[dropdown.selectedIndex].value;

    const retValue = await invokeApiWrapper(apiName);
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
    <>
      <select className="dropdown" ref={apiSelect}>
        <option value="greet">Greet</option>
        <option value="save">Save some key</option>
        <option value="query">Query saved keys</option>
        <option value="start_thread">Start thread</option>
        <option value="stop_thread">Stop thread</option>
      </select>
      &nbsp;&nbsp;
      <button onClick={onClickTest}>Test the API</button>
      <br></br>
      <pre ref={preApiOutput} className="apioutput"></pre>
    </>
  );
}

export default TauriApiTester;
