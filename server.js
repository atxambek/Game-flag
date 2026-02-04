import express from "express";
import fetch from "node-fetch";
import { WebSocketServer } from "ws";
import { startGameLoop, addPlayer } from "./gameEngine.js";

const app = express();
app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("⚡ Flag Game Pro server running");
});

export const wss = new WebSocketServer({ server });

// ===== YouTube Live Chat Setup =====
const API_KEY = "YOUR_YOUTUBE_API_KEY"; // Replace with your key
const LIVE_ID = "YOUR_LIVE_STREAM_ID";  // Replace with live chat ID

async function getLiveChatMessages(pageToken=""){
    const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${LIVE_ID}&part=snippet,authorDetails&key=${API_KEY}&pageToken=${pageToken}`;
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

let nextPageToken = "";
async function pollChat(){
    try {
        const data = await getLiveChatMessages(nextPageToken);
        nextPageToken = data.nextPageToken;

        if(data.items){
            data.items.forEach(item=>{
                const msg = item.snippet.displayMessage;
                const username = item.authorDetails.displayName;

                // Comment example: "join 🇺🇿"
                if(msg.toLowerCase().startsWith("join")){
                    const flag = msg.split(" ")[1] || "🇺🇿";
                    addPlayer(username, flag);
                }
            });
        }
    } catch(e){ console.log("Chat poll error:", e); }
    setTimeout(pollChat, 3000); // poll every 3s
}

pollChat();
startGameLoop();
