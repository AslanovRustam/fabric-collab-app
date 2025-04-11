import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const LiveCanvas = () => {
  const [canvasState, setCanvasState] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    console.log("Trying to establish a connection to the server...");

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connection established");
    });

    socketRef.current.on("initCanvas", (data) => {
      console.log("The initial state of the canvas is obtained:", data);
      setCanvasState(data);
    });

    socketRef.current.on("updateCanvas", (data) => {
      console.log("Updated canvas state:", data);
      setCanvasState(data);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Error connecting to server:", error);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleCanvasUpdate = () => {
    try {
      // Logging before sending
      console.log("Sending updated canvas data...");

      const updatedCanvasState = "new state"; // replace with current canvas data
      socketRef.current.emit("updateCanvas", updatedCanvasState);
    } catch (error) {
      console.error("Error sending updates to server:", error);
    }
  };

  return (
    <div>
      <h1>Live Canvas</h1>
      <div>{canvasState}</div>
      <button type="button" onClick={handleCanvasUpdate}>
        Refresh canvas
      </button>
    </div>
  );
};

export default LiveCanvas;
