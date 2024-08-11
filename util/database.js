const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  // MongoClient.connect(
  //   'mongodb://shop:shop@127.0.0.1:27017/shop?authSource=admin'
  // )
  MongoClient.connect(
    'mongodb+srv://belajar:belajar@cluster0.ryozf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
  )
    .then(async(client) => {
      console.log('Connected!');
      _db = await client.db();
      console.log(client.s.options.dbName);
      //console.log(_db.listCollections());
      callback();
    })
    .catch(err => {
      console.log(err);
    });
};

const getDb = () => {
    if(_db){
      return _db;
    }
    throw "No Database Found !";
}

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
