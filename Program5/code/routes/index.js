var express = require('express');
var router = express.Router();
const storage = require('azure-storage');
const azure = require('azure');
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program5;AccountKey=REPLACE WITH ACCOUNT KEY;TableEndpoint=https://program5.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);

/* GET home page. */
router.get('/', function(req, res, next) {
  var recentString = "";

  var query = new azure.TableQuery().top(5);
  
  tableSvc.queryEntities('Program5Data',query, null, function(error, result, response) {
    if(!error) {
      var count = 0
      result.entries.forEach(function(element) {
        count=0
        for(var value in element){
          count=count+1
          if(count >2){ continue}
            for(var value2 in element[value]){
              // console.log(element[value][value2]);
              recentString += element[value][value2] + " ";
          }
        }
      });
    }
  var parsedString = recentString.split(" ");
  var rs1l = parsedString[0];
  var rs1n = parsedString[1];
  var rs2l = parsedString[2];
  var rs2n = parsedString[3];
  var rs3l = parsedString[4];
  var rs3n = parsedString[5];
  var rs4l = parsedString[6];
  var rs4n = parsedString[7];
  var rs5l = parsedString[8];
  var rs5n = parsedString[9];
  res.render('index', {recent:recentString,rs1l:rs1l,rs1n:rs1n,rs2l:rs2l,rs2n:rs2n,rs3l:rs3l,rs3n:rs3n,rs4l:rs4l,rs4n:rs4n,rs5l:rs5l,rs5n:rs5n});
  });
});
module.exports = router;
