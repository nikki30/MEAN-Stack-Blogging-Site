var express = require('express');
var router = express.Router();
const app = express();

const getDb = require("../db").getDb;
const authenticateRequests = require("./login").authenticateRequests;

/*Get posts*/
function fetchDocuments(db, postid, username) {
	return new Promise(
		function(resolve, reject){
		   const collection = db.collection('Posts');
		   let query = {username : ''+username+''};
		   if(postid){
		   	query.postid =  Number(postid);
		   }
		   collection.find(query).toArray(function(error, data) {
		          if(error)
		          	reject(err);
		          else
		          	resolve(data);
		        });
		});	   
}

router.get("/:username?/:postid?", authenticateRequests, (req, res) => {
	    let db = getDb();
		let username = req.params.username;
		let postid = req.params.postid;
		let title = [];
		let body = [];
		let created = [];
		let modified = [];

		if(postid && isNaN(postid)){
			res.status(400);
			res.send("Non numeric postid");
		}
		else if(!username){
			res.status(400);
			res.send("Username cannot be empty");
		}
		else{	
			fetchDocuments(db, postid, username).then(
				function(data){
					docs_length = data.length;
					if(docs_length == 0){
						res.status(404);
						console.log("I MA HERE-------------------1");
						res.send("No records found");
					}
					else{
			   			res.status(200);
			    		res.json(data);
				
					}
				}).catch(
				function(error){
						res.status(404);
						console.log("I MA HERE-------------------1");
						res.send("No records found");
				});
		}
});

/*Get posts*/




/*Save Posts*/
function insertDocuments(db, postid, username, title, body) {
	return new Promise(
		function(resolve, reject){
		   const collection = db.collection('Posts');
	        collection.insertOne({postid : Number(postid), username : ''+username+'',  title : ''+title+'', 
	        	body : ''+body+'',  created : (new Date()).getTime() , modified : (new Date()).getTime()}, function(error, docs) {
	          	if(error)
	          		reject(error);
	          	else
	          		resolve(docs);
	        });
	});
	   
}

router.post("/:username?/:postid?/", authenticateRequests, (req, res) => {
		let db = getDb();
		let username = req.params.username;
		let postid = req.params.postid;
		let title = req.body.title;
		let body = req.body.body;

		if(!username || !postid){
			res.status(400);
			res.json("Username and postId cannot be empty");
		}
		else if(postid && isNaN(postid)){
			res.status(400);
			res.json("Non numeric postId");
		}
		else{
				insertDocuments(db, postid, username, title, body).then(
					function(data){
						res.status(201);
						res.json("Record created");
					}).catch(
					function(error){
						res.status(400);
						res.json("Username and PostId combination already exists");
					});
				
		}	
		
});

/*Save Posts*/



/*Update posts*/

function updateDocuments(db, postid, username, title, body){
	return new Promise(
		function(resolve, reject){
		    const collection = db.collection('Posts');
	   		let myquery = {postid : Number(postid), username : username};
	   		let newvalues = { $set: { title : title, body : body, modified : (new Date()).getTime() } };
	   		collection.updateOne(myquery, newvalues, function(err, data) {
	          if(err)
	          	reject(err);
	          else
	          	resolve(data);
	        });
		});
}

router.put("/:username?/:postid?/", authenticateRequests, (req, res) => {
	    let db = getDb();
		let username = req.params.username;
		let postid = req.params.postid;
		let title = req.body.title;
		let body = req.body.body;

		//invalid url
 		if(!username || !postid){
 			res.status(400);
 			res.json("Missing username or postid");
		}		
		updateDocuments(db, postid, username, title, body).then(
		function(data){
			if(data && data.result && data.result.nModified == 0){
				res.status(400);
				res.json("Username and PostId combination does not exist");
			}
			else{
				res.status(201);
				res.json("Record updated");
			}
			
		}).catch(function(error){
			res.status(400);
			res.json("Username and PostId combination does not exist");
		});
});

/*Update posts*/


/*Delete Posts*/
function deleteDocument(db, postid, username) {
	   return new Promise(
	   	  function(resolve, reject){
	   	  	const collection = db.collection('Posts');
	   		collection.deleteOne({postid : Number(postid), username : ''+username+''}, function(error, data) {
	   			if(error)
	          		reject(error);
	            else
	          		resolve(data);
	        });
	      });
	   
}

router.delete("/:username?/:postid?", authenticateRequests, (req, res) => {
		let db = getDb();
		let username = req.params.username;
		let postid = req.params.postid;
		if(!username || !postid){
			res.status(400);
			res.send("Username and postid cannot be empty");
		}
		else if(isNaN(postid)){
			res.status(400);
			res.send("Non numeric postid");
		}
		else{
			deleteDocument(db, postid, username).then(
				function(data){
					if(data && data.deletedCount == 0){
						res.status(400);
						res.send("Post doesn't exist");
					}
					else{
						res.status(204);
						res.send("Post deleted successfully");
					}
					}).catch(
				function(error){
					res.status(400);
					res.send("Post doesn't exist");	
				});
		}
		});
/*Delete Posts*/

module.exports = router
