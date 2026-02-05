import { google } from "googleapis";
import readline from "readline";
import { addPlayer } from "./server.js";

const youtube = google.youtube({ version:"v3", auth: process.env.YOUTUBE_API_KEY });
let liveChatId = null;
let nextPageToken = null;

const aliases={
  "USA":"UNITED_STATES",
  "AMERICA":"UNITED_STATES",
  "UK":"UNITED_KINGDOM",
  "GREAT BRITAIN":"UNITED_KINGDOM",
  "TURKEY":"TURKEY",
  "TURKIYE":"TURKEY"
};

export async function initLiveChat(liveVideoId){
  const res=await youtube.videos.list({ part:"liveStreamingDetails", id:liveVideoId });
  liveChatId=res.data.items[0]?.liveStreamingDetails?.activeLiveChatId;
  if(!liveChatId) throw new Error("Live chat not found!");
  pollChat();
}

async function pollChat(){
  if(!liveChatId) return;
  const res=await youtube.liveChatMessages.list({ liveChatId, part:"snippet,authorDetails", pageToken:nextPageToken });
  nextPageToken=res.data.nextPageToken;
  res.data.items.forEach(item=>{
    const msg=item.snippet.displayMessage.trim().toUpperCase();
    const user=item.authorDetails.displayName;
    const country=aliases[msg] || msg.replace(/\s/g,"_");
    addPlayer(user, country, item.authorDetails.profileImageUrl);
  });
  setTimeout(pollChat, 1000);
}

if(process.env.TEST_CHAT==="true"){
  const rl=readline.createInterface({input:process.stdin,output:process.stdout});
  rl.on("line", line=>{
    const msg=line.trim().toUpperCase();
    addPlayer("TestUser", aliases[msg]||msg, "https://i.pravatar.cc/30");
  });
}
