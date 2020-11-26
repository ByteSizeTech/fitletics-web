// const express = require("express");
// const cors = require("cors");
// const http = require("http");

// var app = express();
// // app.use(cors());
// const server = http.createServer(app);
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "http://127.0.0.1:8080",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log("new connection");

//   socket.on("messages", (data) => {
//     console.log(data);
//   });

//   socket.emit("welcome", "Hi!");
// });

// server.listen(8080, "0.0.0.0", () => {
//   console.log("The server is running!");
// });

const http = require("http");
const { request } = require("https");
const WebSocketServer = require("websocket").server;

const server = http.createServer();
server.listen(25001);

const wsServer = new WebSocketServer({
  httpServer: server,
});

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  connection.on("message", (message) => {
    console.log("Recieved message:", message.utf8Data);
    connection.sendUTF("HI! This is the server!");
  });

  connection.on("close", () => {
    console.log("Client has disconnected!");
  });
});
