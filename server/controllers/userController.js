const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signUp = async function(username, email, password) {
    if (await userExists(email))
        return null;

    const hash = await argon2.hash(password);
    const userItem = new User({
        username: username,
        email: email,
        hash: hash,
    });
    const userRecord = await userItem.save();

    return {
        token: generateJWT(userRecord),
    }
}

exports.singIn = async function(email, password) {
    const userRecord = await userExists(email);
    if (userRecord && await argon2.verify(userRecord.hash, password)) {
        return {
            token: generateJWT(userRecord),
        }
    }
    return null;
}

async function userExists(email) {
    return await User.exists({ email: email });
}

function generateJWT(user) {
    const data = {
        id: user._id,
        username: user.username,
        email: user. email,
    };
    const signature = global.signature;

    return jwt.sign({ data }, signature, { expiresIn: "6h" });
}