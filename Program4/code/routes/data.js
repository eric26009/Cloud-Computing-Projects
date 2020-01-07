var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
const storage = require('azure-storage');
const azure = require('azure');
const { BlobServiceClient} = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
var router = express.Router();
const Http = new XMLHttpRequest();
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program4database;AccountKey=REPLACE WITH KEY;TableEndpoint=https://program4database.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);
const blobServiceClient =  new BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=ericeldmanstorage;AccountKey=REPLACE WITH KEY;EndpointSuffix=core.windows.net");
/* GET users listing. */

router.post('/', function(req, res, next) {
    var url = req.param('url').toString();
    var text = "Recieved URL input: "+url;
    tableSvc.createTableIfNotExists('Program4Data', function(error, result, response){
    if(!error){
        setTimeout(function(){  }, 500);
    }
    });

    // (process(url));
    Http.open("GET", url);
    Http.send();
    Http.responseType = "text";
    Http.onreadystatechange= function(){
        if (this.readyState == 4 && this.status == 200) {
            console.log(String(Http.responseText));
            var results = Http.responseText;
            // Saving to blob storage
            const containerName = 'program4file';
            const containerClient =  blobServiceClient.getContainerClient(containerName);
            const blobName = 'data.txt';
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            blockBlobClient.upload(String(results), String(results).length);
            results = results.split(/\r?\n/);
            for (var i = 0; i < results.length; i++) {
                if(results[i].length ==0) continue;
                var lineSplit = results[i].trim().match(/\S+/g) || [];
                console.log(i+": "+lineSplit);
                
                var entGen = azure.TableUtilities.entityGenerator;
                var task = {
                    PartitionKey: entGen.String('People'),
                    RowKey: entGen.String(lineSplit[1]+", "+lineSplit[0]),
                    firstName: entGen.String(lineSplit[1]),
                    lastName: entGen.String(lineSplit[0]),
                };
                    for(var a=2; a<lineSplit.length;a++){
                        var splitEq = lineSplit[a].split("=");
                        task["__"+splitEq[0]] = entGen.String(splitEq[1]);
                    
                    console.log(task);
                }
            
                tableSvc.createTableIfNotExists('Program4Data', function(error, result, response){
                    if(!error){
                    }
                    });
                tableSvc.insertOrReplaceEntity('Program4Data',task, function (error, result, response) {
                    if(!error){
                        console.log(JSON.stringify(error)+" "+JSON.stringify(result)+" "+JSON.stringify(response));
                    }
                    if(error){
                        console.log(JSON.stringify(error)+" "+JSON.stringify(result)+" "+JSON.stringify(response));
                    }
                });
            }
         }
    }
    res.render('error', {message:'Success, data uploaded!', error:''});
});

module.exports = router;