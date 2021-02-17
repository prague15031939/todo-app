const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.post("/api/user/login", async (req, res) => {
    const valid = await userController.signIn(req.body.email, req.body.password);
    if (valid) {
        res.cookie("auth-token", valid.token, { httpOnly: true, maxAge: 60000 }).send("authenticated");
    }
    else {
        res.status(401).send("incorrect email or password");
    }
});

router.post("/api/user/register", async (req, res) => {
    const valid = await userController.signUp(req.body.username, req.body.email, req.body.password);
    if (valid) {
        res.cookie("auth-token", valid.token, { httpOnly: true, maxAge: 60000 }).send("registered");
    }
    else {
        res.status(401).send("incorrect email");
    }
});

router.get("/api/user/current", auth, async (req, res) => {
    if (req.currentUser)
        res.status(200).send(req.currentUser);
    else
        res.status(400).send("an error occured");
});

module.exports = router;