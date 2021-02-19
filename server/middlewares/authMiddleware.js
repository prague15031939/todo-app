const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies["auth-token"];
    if (!token)
        return res.status(401).send("Unauthorized");

    try {
        const verified = jwt.verify(token, global.signature);
        req.currentUser = verified.data;
        next();
    } catch(err) {
        res.status(401).send("Invalid token");
    }    
}