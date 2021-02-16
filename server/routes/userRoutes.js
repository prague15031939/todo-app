const router = require("express").Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");

router.post("/api/user/login", async (req, res) => {
    const valid = await userController.singIn(req.body.email, req.body.password);
    if (valid) {
        res.cookie("auth-token", valid.token, { httpOnly: true, maxAge: 20000 }).send("authenticated");
    }
    else {
        res.status(401).send("incorrect email or password");
    }
});

router.get("/api/user/current", auth, async (req, res) => {
    if (req.currentUser)
        res.status(200).send(req.currentUser);
    else
        res.status(400).send("an error occured");
});

module.exports = router;