import { wss } from "./server.js";

let players = {};
let roundNumber = 0;
let roundActive = false;
let winnerHistory = [];

export function addPlayer(name, flag){
    if(!["🇺🇿","🇺🇸","🇹🇷"].includes(flag)) return;
    if(!players[name]){
        players[name] = {
            flag,
            x: 540 + Math.random()*200-100,
            y: 960 + Math.random()*200-100,
            vx: Math.random()*10-5,
            vy: Math.random()*10-5
        };
    }
    broadcast();
}

function broadcast(){
    wss.clients.forEach(c=>{
        if(c.readyState===1)
            c.send(JSON.stringify({players, roundNumber, winnerHistory}));
    });
}

function eliminateRandom(){
    if(!roundActive) return;
    const keys = Object.keys(players);
    if(keys.length <= 1){
        if(keys.length===1) declareWinner(keys[0]);
        return;
    }
    const out = keys[Math.floor(Math.random()*keys.length)];
    delete players[out];
    broadcast();
}

function declareWinner(name){
    roundActive=false;
    winnerHistory.push({round: roundNumber, winner: name});
    console.log(`🏆 Round ${roundNumber} winner: ${name}`);
    setTimeout(()=>startRound(),5000);
}

function startRound(){
    roundNumber++;
    roundActive=true;
    players={};
    broadcast();
}

function updatePhysics(){
    for(const key in players){
        const p = players[key];
        p.x+=p.vx; p.y+=p.vy;
        const dx = p.x-540, dy=p.y-960;
        const distance=Math.sqrt(dx*dx+dy*dy);
        if(distance>450-60){
            const angle=Math.atan2(dy,dx);
            p.vx=-Math.cos(angle)*15;
            p.vy=-Math.sin(angle)*15;
        }
    }
}

export function startGameLoop(){
    startRound();
    setInterval(updatePhysics,50);
    setInterval(eliminateRandom,7000);
    setInterval(broadcast,100);
}
