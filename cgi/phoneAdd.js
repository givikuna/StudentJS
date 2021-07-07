const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {
    var infoFromURL = url.parse(req.url, true).query;
    var filePathLocation = "../data/phone.json";

    try {
        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        if (fs.existsSync(filePathLocation)) {
            console.log('ADD PHONE'); //
            var newArray = JSON.parse(infoFromURL.addNew);
            var phoneArrayTaken = fs.readFileSync("../data/phone.json").toString();
            var phoneMainArray = JSON.parse(phoneArrayTaken);
            var currentPartNum;
            var checker = false;
            var newArraySaver = newArray;
            for (let i = 0; i < phoneMainArray.length; i++) {
                if (phoneMainArray[i][0] == infoFromURL.currentPart) {
                    if (phoneMainArray[i][0].length == 1) { } else {
                        currentPartNum = i;
                        checker = false;
                        newArray = newArraySaver;
                        break;
                    }
                } else {
                    if (checker == false) {
                        newArray = [infoFromURL.currentPart, newArray];
                    }
                    currentPartNum = phoneMainArray.length - 1;
                    checker = true;
                }
            }

            fs.readFile("../data/phone.json", function (err, data) {
                var dataArray = JSON.parse(data);
                var dataArrayToString;
                if (checker == true) {
                    dataArray.push(newArray);
                    dataArrayToString = JSON.stringify(dataArray[currentPartNum + 1]);
                } else if (checker == false) {
                    dataArray[currentPartNum].push(JSON.parse(newArray));
                    dataArrayToString = JSON.stringify(dataArray[currentPartNum]);
                } else { }
                fs.writeFileSync("../data/phone.json", JSON.stringify(dataArray));
                res.write(dataArrayToString);
                return res.end();
            });
        } else {
            res.write("");
            return res.end();
        }
    } catch (error) {
        console.log(error); //
    }
}).listen(8089);
console.log('Server running at http://127.0.0.1:8086/'); //
