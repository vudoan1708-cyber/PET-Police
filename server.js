const express = require("express"); // load express
const Datastore = require("nedb"); // load nedb database
const port = process.env.PORT || 5000;
const app = express(); // setup express
const http = require("http");
const server = http.createServer(app);

const database = new Datastore("database/database.db"); // set up database object and set up the directory to where it will be saved
database.loadDatabase(); // create a database file
// const path = require('path'); // path to the logo 

server.listen(port, () => console.log("listening"));
app.use(express.static("public")); // setup root directory for client side
app.use(express.json({ limit: "1mb" })) // set limit for data transfer
// app.use('/images', express.static(path.join('assets/police_logo.svg', 'images')))


// save images to server
app.post('/face-api/', (request, response) => {
    const data = request.body;
    // console.log(data.totalImg);
    const timestamp = Date.now();
    data.timestamp = timestamp;
  
    let base64String = data.image64; // image data in Base64 format 
    let base64Image = base64String.split(';base64,').pop(); // remove header
    // write to file
    require("fs").writeFile(`database/img/image${data.totalImg}.png`, base64Image, {encoding: 'base64'}, function(err) {
      console.log('File created');
    });
  
    database.insert(data);
    response.json(data);
  });

app.get('/face-api/', (request, response) => {
  database.find({}, (err, docs) => {
    // console.log(docs);
    if (err) {
      console.error(err);
      response.end();
      return;
    } else response.json(docs);
  })
})