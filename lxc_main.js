2var http      = require('http');
var httpProxy = require('http-proxy');
var exec = require('child_process').exec;
var request = require("request");
var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var app = express()

// REDIS
var client = redis.createClient(6379, '127.0.0.1' , {})

client.lpush('lxc', "10.0.3.12", function(err, reply){
    console.log("Pushed 10.0.3.12 into Redis!")
  });

client.lpush('lxc', "10.0.3.13", function(err, reply){
    console.log("Pushed 10.0.3.13 into Redis!")
  });

var port = 8080;
var TARGET;

var infrastructure =
{
  setup: function()
  {
    var proxyServer = http.createServer(function(req,res) {
      client.rpoplpush('lxc','lxc', function(err,val) {
        httpProxy.createProxyServer({}).web(req, res, {target: 'http://'+val+':'+port})
        console.log("ROUTING TO LXC CONTAINER : ",val)
      });
    });
    proxyServer.listen(8080, function() {
      console.log("\nProxy Active! listening on port 8080 ... \n")
    });
  },

  teardown: function()
  {
      console.log("infrastructure shutdown");
      process.exit();
  },
}

infrastructure.setup();

// Make sure to clean up.
process.on('exit', function(){infrastructure.teardown();} );
process.on('SIGINT', function(){infrastructure.teardown();} );
process.on('uncaughtException', function(err){
  console.error(err);
  infrastructure.teardown();} );