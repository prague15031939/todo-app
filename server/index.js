const express = require("express");
const tasks = require("./routes/tasks");
const app = express();

app.use("/", tasks);

app.listen(3000, () => console.log("Server is running"));