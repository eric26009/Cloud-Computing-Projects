var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var http = require("https");
var express = require('express');
const storage = require('azure-storage');
const azure = require('azure');
const { BlobServiceClient} = require('@azure/storage-blob');
var router = express.Router();
const Http = new XMLHttpRequest();
const connectionString = "DefaultEndpointsProtocol=https;AccountName=program5;AccountKey=REPLACE WITH ACCOUNT KEY;TableEndpoint=https://program5.table.cosmos.azure.com:443/;";
const tableSvc = storage.createTableService(connectionString);
const blobServiceClient =  new BlobServiceClient.fromConnectionString("DefaultEndpointsProtocol=https;AccountName=program5storage1;AccountKey=REPLACE WITH ACCOUNT KEY;EndpointSuffix=core.windows.net");
const accountSid = 'REPLACE WITH accountSID KEY';
const authToken = 'REPLACE WITH authToken KEY';
const client = require('twilio')(accountSid, authToken);
const phones = ['replace with phoneNumber1','replace with phoneNumber2'];

/* GET users listing. */

router.get('/', function(req, res1) {
    var firstError = 0;
    var people = req.query.people;
    var searchInput = req.query.searchInput;
    var dest_id;
    var name;
    var region;
    var dest_type;
    var longitude;
    var latitude;
    var hotelName = "not available"
    var address = "not available"
    var price = "not available"
    var currency = "not available";
    var reviewScore = "not available";
    var locationScore = "not available";
    var bookingLink;
    var photoLink;
    var locationLink;
    // getting current date and next date
    const today = new Date()
    today.setDate(today.getDate() + 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var ddT = String(tomorrow.getDate()).padStart(2, '0');
    var mmT = String(tomorrow.getMonth() + 1).padStart(2, '0'); 
    var yyyyT = tomorrow.getFullYear();
    var tmrwDate = yyyyT+"-"+mmT+"-"+ddT;
    var todayDate = yyyy+"-"+mm+"-"+dd;
    // console.log(todayDate);
    // console.log(tmrwDate);

    // escaping whitespace and special characters
    searchInput = encodeURIComponent(searchInput);
    // console.log("Number of people: "+people);


    // *************************
    // *************************
    // This is the beginning of the API calls

    var AutoCompleteOptions = {
        "method": "GET",
        "hostname": "apidojo-booking-v1.p.rapidapi.com",
        "port": null,
        "path": "/locations/auto-complete?languagecode=en-us&text="+searchInput,
        "headers": {
            "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
            "x-rapidapi-key": "REPLACE WITH API KEY"
        }
    };
    var req1 = http.request(AutoCompleteOptions, function (res) {
        var chunks = [];
    
        res.on("data", function (chunk) {
            chunks.push(chunk);
        });
    
        res.on("end", function () {
            try{
                var body = Buffer.concat(chunks);
                var obj = JSON.parse(body);
                // console.log(obj[0].dest_id.toString());
                dest_id = obj[0].dest_id.toString();
                // console.log(obj[0].dest_type.toString());
                dest_type = obj[0].dest_type.toString();
                name = obj[0].name.toString();
                region = obj[0].region.toString();
                locationLink =  obj[0].image_url.toString();
            }
            catch(error) {
                firstError = 1;
                console.log("Error has occured in API call..");
                hotelName = "Error has occured!";
                for(number of phones){
                    client.messages
                    .create({
                        body: 'Booking.com API error has occured, error in results returned from autocomplete',
                        from: '+12512610151',
                        to:   number
                    })
                    .then(message => console.log(message.sid));
                } 
              }


            var hotelOptions = {
                "method": "GET",
                "hostname": "apidojo-booking-v1.p.rapidapi.com",
                "port": null,
                "path": "/properties/list?price_filter_currencycode=USD&search_id=none&order_by=price&languagecode=en-us&search_type="+dest_type+"&offset=0&dest_ids="+dest_id+"&guest_qty="+people+"&arrival_date="+todayDate+"&departure_date="+tmrwDate+"&room_qty=1",
                "headers": {
                    "x-rapidapi-host": "apidojo-booking-v1.p.rapidapi.com",
                    "x-rapidapi-key": "REPLACE WITH API KEY"
                }
            };
            var req2 = http.request(hotelOptions, function (res) {
                var chunks = [];
            
                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });
            
                res.on("end", function () {
                    try{
                        var body = Buffer.concat(chunks);
                        var obj = JSON.parse(body);
                        // console.log(obj.result[0].hotel_name);
                        hotelName = obj.result[0].hotel_name.toString();
                        // console.log(obj.result[0].address);
                        address = obj.result[0].address;
                        // console.log(obj.result[0].price_breakdown.gross_price);
                        price = obj.result[0].price_breakdown.gross_price;
                        // console.log(obj.result[0].price_breakdown.currency);
                        currency = obj.result[0].price_breakdown.currency;
                        // console.log(obj.result[0].url);
                        bookingLink = obj.result[0].url;
                        // console.log(obj.result[0].main_photo_url);
                        photoLink = obj.result[0].main_photo_url;
                        longitude = obj.result[0].longitude;
                        latitude = obj.result[0].latitude;
                        reviewScore = obj.result[0].review_score;
                        locationScore = obj.result[0].location_score;
                        var titlePrint = "Result for "+name;
                    }
                    catch(error) {
                        if(firstError != 1){
                            console.log("Error in API call has occured!");
                            hotelName = "Error has occured!";
                            client.messages
                            .create({
                                body: 'Booking.com API error has occured in results returned from hotel search',
                                from: '+12512610151',
                                to:   ['+12068531380','+12066978623']
                            })
                            .then(message => console.log(message.sid));
                        }
                      }
                    res1.render('results.pug', {message:titlePrint, hotelName:hotelName, address:address,currency:currency,price:price,ltIn:latitude, lnIn:longitude, photoLink:photoLink, bookingLink:bookingLink, name:name, region:region, locationLink:locationLink, people:people, locationScore:locationScore, reviewScore:reviewScore});
                });
            });

            req2.on('error', (e) => {
                client.messages
                    .create({
                        body: 'Booking.com API server error has occured during hotel search',
                        from: '+12512610151',
                        to:   ['+12068531380','+12066978623']
                    })
                    .then(message => console.log(message.sid));
        
                });

            req2.end();
        });
    });

    req1.on('error', (e) => {
        client.messages
            .create({
                body: 'Booking.com API server error has occured during autocomplete search',
                from: '+12512610151',
                to:   ['+12068531380','+12066978623']
            })
            .then(message => console.log(message.sid));

        });

    req1.end();


    // *************************
    // *************************
    // This is the end of the API calls

});

module.exports = router;