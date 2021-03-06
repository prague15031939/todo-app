const jwt = require("jsonwebtoken");
const cookie = require("cookie");

exports.verifyToken = function (socket) {
    const token = cookie.parse(socket.request.headers.cookie)["auth-token"];
    if (!token) {
        return {error: "unauthorized", status: 401};
    }

    try {
        const verified = jwt.verify(token, global.signature);
        return verified.data;
    } catch(err) {
        return {error: "invalid token", status: 401};
    } 
}