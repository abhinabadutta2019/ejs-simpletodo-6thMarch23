//Inport dependencies

const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override"); //
const mongoose = require("mongoose");

//Establishing mongoose
const DATABASE_URL = "mongodb://127.0.0.1:27017/07th-March";
const CONFIG = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
// Establish Connection
mongoose.connect(DATABASE_URL, CONFIG);
// Events for when connection opens/disconnects/errors
mongoose.connection
  .on("open", () => console.log("Connected to Mongoose"))
  .on("close", () => console.log("Disconnected from Mongoose"))
  .on("error", (error) => console.log(error));

//Model
const Schema = mongoose.Schema;

const todoSchema = new Schema({ text: String });

const Todo = mongoose.model("Todo", todoSchema);

// Create our Express Application Object
const app = express();
// Middleware
app.use(morgan("tiny")); //logging
app.use(methodOverride("_method")); // override for put and delete requests from forms
app.use(express.urlencoded({ extended: true })); // parse urlencoded request bodies
app.use("/static", express.static("static")); // serve files from public statically

//Routes
/////////////////////////////////////////////////////////
// get
app.get("/", async (req, res) => {
  //get todos
  const todos = await Todo.find({});
  //render index.ejs
  res.render("index.ejs", { Todos: todos });
});

// //seed
// app.get("/seed", async (req, res) => {
//   // delete all existing todos
//   await Todo.removeAllListeners({});
//   //add sample todos
//   await Todo.create([
//     { text: "Eat aBreakfast" },
//     { text: "Eat Lunch" },
//     { text: "Eat Dinner" },
//   ]);
//   // redirect back to main page
//   res.redirect("/");
// });

//post route
app.post("/todo", async (req, res) => {
  //create the new todo
  await Todo.create(req.body);
  //redirect to main page
  res.redirect("/");
});

//delete route
app.delete("/todo/:id", async (req, res) => {
  //get the id from params
  //delete by id
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// Server Listener
const PORT = 3004;
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));
