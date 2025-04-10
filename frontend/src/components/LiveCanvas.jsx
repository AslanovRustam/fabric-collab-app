// import React, { useState, useEffect, useRef } from "react";
// import * as fabric from "fabric";
// import { io } from "socket.io-client";

// const LiveCanvas = () => {
//   const canvasRef = useRef(null); // Ссылка на DOM элемент для canvas
//   const fabricCanvas = useRef(null); // Ссылка на объект fabric.Canvas
//   const [imageData, setImageData] = useState(null); // Состояние для данных изображения

//   // Очистка canvas перед его инициализацией
//   useEffect(() => {
//     if (fabricCanvas.current) {
//       fabricCanvas.current.dispose(); // Очищаем старый canvas
//     }

//     // Инициализация нового canvas
//     const canvas = new fabric.Canvas(canvasRef.current, {
//       width: 600,
//       height: 400,
//     });

//     fabricCanvas.current = canvas;

//     // Очистка при размонтировании компонента
//     return () => {
//       if (fabricCanvas.current) {
//         fabricCanvas.current.dispose();
//       }
//     };
//   }, []);

//   // Обработка загрузки изображения
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       fabric.Image.fromURL(reader.result, (img) => {
//         img.selectable = false;
//         fabricCanvas.current.setBackgroundImage(
//           img,
//           fabricCanvas.current.renderAll.bind(fabricCanvas.current)
//         );
//         setImageData(reader.result); // Сохраняем данные изображения в состояние
//       });
//     };
//     reader.onerror = (error) => {
//       console.error("Ошибка загрузки изображения:", error);
//     };
//     reader.readAsDataURL(file);
//   };

//   // Обработка данных с сокетов
//   useEffect(() => {
//     const socket = io("http://localhost:4000"); // Пример подключения к серверу сокетов

//     socket.on("canvas-data", (data) => {
//       if (data && data.objects) {
//         fabricCanvas.current.loadFromJSON(
//           data,
//           fabricCanvas.current.renderAll.bind(fabricCanvas.current)
//         );
//       } else {
//         console.error("Некорректные данные для загрузки.");
//       }
//     });

//     // Очистка при размонтировании
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <div>
//       <h2>Live Canvas</h2>

//       <input type="file" onChange={handleImageUpload} />

//       <div style={{ margin: "20px 0" }}>
//         <canvas ref={canvasRef}></canvas>
//       </div>

//       {imageData && (
//         <div>
//           <h4>Background Image Data:</h4>
//           <img src={imageData} alt="Canvas background" />
//         </div>
//       )}
//     </div>
//   );
// };

// export default LiveCanvas;
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const LiveCanvas = () => {
  const [canvasState, setCanvasState] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    // Логируем начало подключения
    console.log("Попытка установить соединение с сервером...");

    socketRef.current = io("http://localhost:4000", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Подключение установлено");
    });

    socketRef.current.on("initCanvas", (data) => {
      console.log("Получено начальное состояние канваса:", data);
      setCanvasState(data);
    });

    socketRef.current.on("updateCanvas", (data) => {
      console.log("Обновленное состояние канваса:", data);
      setCanvasState(data);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Соединение разорвано");
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("Ошибка при подключении к серверу:", error);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleCanvasUpdate = () => {
    try {
      // Логируем перед отправкой
      console.log("Отправка обновленных данных канваса...");

      const updatedCanvasState = "new state"; // замените на актуальные данные канваса
      socketRef.current.emit("updateCanvas", updatedCanvasState);
    } catch (error) {
      console.error("Ошибка при отправке обновлений на сервер:", error);
    }
  };

  return (
    <div>
      <h1>Live Canvas</h1>
      <div>{canvasState}</div>
      <button onClick={handleCanvasUpdate}>Обновить канвас</button>
    </div>
  );
};

export default LiveCanvas;
