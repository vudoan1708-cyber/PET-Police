const monk = require('monk');

module.exports = function createConnection(collectionName) {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    const db = monk(MONGODB_URI);
    const database = db.get(collectionName);
    console.log(`Connect to MongoDB Database ${collectionName} successfully`);
    return database;
  } catch (err) {
    console.log(`Err ${err}`);
    return err;
  }
}
