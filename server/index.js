const express = require("express");
const mongoose = require("mongoose");
const fileRoutes = require("./routes/taskRoutes");
const taskSocketEvents = require("./routes/taskSocketEvents");
const userSocketEvents = require("./routes/userSocketEvents");
const auth = require("./middlewares/authMiddleware");
const path = require("path");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

global.signature = "EsMeRaLdA_sHo_777";

io.on("connection", (socket) => {
    taskSocketEvents.RegisterSocketEvents(socket);
    userSocketEvents.RegisterSocketEvents(socket);
});

mongoose.connect("mongodb://127.0.0.1:27017/todo-tasks", {useUnifiedTopology: true, useNewUrlParser: true}, function(err) {
    if (err) return console.log(err);
});

app.use(express.json());

global.appRoot = path.resolve(__dirname);
app.use("/static", express.static("public/build"));
app.get("/tasks", (req, res) => {
    res.sendFile("index.html", {root: path.join(global.appRoot, "../public/build")});
});

app.use("/", fileRoutes);

http.listen(3000, () => console.log("Server is running"));