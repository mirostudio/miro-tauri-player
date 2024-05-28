import "../styles.css";

type DockedPanelDir = "start" | "mid" | "end";

interface DockedPanelProps {
  hdir: DockedPanelDir,
  vdir: DockedPanelDir,
  children: React.ReactNode,
}

/**
 * A docked panel widget is a floating container which stays sticked to the
 * edge or corner of the viewport.
 *
 * It can settle vertically towards the top or bottom, or at middle. Similarly
 * along the horizontal direction it can settle at left, right or middle.
 * It is not recommended to place the widget at (middle, middle).
 * 
 * Example: A docked panel for top right corner:
 * 
 *   <DockedPanel hdir="end" vdir="start">
 *     .. content ..
 *   </DockedPanel>
 *
 * Caveat: The middle positioning does not take into account the dimension
 * of the content inside.
 */
function DockedPanel({ hdir, vdir, children }: DockedPanelProps) : JSX.Element {
  const styleAttrs = ["fixed", "w-fit", "h-fit"];

  switch (hdir) {
    case "start":
      styleAttrs.push("left-0"); break;
    case "end":
      styleAttrs.push("right-0"); break;
    default:
      styleAttrs.push("hmid"); break;
  }

  switch (vdir) {
    case "start":
      styleAttrs.push("top-0"); break;
    case "end":
      styleAttrs.push("bottom-0"); break;
    default:
      styleAttrs.push("vmid"); break;
  }

  return (
    <div className={styleAttrs.join(" ")}>
      {children}
    </div>
  );
}

export default DockedPanel;
