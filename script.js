const activeToolText = document.getElementById("activeTool");
const clearCanvasBtn = document.getElementById("clearCanvas");
const saveToLocalStoarageBtn = document.getElementById("saveToLocalStorage");
const loadFromLocalStorageBtn = document.getElementById("loadFromLocalStorage");
const clearLocalStorageBtn = document.getElementById("clearLocalStorage");
const saveImageBtn = document.getElementById("saveImage");
const brushBtn = document.getElementById("brush");
const brushColorBtn = document.getElementById("brushColor");
const brushSizeTxt = document.getElementById("brushSize");
const brushSlider = document.getElementById("brushSlider");
const backgroundColorBtn = document.getElementById("backgroundColor");
const eraseBtn = document.getElementById("erase");

// Global settings
let lineColor = "#000";
let brushSize = 10;
let activeTool = "brush";
let backgroundColor = "#fff";
let isMouseDown = false;
const drawing = [];

// Canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight;
context.fillStyle = backgroundColor;
context.fillRect(0, 0, canvas.width, canvas.height);

const getMousePosition = (e) => {
  const boundaries = canvas.getBoundingClientRect();
  return {
    x: e.clientX - boundaries.left,
    y: e.clientY - boundaries.top
  };
};

canvas.addEventListener("mousedown", (e) => {
  isMouseDown = true;

  const { x, y } = getMousePosition(e);
  context.moveTo(x, y);
  context.beginPath();
  context.lineWidth = brushSize;
  context.lineCap = "round";
  context.strokeStyle = lineColor;
});

canvas.addEventListener("mousemove", (e) => {
  if (isMouseDown) {
    const { x, y } = getMousePosition(e);
    drawing.push({ x, y, lineColor, activeTool });
    context.lineTo(x, y);
    context.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// Buttons
clearCanvasBtn.addEventListener("click", () => {
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  activeToolText.textContent = "Clear";
  setTimeout(() => {
    activeToolText.textContent = document.querySelector(".active").title;
  }, 500);
});

brushBtn.addEventListener("click", () => {
  eraseBtn.classList.remove("active");
  brushBtn.classList.add("active");
  activeTool = "brush";
  activeToolText.textContent = "Brush";
  lineColor = brushColorBtn.value;
});

brushColorBtn.addEventListener("change", (e) => {
  lineColor = e.target.value;
});

brushSlider.addEventListener("change", (e) => {
  brushSize = e.target.value;
  brushSizeTxt.textContent = brushSize;
});

backgroundColorBtn.addEventListener("change", (e) => {
  backgroundColor = e.target.value;
  lineColor = backgroundColor;
  context.fillStyle = backgroundColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.moveTo(drawing[0].x, drawing[0].y);
  let prevColor = drawing[0].lineColor;
  context.strokeStyle = prevColor;
  context.beginPath();
  console.log(drawing);
  drawing.forEach(({ x, y, lineColor, activeTool }) => {
    if (lineColor !== prevColor) {
      prevColor = lineColor;
      context.stroke();
      context.strokeStyle = lineColor;
      if (activeTool === "erase") {
        context.strokeStyle = backgroundColor;
      }
      context.moveTo(x, y);
      context.beginPath();
    } else {
      if (activeTool === "erase") {
        context.strokeStyle = backgroundColor;
      }
      context.lineTo(x, y);
    }
  });
  context.stroke();
});

eraseBtn.addEventListener("click", () => {
  brushBtn.classList.remove("active");
  eraseBtn.classList.add("active");
  activeTool = "erase";
  activeToolText.textContent = "Erase";
  console.log(backgroundColor);
  lineColor = backgroundColor;
});
