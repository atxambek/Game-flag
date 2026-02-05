const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 500;

const center = { x: 180, y: 250 };
const radius = 160;

let winner = "China";
let timer = 45;

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.beginPath();
  ctx.arc(center.x, center.y, radius, 0, Math.PI*2);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 6;
  ctx.setLineDash([8,8]);
  ctx.stroke();

  ctx.setLineDash([]);

  ctx.fillStyle = "#fff";
  ctx.font = "22px Arial";
  ctx.textAlign = "center";
  ctx.fillText("WINNER", center.x, center.y - 40);

  ctx.fillStyle = "#fff";
  ctx.font = "30px Arial";
  ctx.fillText(winner, center.x, center.y + 10);

  ctx.font = "14px Arial";
  ctx.fillText("Next round in " + timer, center.x, center.y + 40);

  requestAnimationFrame(draw);
}

setInterval(() => {
  if (timer > 0) timer--;
}, 1000);

draw();
