var express = require('express');
var router = express.Router();
const storage = require('azure-storage');
const azure = require('azure');
const { BlobServiceClient} = require('@azure/storage-blob');
const uuidv1 = require('uuid/v1');
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program4database;AccountKey=REPLACE WITH KEY;TableEndpoint=https://program4database.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);
const blobServiceClient =  new BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=ericeldmanstorage;AccountKey=REPLACE WITH KEY;EndpointSuffix=core.windows.net");


/* GET users listing. */

router.post('/', function(req, res, next) {
    var text = "Recieved delete command";
    tableSvc.deleteTable('Program4Data', function(error, response){
        if(!error){
            // Table deleted
            setTimeout(function(){  }, 500);
        }
        if(error)res.render('error',{message:'Could not delete Azure table', error:error});
    });
    tableSvc.createTableIfNotExists('Program4Data', function(error, result, response){
        if(!error){
            setTimeout(function(){  }, 500);
        }
        if(error)res.render('error',{message:'Could not create blank Azure table', error:error});
        });
    var blankData = "";
    const containerClient =  blobServiceClient.getContainerClient('program4file');
    const blobName = 'data.txt';
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    blockBlobClient.delete();
    res.render('error',{message:'Success!', error:text});
});

module.exports = router;