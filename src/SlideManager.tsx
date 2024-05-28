import { useContext, useEffect, useRef, useState } from "react";
import { SlideDecoration, SlideDecorationInterface } from "./SlideDecoration";
import ApiTesterSlide from "./ApiTesterSlide";
import { LogViewerSlide } from "./LogViewerSlide";
import InteractionContext from "./InteractionContext";
import CenteredCard from "./widgets/CenteredCard";
import "./styles.css";
import ContactInfoSlide from "./ContactInfoSlide";

enum SlideId {
  API_TESTER = 0,
  TAURI_LOGS = 1,
  NO_SLIDE = 2,
}

function SlideManager() : JSX.Element {
  const interaction = useContext(InteractionContext);
  const refSlideDeco = useRef<SlideDecorationInterface>(null);

  const [slideIndex, setSlideIndex] = useState<number>(0);

  useEffect(() => {
    const id = interaction.subscribe(onKeyPress);
    return () => { interaction.unsubscribe(id); };
  }, []);

  function onKeyPress(key: string) {
    const validKeys = ["1", "2", "3"];  // keyboard keys.
    console.log(`Got window key:[${key}]`);
    let choice = validKeys.indexOf(key);
    choice = Math.min(Math.max(choice, 0), SlideId.NO_SLIDE);
    if (choice == SlideId.NO_SLIDE) {
      refSlideDeco.current?.resetTimer(3);
    }
    setSlideIndex(choice);
  }

  return (
    <div className="fullviewport">
      {selectSlide(slideIndex)}
      <SlideDecoration ref={refSlideDeco} />
    </div>
  );
}

function selectSlide(index: number) : JSX.Element {
  switch (index) {
    case 0: {
      return (<ApiTesterSlide/>);
    }
    case 1: {
      return (<LogViewerSlide />);
    }
    case 2: {
      return (<ContactInfoSlide />);
    }
    default: {
      return (
        <CenteredCard>
          <div className="text-4xl font-bold">
            No slide selected
          </div>
          <div className="text-sm italic">
            (This is a placeholder slide)
          </div>
        </CenteredCard>);
    }
  }
}

export { SlideManager };
