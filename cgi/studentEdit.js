const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer(function (req, res) {
    var infoFromURL = url.parse(req.url, true).query;
    var filePathLocation = "../data/data.json";
    try {
        console.log("EDIT STUDENT"); //
        var newArray = JSON.parse(infoFromURL.edit);

        if (fs.existsSync(filePathLocation)) {
            fs.readFile(filePathLocation, function (err, data) {
                var dataArray = JSON.parse(data);
                for (var i = 0; i < dataArray.length; i++) {
                    if (dataArray[i].uid == newArray.uid) {
                        dataArray[i] = newArray;
                    }
                }
                fs.writeFileSync(filePathLocation, JSON.stringify(dataArray));

                res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                res.write(JSON.stringify(dataArray));
                return res.end();
            });
        } else {
            res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
            res.write("");
            return res.end();
        }
    } catch (error) {
        console.log(error); //
    }
}).listen(8085);
console.log('Server running at http://127.0.0.1:8085/'); //
