import express from "express";
import { WebSocketServer } from "ws";
import { startGameLoop } from "./gameEngine.js";
import { initChatListener } from "./chatListener.js";

const app = express();
app.use(express.static("public"));

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("⚡ Flag Game Pro server running");
});

export const wss = new WebSocketServer({ server });

// Start chat listener
initChatListener();

// Start game loop
startGameLoop();
