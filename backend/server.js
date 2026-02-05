import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
import { initLiveChat } from "./chatListener.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin:"*" } });

app.use(cors());
app.use(express.static("../frontend"));
app.use("/flags", express.static("../flags"));
app.use("/badges", express.static("../badges"));
app.use("/sounds", express.static("../sounds"));

const flags = JSON.parse(fs.readFileSync("flags.json"));
let round=1;
let players={};
let flagToUser={};
let scores={};

export function addPlayer(user, flag, avatar){
  if(!flags.includes(flag)) return;
  if(!flagToUser[flag]) flagToUser[flag]={user, avatar};
  if(!players[user]) players[user]={flag, avatar, badge:null};
  io.emit("playersUpdate", players);
}

function addVirtualPlayers(){
  const botCount=Math.floor(Math.random()*3)+1;
  for(let i=0;i<botCount;i++){
    const botName="Bot"+Math.floor(Math.random()*1000);
    const flag=flags[Math.floor(Math.random()*flags.length)];
    addPlayer(botName, flag, "https://i.pravatar.cc/30");
  }
}

function startRound(){
  io.emit("roundStatus",{status:"gathering", round});
  players={};
  flagToUser={};
  setTimeout(()=>{
    if(Object.keys(players).length===0) addVirtualPlayers();
    io.emit("roundStatus",{status:"battle", round});
    setTimeout(endRound, 20000);
  }, 10000);
}

function endRound(){
  const winnerFlags=Object.keys(flagToUser);
  if(winnerFlags.length===0){ startRound(); return; }

  let winners=[];
  winnerFlags.forEach(flag=>{
    const {user, avatar}=flagToUser[flag];
    if(!scores[user]) scores[user]=0;
    scores[user]+=1;
    players[user].badge="top_scorer";
    winners.push({user, flag, avatar});
  });

  io.emit("roundResult", winners);
  io.emit("leaderboardUpdate", getLeaderboard());
  round++;
  startRound();
}

function getLeaderboard(){
  return Object.keys(scores).map(u=>({user:u, points:scores[u]})).sort((a,b)=>b.points-a.points);
}

io.on("connection", socket=>{
  socket.on("requestLeaderboard", ()=>socket.emit("leaderboardUpdate", getLeaderboard()));
});

if(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_VIDEO_ID){
  initLiveChat(process.env.YOUTUBE_VIDEO_ID);
}

startRound();
server.listen(process.env.PORT || 3000, ()=>console.log("Server running"));
