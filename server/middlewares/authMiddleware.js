const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies["auth-token"];
    if (!token)
        return res.status(401).send("Access denied");

    try {
        const verified = jwt.verify(token, global.signature);
        console.log(verified);
        next();
    } catch(err) {
        res.status(401).send("Invalid token");
    }    
}