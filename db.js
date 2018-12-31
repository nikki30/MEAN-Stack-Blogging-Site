const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
//Connection URL
const url = 'mongodb://localhost:27017';
 //Database Name
const dbName = 'BlogServer';

let _db;
module.exports = {
	getDb,
	initDb
};

function initDb(callback){
	if(_db){
		return callback(null);
	}
	MongoClient.connect(url, function(err, client) {
		if(err){
			return callback(err);
		}

		_db = client.db(dbName);
		return callback(null);
	});

}


function getDb(){
	assert.ok(_db, "Db has not been initialized yet");
	return _db;
}