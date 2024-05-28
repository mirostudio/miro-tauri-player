import InteractionContext, { Interaction } from "./InteractionContext";
import "./PlayerApp.css";
import { SlideManager } from "./SlideManager";

function PlayerApp() : JSX.Element {
  return (
    <>
      <InteractionContext.Provider value={Interaction.default()}>
        <SlideManager />
      </InteractionContext.Provider>
    </>
  );
}

export default PlayerApp;
