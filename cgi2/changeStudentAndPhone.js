const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require("path");
const generatorIdModule = require('./modules/logger.js');
const fetch = require('../../../nodeModules/nodeFetch/node_modules/node-fetch');
const request = require('request');

http.createServer(function (req, res) {
    var infoFromURL = url.parse(req.url, true).query;
    var filePathLocationStudent = "../data/data.json";
    var filePathLocationPhone = "../data/phone.json";
    var theJob = infoFromURL.job;
    var thePhoneOrStudent = infoFromURL.phoneOrStudent;
    var runTheDownloadFunctionYorN = "n";

    try {
        if (thePhoneOrStudent == "student") {
            if (theJob == 'add') { //--------------------------------------------ADD STUDENT
                res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                var newArray = JSON.parse(infoFromURL.addNew);
                var newUID = generatorIdModule.generatorInfo();
                fs.writeFileSync('idGenerator.txt', newUID.toString());
                newArray.uid = newUID;
                newArray.img = newArray.uid + ".jpg";

                /*
                    const profilePictureURL = infoFromURL.imageInfo;
                */

                /*
                    function download(uri, filename, callback) {
                        if (runTheDownloadFunctionYorN == "n") { } else if (runTheDownloadFunctionYorN == "y") {
                            request.head(uri, function (err, res, body) {
                                // console.log('content-type:', res.headers['content-type']); //
                                // console.log('content-length:', res.headers['content-length']); //
        
                                request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                            });
                        } else { }
                    };

                    runTheDownloadFunctionYorN = "y";
                    download(profilePictureURL, "./img/" + newArray.img, function () {
                        console.log('STUDENT\'s PROFILE PICTURE HAS BEEN DOWNLOADED'); //
                    });
                */

                /*
                    async function download() {
                        const response = await fetch(profilePictureURL);
                        const buffer = await response.buffer();
                        fs.writeFile("./img/" + newArray.img, buffer, () =>
                            console.log("STUDENT\'s PROFILE PICTURE HAS BEEN DOWNLOADED"));
                    }

                    download();
                */

                console.log('STUDENT HAS BEEN ADDED'); //
                if (fs.existsSync(filePathLocationStudent)) {
                    fs.readFile(filePathLocationStudent, function (err, data) {
                        var dataArray = JSON.parse(data);
                        dataArray.push(newArray);
                        fs.writeFileSync(filePathLocationStudent, JSON.stringify(dataArray));
                        res.write(JSON.stringify(dataArray));
                        return res.end();
                    });
                } else {
                    res.write("");
                    return res.end();
                }
            } else if (theJob == 'edit') { //--------------------------------------------EDIT STUDENT
                console.log('STUDENT HAS BEEN EDITED'); //
                var newArray = JSON.parse(infoFromURL.edit);

                if (fs.existsSync(filePathLocationStudent)) {
                    fs.readFile(filePathLocationStudent, function (err, data) {
                        var dataArray = JSON.parse(data);
                        for (var i = 0; i < dataArray.length; i++) {
                            if (dataArray[i].uid == newArray.uid) {
                                dataArray[i] = newArray;
                            }
                        }
                        fs.writeFileSync(filePathLocationStudent, JSON.stringify(dataArray));

                        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                        res.write(JSON.stringify(dataArray));
                        return res.end();
                    });
                } else {
                    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                    res.write("");
                    return res.end();
                }
            } else { //--------------------------------------------DELETE STUDENT
                console.log("DELETE STUDENT"); //
                if (fs.existsSync(filePathLocationStudent)) {
                    var arraySentFromClient = infoFromURL.number;
                    //
                    fs.readFile("../data/phone.json", function (err, data) {
                        console.log("DELETED STUDENT\'s PHONE"); //
                        var dataArray = JSON.parse(data);
                        for (var i = 0; i < dataArray.length; i++) {
                            if (dataArray[i][0] == arraySentFromClient) {
                                dataArray.splice(i, 1);
                            }
                        }
                        fs.writeFileSync("../data/phone.json", JSON.stringify(dataArray));
                    });

                    fs.readFile(filePathLocationStudent, function (err, data) {
                        console.log("STUDENT HAS BEEN DELETED"); //
                        var dataArray = JSON.parse(data);
                        for (var i = 0; i < dataArray.length; i++) {
                            if (dataArray[i].uid == arraySentFromClient) {
                                dataArray.splice(i, 1);
                            }
                        }
                        fs.writeFileSync(filePathLocationStudent, JSON.stringify(dataArray));

                        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                        res.write(JSON.stringify(dataArray));
                        return res.end();
                    });
                } else {
                    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                    res.write("");
                    return res.end();
                }
            }
        } else {
            if (theJob == 'add') { //--------------------------------------------ADD PHONE
                res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                if (fs.existsSync(filePathLocationPhone)) {
                    console.log('STUDENT\'s NEW PHONE NUBMER HAS BEEN ADDED'); //
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
            } else if (theJob == 'edit') { //--------------------------------------------EDIT PHONE
                console.log("STUDENT\'s PHONE NUMBER HAS BEEN EDITED"); //
                var newArray = JSON.parse(infoFromURL.editFromIndexPhone35252007);

                filePathLocationPhone = "../data/phone.json";
                if (fs.existsSync(filePathLocationPhone)) {
                    fs.readFile(filePathLocationPhone, function (err, data) {
                        var dataArray = JSON.parse(data);

                        for (let i = 0; i < dataArray.length; i++) {
                            if (dataArray[i][0] == newArray[0]) {
                                dataArray[i] = newArray;
                            } else { }
                        }

                        fs.writeFileSync(filePathLocationPhone, JSON.stringify(dataArray));

                        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                        res.write(JSON.stringify(dataArray));
                        return res.end();
                    });
                } else {
                    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                    res.write("");
                    return res.end();
                }
            } else { //--------------------------------------------DELETE PHONE
                console.log("DELETING STUDENT\'s PHONE NUMBER"); //    
                var arraySentFromClient = JSON.parse(infoFromURL.phoneNumber3523);
                filePathLocationPhone = "../data/phone.json";
                if (fs.existsSync(filePathLocationPhone)) {
                    fs.readFile("../data/data.json", function (err, data) {
                        console.log("STUDENT\'s PHONE NUMBER HAS BEEN DELETE FROM THE STUDENT JSON FILE"); //
                        var currentIValue = JSON.parse(infoFromURL.iValueCurrent);
                        var dataArray = JSON.parse(data);
                        for (var i = 0; i < dataArray.length; i++) {
                            if (dataArray[i].uid == arraySentFromClient[0]) {
                                if (arraySentFromClient[1] != "") {
                                    dataArray[i].phone = arraySentFromClient[1];
                                    if (arraySentFromClient.length == 1 || arraySentFromClient.length == 2) {
                                        dataArray[i].secondPhone = null;
                                        dataArray[i].morePhones = "n";
                                    } else {
                                        dataArray[i].secondPhone = arraySentFromClient[2];
                                        dataArray[i].morePhones = "y";
                                    }
                                } else {
                                    dataArray[i].phone = "";
                                }
                            }
                        }
                        fs.writeFileSync("../data/data.json", JSON.stringify(dataArray));
                    });

                    fs.readFile(filePathLocationPhone, function (err, data) {
                        console.log("STUDENT\'s PHONE NUMBER HAS BEEN DELETED FROM PHONE NUMBER JSON"); //
                        var dataArray = JSON.parse(data);
                        for (var i = 0; i < dataArray.length; i++) {
                            if (dataArray[i][0] == arraySentFromClient[0]) {
                                dataArray[i] = arraySentFromClient;
                            }
                        }
                        fs.writeFileSync(filePathLocationPhone, JSON.stringify(dataArray));

                        res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                        res.write(JSON.stringify(dataArray));
                        return res.end();
                    });
                } else {
                    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
                    res.write("");
                    return res.end();
                }
            }
        }
        // -----------------------------------------------------------------------------------------------------------------------------
    } catch (error) {
        console.log(error); //
    }
}).listen(8086);
console.log('Server running at http://127.0.0.1:8086/'); //
