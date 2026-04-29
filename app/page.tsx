"use client";

import { useState, useEffect } from "react";
import KintsugiIcon from "./components/KintsugiIcon";
import AftermathTool from "./components/AftermathTool";

export default function Home() {
  const [openTool, setOpenTool] = useState<string | null>(null);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      if (id === "aftermath") setOpenTool("aftermath");
    }

    const onPopState = () => {
      if (!history.state?.tool) setOpenTool(null);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (openTool) {
      document.body.classList.add("locked");
    } else {
      document.body.classList.remove("locked");
    }
  }, [openTool]);

  const handleOpen = (tool: string) => {
    setOpenTool(tool);
    history.pushState({ tool }, "", "#" + tool);
  };

  const handleClose = () => {
    if (history.state?.tool) history.back();
    else setOpenTool(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openTool) handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [openTool]);

  return (
    <>
      {/* Gallery */}
      <div className="gallery">
        <header className="g-mast">
          <div className="eye">Practice</div>
          <h1>Relationship <em>Tools</em></h1>
          <div className="credit">Guided exercises for honest connection &amp; repair</div>
        </header>

        <div className="tiles">
          <button className="tile" type="button" onClick={() => handleOpen("aftermath")}>
            <div className="tile-mark">
              <KintsugiIcon />
            </div>
            <div className="tile-body">
              <div className="tile-eyebrow">Gottman Method</div>
              <div className="tile-title">Aftermath of <em>a Fight</em></div>
              <p className="tile-sub">A guided 5-step repair conversation for after a regrettable incident.</p>
            </div>
            <div className="tile-arrow">→</div>
          </button>
        </div>

        <p className="g-foot">More tools coming soon.</p>
      </div>

      {/* Aftermath Overlay */}
      <div
        className={`overlay${openTool === "aftermath" ? " open" : ""}`}
        aria-hidden={openTool !== "aftermath"}
      >
        {openTool === "aftermath" && <AftermathTool onClose={handleClose} />}
      </div>
    </>
  );
}
