var multer  = require('multer')
var express = require('express')
var app = express()


// HTTP SERVER
var server = app.listen(8080, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)
})

app.get('/', function(req, res) {
	
   console.log("THIS IS CONTAINER 2!");

})