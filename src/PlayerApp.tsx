import "./PlayerApp.css";
import PortalManager from "./PortalManager";
import TauriApiTester from "./TauriApiTester";

function PlayerApp() {
  return (
    <div className="mainpanel">
      <TauriApiTester/>
      <PortalManager />
    </div>
  );
}

export default PlayerApp;
