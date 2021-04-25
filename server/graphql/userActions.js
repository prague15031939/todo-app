const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

exports.loginUser = async function(args, request) {
    const valid = await userController.signIn(args.email, args.password);
    if (valid) {
        return valid.token.toString();
    }
    else {
        return null;
    }
}

exports.registerUser = async function(args, request) {
    const valid = await userController.signUp(args.username, args.email, args.password);
    if (valid) {
        return valid.token.toString();
    }
    else {
        return null;
    }
}

exports.getCurrentUser = async function(args, request) {
    const valid = auth.verifyToken(request);
    if (valid.error) {
        return null;
    }
    else {
        return valid;
    }
}