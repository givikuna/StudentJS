const http = require('http');
const fs = require('fs');
const url = require('url');
const generatorIdModule = require('./modules/logger.js');

http.createServer(function (req, res) {
    var infoFromURL = url.parse(req.url, true).query;
    var filePathLocation = "../data/data.json";

    try {
        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
        var newArray = JSON.parse(infoFromURL.addNew);
        var newUID = generatorIdModule.generatorInfo();
        fs.writeFileSync('idGenerator.txt', newUID.toString());
        newArray.uid = newUID;
        newArray.img = newArray.uid + ".jpg";

        console.log('ADD'); //
        if (fs.existsSync(filePathLocation)) {
            fs.readFile(filePathLocation, function (err, data) {
                var dataArray = JSON.parse(data);
                dataArray.push(newArray);
                fs.writeFileSync(filePathLocation, JSON.stringify(dataArray));
                res.write(JSON.stringify(dataArray));
                return res.end();
            });
        } else {
            res.write("");
            return res.end();
        }
    } catch (error) {
        console.log(error); //
    }
}).listen(8086);
console.log('Server running at http://127.0.0.1:8086/'); //
