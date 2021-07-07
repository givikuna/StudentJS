const http = require('http');
const fs = require('fs');
const url = require('url');

const imagePath = "../img/";
const contentImagePath = "../www/images/";
const noImageFile = imagePath + "noImage.png";

http.createServer(function (req, res) {
    console.log("image"); //
    var infoFromURL = url.parse(req.url, true).query;
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    try {
        if (infoFromURL.type == "data") {
            var filePathLocation = imagePath + infoFromURL.img;
            if (fs.existsSync(filePathLocation)) {
                fs.readFile(filePathLocation, function (err, data) {
                    res.write(data);
                    return res.end();
                });
            } else if (fs.existsSync(noImageFile)) {
                fs.readFile(noImageFile, function (err, data) {
                    res.write(data);
                    return res.end();
                });
            } else {
                res.write("");
                return res.end();
            }
        } else if (infoFromURL.type == "content") {
            var contentTypeName = infoFromURL.img;
            var filePathLocation = contentImagePath + contentTypeName;
            if (fs.existsSync(filePathLocation)) {
                fs.readFile(filePathLocation, function (err, data) {
                    res.write(data);
                    return res.end();
                });
            } else if (fs.existsSync(noImageFile)) {
                fs.readFile(noImageFile, function (err, data) {
                    res.write(data);
                    return res.end();
                });
            } else {
                res.write("");
                return res.end();
            }
        }
    } catch (error) {
        console.log("error: " + error); //
    }
}).listen(8082);
console.log('Server running at http://127.0.0.1:8082/'); //

// http://localhost:8082/?img=1.jpg or noimage.jpg
