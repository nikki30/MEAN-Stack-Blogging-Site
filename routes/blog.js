var express = require('express');
var router = express.Router();
const querystring = require('querystring');
const getDb = require("../db").getDb;
const getReader = require("../commonmark").getReader;
const getWriter = require("../commonmark").getWriter;
const app = express();

const findDocuments = function(db, PostId, Username, callback) {
	   const collection = db.collection('Posts');
	   collection.find({postid : Number(PostId) ,username : ''+Username+''}).toArray(function(err, docs) {
	          return callback(err, docs);
	        });
}


const find5Documents = function(db, Username, start, callback) {
	const collection = db.collection('Posts');
	
	if(!isNaN(start)){
	collection.find({username : ''+Username+'', postid: {$gt: Number(start)}}).limit(5).toArray(function(err, docs) {
	          return callback(err, docs);
	        });
	}
	else{
		collection.find({username : ''+Username+''}).limit(5).toArray(function(err, docs) {
	          return callback(err, docs);
	        });
	}
}

/* GET home page. */
router.get("/:username", (req, res) => {
	    let db = getDb();
	    let reader = getReader();
	    let writer = getWriter();

		var Username = req.params.username;
		var start = req.params.pageNo;
		
		var title = [];
		var body = [];
		var user = Username;
		var docs_length;
		var start = req.query.start;
	
		
			find5Documents(db, Username,start, function(err, data){
			
			if(err){
				res.status(404);
				res.render('noRecords');
			}
			else{
					docs_length = data.length;
					if(docs_length == 0){
						res.status(404);
						res.render('noRecords');
					}
					else{
						let posts = [];
						for(i=0;i<data.length;i++){
							posts[i] = {};
							posts[i].title = writer.render(reader.parse(data[i].title));
							posts[i].body = writer.render(reader.parse(data[i].body)); 
						}
						
						let lastIdParam = 0;
						if(data.length > 0)
							lastIdParam = data[data.length - 1].postid;
						res.status(200);
						res.render('preview', {'docs_length': docs_length, 'posts' : posts, 'start' :  lastIdParam, 'username' : Username});
					}
			}
			
		
		});
});


router.get("/:username/:postid", (req, res) => {
		let db = getDb();
		let reader = getReader();
	    let writer = getWriter();

		var Username = req.params.username;
		var PostId = req.params.postid;
		var title = null;
		var body = null;
		if(isNaN(PostId)){
			res.status(400);
			let errormsg = "Non numeric postid";
			res.render('badRequest',errormsg);
		}
		else{
				findDocuments(db, PostId, Username, function(err, data){
					if(err){
						res.status(404);
						res.render('noRecords');
					}
					else{
						if(data.length == 0){
							res.status(404);
							res.render('noRecords');
						}
					else{
							title =  writer.render(reader.parse(data[0].title));
							body = writer.render(reader.parse(data[0].body));
							res.status(200);
							res.render('previewSingle', {'title' : title, 'body' : body});
					}
					}
					
	  			});
		}
		
});


module.exports = router
