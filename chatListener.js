import fetch from "node-fetch";
import { addPlayer } from "./gameEngine.js";

const API_KEY = "AIzaSyDye-sPcSStm9cCAr3nvZ80XkskRwT3AsE";
const LIVE_CHAT_ID = "QdPy-ngbHjbHiZ0E";

let nextPageToken = "";

async function fetchLiveChat(pageToken = "") {
    try {
        const url = `https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=${LIVE_CHAT_ID}&part=snippet,authorDetails&key=${API_KEY}&pageToken=${pageToken}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("❌ Failed to fetch live chat:", err);
        return null;
    }
}

export function initChatListener() {
    console.log("🟢 Chat listener started");

    async function pollChat() {
        const data = await fetchLiveChat(nextPageToken);
        if (data) {
            nextPageToken = data.nextPageToken || "";

            if (data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    const username = item.authorDetails.displayName;
                    const message = item.snippet.displayMessage;

                    if (message.toLowerCase().startsWith("join")) {
                        const flag = message.split(" ")[1] || "🇺🇿";
                        addPlayer(username, flag);
                        console.log(`✅ ${username} joined with flag ${flag}`);
                    }
                });
            }
        }

        setTimeout(pollChat, 3000);
    }

    pollChat();
}
