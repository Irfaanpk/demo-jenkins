const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongo:27017/tasks")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

const Task = mongoose.model("Task", {
    title: String,
    completed: Boolean
});

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

app.post("/tasks", async (req, res) => {

    const task = new Task(req.body);

    await task.save();

    res.send(task);
});

app.get("/tasks", async (req, res) => {

    const tasks = await Task.find();

    res.send(tasks);
});

app.delete("/tasks/:id", async (req, res) => {

    await Task.findByIdAndDelete(req.params.id);

    res.send({
        message: "Deleted"
    });
});

app.listen(5000, () => {

    console.log("Backend running on port 5000");
});
