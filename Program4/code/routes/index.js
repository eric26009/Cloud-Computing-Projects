var express = require('express');
var router = express.Router();
const storage = require('azure-storage');
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program4database;AccountKey=REPLACE WITH KEY;TableEndpoint=https://program4database.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);

/* GET home page. */
router.get('/', function(req, res, next) {
  tableSvc.createTableIfNotExists('Program4Data', function(error, result, response){
    if(!error){
        setTimeout(function(){  }, 500);
    }
    });
  res.render('index');
});

module.exports = router;
