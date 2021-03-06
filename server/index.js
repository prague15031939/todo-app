const express = require("express");
const mongoose = require("mongoose");
const tasksRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/userRoutes");
const socketEvents = require("./routes/socketEvents");
const cookies = require("cookie-parser");
const path = require("path");
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);

global.appRoot = path.resolve(__dirname);
global.signature = "EsMeRaLdA_sHo_777";
app.use("/static", express.static("public/build"));

io.on("connection", (socket) => {
	var time = (new Date).toLocaleTimeString();
    console.log(`${socket.id} connected at ${time}`);
	socket.emit("connected", { 'name': socket.id, 'time': time });
    socketEvents.RegisterSocketEvents(socket);
});

mongoose.connect("mongodb://127.0.0.1:27017/todo-tasks", {useUnifiedTopology: true, useNewUrlParser: true}, function(err) {
    if (err) return console.log(err);
});

app.use(express.json());
app.use(cookies());

app.use("/", tasksRoutes);
app.use("/", usersRoutes);
http.listen(3000, () => console.log("Server is running"));