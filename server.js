const express = require("express"); // load express
const port = process.env.PORT || 5000;
const app = express(); // setup express
const http = require("http");
const server = http.createServer(app);

server.listen(port, () => console.log("listening"));
app.use(express.static("public")); // setup root directory for client side
app.use(express.json({ limit: "1mb" })) // set limit for data transfer

// app.post("/face-api/", (req, res) => {
//     const data = req.body;

// })