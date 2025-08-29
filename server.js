require('dotenv').config();

const express = require("express"); // load express
const createConnection = require('./data/connection');

const port = process.env.PORT || 5000;
const app = express(); // setup express
const http = require("http");
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
app.use(express.json({ limit: "100mb" }))

const detectionResults_db = createConnection('detectionResults');

// save images to server
app.post('/face-api/', (request, response) => {
    const data = request.body;
    // console.log(data.totalImg);
    const timeStamp = Date.now();
    // create a new Date object based on the timestamp
    const getDate = new Date(timeStamp);
    // for some reason, the hours in the getDate variable is 1 hour earlier than the current ones
    // so plus one to get the exactly hours
    getDate.setHours(getDate.getHours() + 1);
    // console.log(getDate);
    data.timestamp = getDate;
  
    detectionResults_db.insert(data);
    response.json(data);
  });

app.get('/face-api/', async (request, response) => {
  try {
    const data = await detectionResults_db.find({}, { sort: { totalImg: -1 } });
    response.json(data);
  } catch (err) {
    console.error(err);
    response.end();
    throw (err);
  }
});

// forms
// app.post('/forms/', (request, response) => {
//   const user_data = request.body;

//   user_database.insert(user_data);
//   response.json(user_data);
//   console.log(user_data);
//   // User.create({
//   //   firstname: request.body.fname
//   //   // password: request.body.password
//   // }).then(user => response.json(user));
// });

// app.get('/forms/', (request, response) => {
//   // find all data from database, sort them by totalImg and execute 2 functions
//   user_database.find({}).sort({ n: 1 }).exec((err, data) => { 
//     // console.log(docs);
//     if (err) {
//       console.error(err);
//       response.end();
//       return;
//     } else response.json(data);
//   })
// });
app.use(express.static("public"));
