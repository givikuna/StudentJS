const http = require('http');
const multer = require('../../../nodeModules/nodeMulter/node_modules/multer');
const express = require('../../../nodeModules/myExpress/node_modules/express');
const path = require("path");
const app = express();
console.log("1");

// View Engine Setup
app.set("views", path.join(__dirname, "views"));
console.log("2");
app.set("view engine", "ejs");
console.log("3");

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it

var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        // Uploads is the Upload_folder_name
        cb(null, "../img/");

    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + ".jpg");
    }
})
console.log("4");
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
console.log("5");

var upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {
        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }

        cb("Error: File upload only supports the "
            + "following filetypes - " + filetypes);
    }

    // mypic is the name of file attribute
}).single("mypic");
console.log("6");

app.get("/", function (req, res) {
    res.render("Signup");
})
console.log("7");
app.post("/uploadProfilePicture", function (req, res, next) {
    console.log("21");
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req, res, function (err) {

        if (err) {
            // ERROR occured (here it can be occured due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err);
            console.log(err);
        }
        else {
            // SUCCESS, image successfully uploaded
            res.send("Success, Image uploaded!");
        }
    })
})
console.log("8");

// Take any port number of your choice which
// is not taken by any other process
console.log("9");
app.listen(8099, function (error) {
    console.log("10");
    if (error) throw error;
    console.log("Server created Successfully on PORT 8099");
    console.log("11");
});
