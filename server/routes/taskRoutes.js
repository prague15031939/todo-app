const router = require("express").Router();
const taskController = require("../controllers/taskController")
const path = require("path");

router.get("/tasks", (req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public")});
});

router.post("/api/add", async (req, res) => {
    const saved = await taskController.add(req.body);
    if (saved)
        res.status(200).send(saved);
    else
        res.status(400).send("an error occured");
});

router.get("/api/all", async (req, res) => {
    const saved = await taskController.getAll();
    console.log(saved);
    if (saved)
        res.status(200).send(saved);
    else
        res.status(400).send("an error occured");
});

module.exports = router;