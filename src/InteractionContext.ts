import { createContext } from "react";

interface InteractionKeypress {
  onKeypress(key: string): void;
}

enum InteractionType {
  KeyPress = "keydown",
};

class Interaction {

  readonly handlers: Map<string, Array<any>> = new Map();
  keyhandlers: Array<Function> = [];

  static default() {
    return instance;
  }

  constructor() {
    document.addEventListener("keydown", this.onWindowKeypress.bind(this));
    // window.addEventListener("keydown", this.onWindowInteraction.bind(this, InteractionType.KeyPress));
  }

  public subscribe(callback: Function) {
    this.keyhandlers.push(callback);
    return "_uid-67";
  }

  public unsubscribe(id: string) {
    console.log("unsubscribe not implemented: " + id);
    this.keyhandlers.length = 0;
  }

  private onWindowKeypress(e: KeyboardEvent) {
    for (const handler of this.keyhandlers) {
      handler(e.key);
    }
  }

  /*
  public subscribeType(type: InteractionType) {
    let handlers = this.handlers.get(type);
    if (!handlers) {
      handlers = [];
      this.handlers.set(type, handlers);
    }
    handlers.push();
    return "_uuid";
  }

  public onWindowInteraction(type: InteractionType, e: KeyboardEvent) {
    console.dir(`@Interaction^^ Win metaKey:${e.metaKey} key:${e.key}`);
    const handlers = this.handlers.get(type);
    if (!handlers || !Array.isArray(handlers)) return;
    for (const handler of handlers) {
      handler(e);
    }
  }*/
}

const instance = new Interaction();

const InteractionContext = createContext<Interaction>(instance);

export default InteractionContext;
export { Interaction };
