import React, { useRef, useEffect, useState } from "react";
import * as fabric from "fabric"; // Correct import for FabricImage

export default function CropperCanvas() {
  const canvasRef = useRef(null);
  const fabricCanvas = useRef(null);
  const cropRect = useRef(null);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    // Clear previous canvas if one exists
    if (fabricCanvas.current) {
      fabricCanvas.current.dispose();
    }

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 300,
    });
    fabricCanvas.current = canvas;

    // Create a rectangle for cropping
    cropRect.current = new fabric.Rect({
      left: 50,
      top: 50,
      width: 200,
      height: 150,
      fill: "rgba(0,0,0,0.3)",
      hasBorders: true,
      hasControls: true,
      borderColor: "red",
      cornerColor: "red",
    });

    canvas.add(cropRect.current);

    // Cleanup the canvas when the component unmounts
    return () => {
      fabricCanvas.current.dispose();
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgUrl = reader.result;

      // Use the correct FabricImage class for loading the image
      fabric.FabricImage.fromURL(
        imgUrl,
        (img) => {
          console.log("Image loaded", img); // Log the loaded image

          img.set({
            left: 0,
            top: 0,
            selectable: false, // Prevent dragging the background
          });

          fabricCanvas.current.setBackgroundImage(
            img,
            fabricCanvas.current.renderAll.bind(fabricCanvas.current)
          );

          // Save the image as a state
          setImageData(imgUrl);
        },
        (error) => {
          console.error("Error loading image:", error); // Log the error if loading fails
        }
      );
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    const canvas = fabricCanvas.current;
    const rect = cropRect.current;

    const { left, top, width, height } = rect;

    // Create a new canvas for cropping
    const croppedCanvas = document.createElement("canvas");
    croppedCanvas.width = width;
    croppedCanvas.height = height;
    const ctx = croppedCanvas.getContext("2d");

    const bg = canvas.backgroundImage;
    if (!bg) {
      console.error("Background image is not set");
      return;
    }

    const img = new Image();
    img.src = bg.getSrc();
    img.onload = () => {
      ctx.drawImage(img, left, top, width, height, 0, 0, width, height);
      const croppedData = croppedCanvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = croppedData;
      a.download = "cropped.png";
      a.click();
    };
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      <br />
      <canvas ref={canvasRef} />
      <br />
      {imageData && (
        <div>
          <h4>Background Image Data:</h4>
          <img src={imageData} alt="Canvas background" />
        </div>
      )}
      <button onClick={handleCrop}>📤 Export Cropped</button>
    </div>
  );
}
