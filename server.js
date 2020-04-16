const express = require("express"); // load express
const Datastore = require("nedb"); // load nedb database
const port = process.env.PORT || 5000;
const app = express(); // setup express
const http = require("http");
const server = http.createServer(app);

const database = new Datastore("database.db");
// const path = require('path'); // path to the logo 

server.listen(port, () => console.log("listening"));
app.use(express.static("public")); // setup root directory for client side
app.use(express.json({ limit: "1mb" })) // set limit for data transfer
// app.use('/images', express.static(path.join('assets/police_logo.svg', 'images')))


// save images to server
app.post('/face-api', (request, response) => {
    const data = request.body;
  
    const timestamp = Date.now();
    data.timestamp = timestamp;
  
    let base64String = data.image64; // image data in Base64 format 
    let base64Image = base64String.split(';base64,').pop(); // remove header
    // write to file
    require("fs").writeFile(`database/image.png`, base64Image, {encoding: 'base64'}, function(err) {
      console.log('File created');
    });
  
    database.insert(data);
    response.json(data);
    // console.log(data);
  });