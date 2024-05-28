import "../styles.css";

type DockedPanelDir = "start" | "mid" | "end";

interface DockedPanelProps {
  hdir: DockedPanelDir,
  vdir: DockedPanelDir,
  children: React.ReactNode,
}

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
