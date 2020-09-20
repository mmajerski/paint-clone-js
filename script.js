const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth - 200;
canvas.height = window.innerHeight;
context.fillStyle = "#fff";
context.fillRect(0, 0, canvas.width, canvas.height);

const getMousePosition = (e) => {
  const boundaries = canvas.getBoundingClientRect();
  console.log(boundaries);
  return {
    x: e.clientX - boundaries.left,
    y: e.clientY - boundaries.top
  };
};

canvas.addEventListener("mousedown", (e) => {
  const { x, y } = getMousePosition(e);
  console.log(x, y);
  context.moveTo(x, y);
  context.beginPath();
  context.lineWidth = 20;
  context.lineCap = "round";
  context.strokeStyle = "#000";
});

canvas.addEventListener("mousemove", (e) => {
  const { x, y } = getMousePosition(event);
  context.lineTo(x, y);
  context.stroke();
});
