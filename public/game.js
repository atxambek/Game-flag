const canvas=document.getElementById("gameCanvas");
const ctx=canvas.getContext("2d");
canvas.width=1080; canvas.height=1920;

const center={x:540,y:960};
const radius=450;
let roundNumber=0;
let prevPlayers={};
const ws=new WebSocket(location.origin.replace("http","ws"));
let players={};

ws.onmessage=e=>{
    const data=JSON.parse(e.data);
    players=data.players;
    roundNumber=data.roundNumber;
};

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.beginPath();
    ctx.arc(center.x,center.y,radius,0,Math.PI*2);
    ctx.strokeStyle="#00ffff"; ctx.lineWidth=15; ctx.stroke();

    for(const key in players){
        const p=players[key];
        ctx.fillStyle="white"; ctx.font="60px Arial";
        ctx.fillText(p.flag,p.x,p.y);
    }

    const keys=Object.keys(players);
    if(keys.length===1 && prevPlayers[keys[0]]){
        launchConfetti();
        alert(`🏆 Round ${roundNumber} Winner: ${keys[0]} 🏆`);
    }

    prevPlayers={...players};
    requestAnimationFrame(draw);
}

draw();
