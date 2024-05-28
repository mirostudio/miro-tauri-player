import { ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import "./PortalManager.css";

interface ModalParams {
  onClose: Function;
  children: ReactNode;
}

function Modal({ onClose, children }: ModalParams): JSX.Element | null {
  const onClickClose = () => {
    onClose();
  };

  return createPortal(
    <>
      <div className="overlay">
        progress bar here.
      </div>
      <div className="modal">
        <div className="title">modal data:</div>
        <br />
        {children}
        <br /><br />
        <hr></hr>
        <br />
        <div className="text-center">
          <button onClick={() => onClickClose()}>Close</button>
        </div>
      </div>
    </>,
    document.getElementById("portal") as HTMLElement
  );
}

function PortalManager(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      Test some modal window:
      &nbsp;&nbsp;
      <button onClick={() => setIsOpen(!isOpen)}>Toggle Modal</button>
      {isOpen &&
        <Modal onClose={() => setIsOpen(false)}>Hello</Modal>
      }
    </>
  );
}

export default PortalManager;
