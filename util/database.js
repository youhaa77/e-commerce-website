const mongodb=require('mongodb')
const MongoClient=mongodb.MongoClient

let db;
const mongoConnect = cb => {
MongoClient.connect
('mongodb://youhannamen:nDzaKXKun6Tgdn4R@ac-zt46lwu-shard-00-00.rn3azdg.mongodb.net:27017,ac-zt46lwu-shard-00-01.rn3azdg.mongodb.net:27017,ac-zt46lwu-shard-00-02.rn3azdg.mongodb.net:27017/?ssl=true&replicaSet=atlas-t00lgy-shard-0&authSource=admin&retryWrites=true&w=majority')
.then(client =>
	{console.log('connected');
	db=client.db('shop')//name of the database
	cb();
})
.catch(err=>{console.log(err)})
}
//connection to db and collections
const getDb =()=>{
if(db){
return db;
}
throw err
}



exports.mongoConnect=mongoConnect;
exports.getDb=getDb;







// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;

// const mongoConnect = callback => {
//   MongoClient.connect(
//     'mongodb+srv://youhannamen:<password>@cluster0.rn3azdg.mongodb.net/?retryWrites=true&w=majority"'
//   )
//     .then(client => {
//       console.log('Connected!');
//       callback(client);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// module.exports = mongoConnect;
