const express = require('../../../nodeModules/myExpress/node_modules/express');
const app = express();
const path = require('path');
const fs = require('fs');
const url = require('url');

app.get('/', function (req, res) {
    var infoFromURL = url.parse(req.url, true).query;
    if (infoFromURL.type == "index") {
        console.log("index"); //
        var indexFilePath = path.join(__dirname, "../www", "index.htm");
        fs.access(indexFilePath, fs.F_OK, (err) => {
            if (err) {
                console.error(err); //
                res.send("Error to finding index file");
                return;
            }
            res.sendFile(indexFilePath);
        })
    } else if (infoFromURL.type == "phone") {
        console.log("indexPhone"); //
        var indexFilePath = path.join(__dirname, "../www", "indexPhone.htm");
        fs.readFile(indexFilePath, 'utf-8', function (err, data) {
            var dataToString = data.toString();
            var replaced = dataToString.replace('@uidNumberHere', infoFromURL.studentUid);
            res.write(replaced);
            return res.end();
        });
    } else {
        console.log("error"); //
        var indexFilePath = path.join(__dirname, "../www", "error.htm");
        fs.access(indexFilePath, fs.F_OK, (err) => {
            if (err) {
                console.error(err); //
                res.send("Error to finding index file");
                return;
            }
            res.sendFile(indexFilePath);
        })
    }
});
app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/'); //
