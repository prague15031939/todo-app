const express = require("express");
const mongoose = require("mongoose");
const tasksRoutes = require("./routes/taskRoutes");
const usersRoutes = require("./routes/userRoutes");
const cookies = require("cookie-parser");
const graphqlConfig = require("./graphql/graphqlConfig");
const path = require("path");
const app = express();

global.appRoot = path.resolve(__dirname);
global.signature = "EsMeRaLdA_sHo_777";
app.use("/static", express.static("public/build"));

mongoose.connect("mongodb://127.0.0.1:27017/todo-tasks", {useUnifiedTopology: true, useNewUrlParser: true}, function(err) {
    if (err) return console.log(err);
});

app.use(express.json());
app.use(cookies());

app.use('/graphql', graphqlConfig.Create());

app.use("/", tasksRoutes);
app.use("/", usersRoutes);
app.listen(3000, () => console.log("Server is running"));