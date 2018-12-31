const assert = require('assert');
const commonmark = require('commonmark');

let reader;
let writer;

module.exports = {
	getReader,
	getWriter,
	initParser
};

function initParser(callback){
	if(reader && writer){
		return callback(null);
	}
	reader = new commonmark.Parser();
	writer = new commonmark.HtmlRenderer();
}


function getReader(){
	assert.ok(reader, "Commonmark reader not initialized");
	return reader;
}

function getWriter(){
	assert.ok(reader, "Commonmark writer not initialized");
	return writer;
}