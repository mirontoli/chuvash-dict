/*
 * This file presorts all the words
 * run: node convert.js
 */

var fs = require('fs');

function getSortable(word) {	
	return word
		.toUpperCase()
		.replace(/Ç/g, "с")
		.replace(/Ӳ/g, "у")
		.replace(/Ĕ/g, "е")
		.replace(/Ă/g, "а")
		.split("")
		.map(function(c) {
			return c.charCodeAt(0);
		});
}
function adjustForSorting(c) {	
	return c
		.toUpperCase()
		.replace(/Ç/g, "с")
		.replace(/Ӳ/g, "у")
		.replace(/Ĕ/g, "е")
		.replace(/Ă/g, "а");
}

function compareChars(left, right) {
	
}
fs.readFile("words-part001.csv",  function(err, data) {
	var words = data.toString().split("\r\n");
	var sortedWords = words.sort(function(left, right) {
		console.log(left, getSortable(left), right, getSortable(right));
		return left - right;
	});
	fs.writeFile("test.txt", sortedWords.join("\r\n"), function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	}); 
});
