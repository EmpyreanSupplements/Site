var express = require('express');
var router = express.Router();
const {MongoClient} = require("mongodb");
const crypto = require("crypto");
const client = new MongoClient("mongodb+srv://rubensspy1:eusoulindo@mysite.suxiemd.mongodb.net/?retryWrites=true&w=majority");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash("sha256");
    const hash = sha256.update(password).digest("base64");
    return hash;
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString("hex");
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    const user = global.authTokens[req.cookies['AuthToken']];
    res.render('login', { title: 'FlyBetter | Login', user });
});

module.exports = router;
