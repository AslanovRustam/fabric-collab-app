import React from "react";
import LiveCanvas from "./components/LiveCanvas";
import CropperCanvas from "./components/CropperCanvas";

export default function App() {
  return (
    <div style={{ display: "flex", gap: "2rem", padding: "2rem" }}>
      <div>
        <h2>✂️ Cropper</h2>
        <CropperCanvas />
      </div>
      <div>
        <h2>🧑‍🤝‍🧑 Collaborative Canvas</h2>
        <LiveCanvas />
      </div>
    </div>
  );
}
