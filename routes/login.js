const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
const getDb = require("../db").getDb;
const assert = require('assert');
const privateKEY = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';

router.get('/', function(req, res, next) {
  let redirectUrl = req.query.redirect;
  let cookie = req.cookies.jwt;
  jwt.verify(cookie, privateKEY, function(err, decoded) {
    if (err) {
        res.render('login', {'redirect' : redirectUrl, 'username' : '', 'password': ''});
    } else {
  		res.status(200);
  		res.send("You are already logged in.");
     }
   });		 
});

var app = express();
app.use(cookieParser());
router.post('/', function(req, res, next) {
  let redirectUrl = req.body.redirect;
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password || username === undefined || password === undefined){
  	res.status(401);
    res.render('login',{'redirect' : '', 'errormsg' : 'Username or Password is incorrect','username': username, 'password': password});	
  }

  else{
			  authenticate(jwt, username, password, function(error, token){
				  if(token){
					res.cookie("jwt", token);
					if(redirectUrl){
						res.status(200);
						res.redirect(redirectUrl);
					}
					else{
						res.status(200);
				    	res.send("Authentication successful");
				   }
				 }
				  else{
				  		res.status(401);
				    	res.render('login',{'redirect' : '', 'errormsg' : 'Username or Password is incorrect','username': username, 'password': password});
				}		 
			  });
		  
  }
 
});


function authenticateRequests(req, res, next){
	let token = req.cookies.jwt;
  	jwt.verify(token, privateKEY, function(err, decoded) {
    if (err) {
        console.log("Error while verifying JWT Token"+err);
        res.status(401);
				res.send("You are not logged in or your session has expired. Please login again.");
				//res.send({redirect: '/editor/'});
				
    } else {
        console.log("JWT Verified");
        next();
     }
   });		 
	
}

let authenticate = function(jwt, username, password, callback){
	let db = getDb();
	const collection = db.collection('Users');
	let query = {username : ''+username+''};
	collection.find(query).toArray(function(err, docs) {
	          assert.equal(err, null);
			  var token = null;
			  if(docs.length > 0){
					  bcrypt.compare(password, docs[0].password , function(err, res) {
		    					if(res == true){
		    						var expiration = 2*60*60;
		    						var payload = {
							  			'usr': username,
						  			};
									var privateKEY  = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';
									var signOptions = {
									      'alg': 'HS256',
									      'typ': 'JWT'
									};
						  			token = jwt.sign(payload, privateKEY, { expiresIn: expiration });
		    					}
		    					return callback(err, token);
		  			  });
			  }
			  else {
    					console.log("Username does not exist");
    					callback(err, token);
    				}
	        });
}

module.exports = {
	router,
	authenticateRequests
};