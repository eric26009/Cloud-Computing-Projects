var express = require('express');
var router = express.Router();
const storage = require('azure-storage');
const azure = require('azure');
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program4database;AccountKey=REPLACE WITH KEY;TableEndpoint=https://program4database.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);
    


/* GET users listing. */
router.get('/', function(req, res, next) {
    var first = req.query.first_name;
    var last = req.query.last_name;
    var text = "Recieved:"+'<br />' +"&nbsp;&nbsp;&nbsp;&nbsp First name:&nbsp;"+first+ '<br />'+"       "+"&nbsp;&nbsp;&nbsp;&nbsp Last name:&nbsp;"+last;
    if(last == "" && first != ""){
      var query = new azure.TableQuery().top(20).where('firstName eq ?', first);
    }
    if(first == "" && last !=""){
      var query = new azure.TableQuery().top(20).where('lastName eq ?', last);
    }
    if(first == "" && last ==""){
      res.render('error',{message:'Error!', error:"No parameters given."});
      return;
    }
    if(first != "" && last !=""){
      var query = new azure.TableQuery().top(20).where('firstName eq ? and lastName eq ? ', first, last);
    }

    tableSvc.queryEntities('Program4Data',query, null, function(error, result, response) {
      if(!error) {
        console.log(result.entries);
        // console.log(typeof result.entries[0]);
        var dataPrint = JSON.stringify(result.entries);
        var count = 0
        var textOut = "<hr style='border: 1px dashed black;'/>";;
        result.entries.forEach(function(element) {
          count=0
          // console.log(element);
          for(var value in element){
            count=count+1
            if(count <3){ continue}
            // console.log(value);
            textOut+="<b>"+value+"</b>: ";
              for(var value2 in element[value]){
                textOut+=element[value][value2]+",  ";
                if(count==4)textOut+="<br>";
                // console.log(element[value][value2]);
            }
          }
          textOut+="<br><br><hr style='border: 1px dashed black;'/>";
        });
          
        
        res.render('data_display',{ title: 'Queried Results', first:first, last:last, dataPrint:dataPrint, dataInput:textOut});
        console.log("NO ERROR");
      }
      if(error)res.render('error',{message:'Need to load data first!', error:error});
    });
    
});

module.exports = router;