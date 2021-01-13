var express = require("express");
var bcrypt = require("bcrypt-inzi");
var jwt = require("jsonwebtoken");
var {userModel} = require("../derepo");
console.log("userModel:",userModel);

var api = express.Router();











api.post("/logout",(req,res,next)=>{
    res.cookie('jToken', "", {
        maxAge: 86_400_000,
        httpOnly: true
    });

    res.send("logout succesfully");

})

api.get("/profile", (req, res, next) => {
    userModel.findById(req.body.jToken.id, 'userName userEmail',
        function (err, doc) {
            if (!err) {

                res.send({
                    profile: doc
                })
            } else {
                res.status(500).send({
                    message: "server error"
                })
            }

        })
})

api.post("/signup", (req, res, next) => {

    if (!req.body.userEmail
        || !req.body.userPassword
        || !req.body.userName
    ) {

        res.status(403).send(`
            please send name, email, passwod, phone and gender in json body.
            e.g:
            {
                "name": "Azhar",
                "email": "azhar@gmail.com",
                "password": "abc",
            }`)
        return;
    }

    userModel.findOne({ userEmail: req.body.userEmail },
        (err, data) => {
            if (!err && !data) {
                bcrypt.stringToHash(req.body.userPassword).then(hashPassword => {

                    var newUser = new userModel({
                        userEmail: req.body.userEmail,
                        userPassword: hashPassword,
                        userName: req.body.userName,
                    });

                    newUser.save((err, data) => {
                        if (!err) {
                            console.log("user created");
                            res.status(200).send({
                                message: "Signed up succesfully",
                            })
                        }
                        else {
                            console.log("Could not save due to: " + err);
                            res.status(500).send("error is =>>" + err);
                        }
                    })
                })
            }
            else if (err) {
                res.status(500).send({
                    message: "Database error"
                })
            }
            else {
                res.status(409).send({
                    message: "user already exists",
                })
            }
        })
});

api.post("/login", (req, res, next) => {

    if (!req.body.userEmail || !req.body.userPassword) {
        res.status(403).send(`
            please send email and password in json body
            e.g:
            {
            userEmail : "abc@gmail.com",
            userPassword: "1234",
            }
         `)
        return;
    }

    userModel.findOne({ userEmail: req.body.userEmail }, (err, user) => {
        if (err) {
            res.status(503).send({
                message: "an error occured " + JSON.stringify(err),
            })
        }
        else if (user) {
            console.log(req.body.userPassword);
            console.log(user.userPassword);
            bcrypt.varifyHash(req.body.userPassword, user.userPassword).then(isMatched => {
                if (isMatched) {

                    var token =
                        jwt.sign({
                            id: user._id,
                            userEmail: user.userEmail,
                            userName: user.userName,
                            userPassword: user.userPassword,
                            ip: req.connection.remoteAddress
                        }, SERVER_SECRET)

                    res.cookie('jToken', token, {
                        maxAge: 86_400_000,
                        httpOnly: true
                    });

                    res.status(200).send({
                        message: "signed in succesfully",
                        user: {
                            userEmail: user.userEmail,
                            userName: user.userName,
                        },
                        token: token,
                    })
                } else {
                    res.status(409).send({
                        message: "Password not matched",
                    })
                }
            })
        }
        else {
            res.status(409).send({
                message: "User not found",
            })
        }
    })
})


module.exports = api;