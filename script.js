const activeToolTxt = document.getElementById("activeTool");
const clearCanvasBtn = document.getElementById("clearCanvas");
const saveToLocalStoarageBtn = document.getElementById("saveToLocalStorage");
const loadFromLocalStorageBtn = document.getElementById("loadFromLocalStorage");
const clearLocalStorageBtn = document.getElementById("clearLocalStorage");
const downloadBtn = document.getElementById("download");
const paintBtn = document.getElementById("paint");
const paintColorInput = document.getElementById("paintColor");
const paintSizeTxt = document.getElementById("paintSize");
const paintSlider = document.getElementById("paintSlider");
const backgroundColorBtn = document.getElementById("backgroundColor");
const eraseBtn = document.getElementById("erase");

jscolor.presets.default = { position: "right", backgroundColor: "#333" };

// Global settings
let lineColorGlobal = "#000000";
let paintSizeGlobal = 10;
let activeToolGlobal = "paint";
let backgroundColorGlobal = "#FFFFFF";
let isMouseDownGlobal = false;
let drawingGlobal = [];

// Canvas
const fillCanvasBackground = () => {
  context.fillStyle = backgroundColorGlobal;
  context.fillRect(0, 0, canvas.width, canvas.height);
};

const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight;
fillCanvasBackground();

const getMousePosition = (e) => {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: e.clientX - boundaries.left,
    y: e.clientY - boundaries.top
  };
};

canvas.addEventListener("mousedown", (e) => {
  isMouseDownGlobal = true;

  const { x, y } = getMousePosition(e);
  context.moveTo(x, y);
  context.beginPath();
  context.lineWidth = paintSizeGlobal;
  context.lineCap = "round";

  if (activeToolGlobal === "paint") {
    context.strokeStyle = lineColorGlobal;
  } else {
    context.strokeStyle = backgroundColorGlobal;
  }
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDownGlobal) {
    const { x, y } = getMousePosition(e);

    drawingGlobal.push({
      x,
      y,
      activeTool: activeToolGlobal,
      lineColor: lineColorGlobal,
      paintSize: paintSizeGlobal
    });

    context.lineTo(x, y);
    context.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDownGlobal = false;
});

// Local Storage / Download Image
saveToLocalStoarageBtn.addEventListener("click", () => {
  const drawingData = {
    backgroundColor: backgroundColorGlobal,
    drawing: drawingGlobal
  };
  localStorage.setItem("drawing", JSON.stringify(drawingData));

  changeActiveToolTxt("Saved");
});

loadFromLocalStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("drawing")) {
    const { backgroundColor, drawing } = JSON.parse(
      localStorage.getItem("drawing")
    );

    backgroundColorGlobal = backgroundColor;
    drawingGlobal = drawing;
  }

  fillCanvasBackground();

  if (drawingGlobal.length > 0) {
    repaintFromArray();
  }

  changeActiveToolTxt("Load");
});

clearLocalStorageBtn.addEventListener("click", () => {
  if (localStorage.getItem("drawing")) {
    localStorage.removeItem("drawing");
  }

  changeActiveToolTxt("Clear");
});

downloadBtn.addEventListener("click", () => {
  downloadBtn.href = canvas.toDataURL("image/jpeg", 1.0);
  downloadBtn.download = "paint-drawing.jpeg";

  changeActiveToolTxt("Saved");
});

// Buttons
clearCanvasBtn.addEventListener("click", () => {
  fillCanvasBackground();
  drawingGlobal = [];

  changeActiveToolTxt("Clear");
});

paintBtn.addEventListener("click", () => {
  eraseBtn.classList.remove("active");
  paintBtn.classList.add("active");

  activeToolGlobal = "paint";
  activeToolTxt.textContent = "Paint";

  lineColorGlobal = paintColorInput.value;
});

paintColorInput.addEventListener("change", (e) => {
  lineColorGlobal = e.target.value;
});

paintSlider.addEventListener("change", (e) => {
  paintSizeGlobal = e.target.value;
  paintSizeTxt.textContent = paintSizeGlobal;
});

backgroundColorBtn.addEventListener("change", (e) => {
  backgroundColorGlobal = e.target.value;
  fillCanvasBackground();

  if (drawingGlobal.length > 0) {
    repaintFromArray();
  }
});

eraseBtn.addEventListener("click", () => {
  paintBtn.classList.remove("active");
  eraseBtn.classList.add("active");

  activeToolGlobal = "erase";
  activeToolTxt.textContent = "Erase";
  lineColorGlobal = backgroundColorGlobal;
});

// helpers
const changeActiveToolTxt = (text) => {
  activeToolTxt.textContent = text;
  setTimeout(() => {
    activeToolTxt.textContent = document.querySelector(".active").title;
  }, 500);
};

const repaintFromArray = () => {
  let prevColor = drawingGlobal[0].lineColor;
  let prevPaintSize = drawingGlobal[0].paintSize;

  context.moveTo(drawingGlobal[0].x, drawingGlobal[0].y);
  context.beginPath();
  context.lineCap = "round";

  drawingGlobal.forEach(({ x, y, lineColor, activeTool, paintSize }) => {
    if (prevColor !== lineColor || prevPaintSize != paintSize) {
      prevPaintSize = paintSize;
      prevColor = lineColor;

      context.stroke();

      if (activeTool === "erase") {
        context.strokeStyle = backgroundColorGlobal;
      } else {
        context.strokeStyle = prevColor;
      }
      context.moveTo(x, y);
      context.beginPath();
    } else {
      if (activeTool === "erase") {
        context.lineWidth = prevPaintSize;
        context.strokeStyle = backgroundColorGlobal;
        context.lineTo(x, y);
      } else {
        context.lineWidth = prevPaintSize;
        context.strokeStyle = prevColor;
        context.lineTo(x, y);
      }
    }
  });
  context.stroke();
};
