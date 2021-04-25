const router = require("express").Router();
const taskController = require("../controllers/taskController")
const path = require("path");

router.get("/tasks", (req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public/build")});
});

router.get('/api/tasks/download/:id/:file', async (req, res) => {
    const task = await taskController.getById(req.params.id);
    const fileName = req.params.file;
    const file = task.files.find(item => item.includes(fileName));
    if (file)
        res.download(file);
    else
        res.status(400).send("an error occured");
});

module.exports = router;