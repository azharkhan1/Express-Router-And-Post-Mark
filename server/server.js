// read: 
// Querying/reading data from database: https://mongoosejs.com/docs/models.html#querying
// deleting data from database: https://mongoosejs.com/docs/models.html#deleting
// updating data in database: https://mongoosejs.com/docs/models.html#updating


var express = require("express");
var morgan = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var bcrypt = require("bcrypt-inzi")
var jwt = require('jsonwebtoken'); // https://github.com/auth0/node-jsonwebtoken
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var server = express();
var path = require("path");
var authRoutes = require("./routes/auth");

server.use(morgan("dev"));
server.use(bodyParser.json());
server.use(cors({
    origin: "*",
    credentials: true,
}));
server.use(cookieParser());
var PORT = process.env.PORT || 7000;
var SERVER_SECRET = process.env.SECRET || "12ka4";

server.get("/download", (req, res) => {
    console.log(__dirname);
    res.sendFile(path.resolve(path.join(__dirname, "/package.json")))
})

server.use("/auth", authRoutes);

server.use("/",express.static(path.resolve(path.join(__dirname,"public"))));



server.use(function (req, res, next) {

    console.log("req.cookies: ", req.cookies);
    if (!req.cookies.jToken) {
        res.status(401).send("include http-only credentials with every request")
        return;
    }
    jwt.verify(req.cookies.jToken, SERVER_SECRET, function (err, decodedData) {
        if (!err) {

            const issueDate = decodedData.iat * 1000;
            const nowDate = new Date().getTime();
            const diff = nowDate - issueDate; // 86400,000

            if (diff > 300000) { // expire after 5 min (in milis)
                res.status(401).send("token expired")
            } else { // issue new token
                var token = jwt.sign({
                    id: decodedData.id,
                    userName: decodedData.userName,
                    userEmail: decodedData.userEmail,
                }, SERVER_SECRET)
                res.cookie('jToken', token, {
                    maxAge: 86_400_000,
                    httpOnly: true
                });
                req.body.jToken = decodedData
                next();
            }
        } else {
            res.status(401).send("invalid token")
        }
    });
})






server.listen(PORT, () => {
    console.log("server is running on: ", PORT);
})

