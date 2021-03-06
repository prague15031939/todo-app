const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

exports.RegisterSocketEvents = function(socket) {
    var id = (socket.id).toString();

    socket.on("login", async function (email, password, callback) {
        const valid = await userController.signIn(email, password); 
        if (valid)
            callback({status: 200, text: "authenticated", result: valid.token});
        else
            callback({status: 401, text: 'incorrect email or password'});
    });

    socket.on("register", async function (username, email, password, callback) {
        const valid = await userController.signUp(username, email, password);
        if (valid)
            callback({status: 200, text: "registered", result: valid.token});
        else
            callback({status: 401, text: 'incorrect email'});
    });

    socket.on("current", async function(callback) {
        const valid = auth.verifyToken(socket);
        if (valid.error) {
            callback({status: valid.status, text: valid.error}); 
            return;
        }

        callback({status: 200, result: valid});
    });
}