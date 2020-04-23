var express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    chalk = require("chalk"),
    methodOverride = require('method-override');


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/todo_lists")


var app = express();
var urlEncoded = (bodyParser.urlencoded({ extended: true }));

app.use(urlEncoded);
app.use(methodOverride('_method'));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");

// TODO SCHEMA

var TodoSchema = new mongoose.Schema({
    todo: String,
    date: { type: Date, Default: new Date() },
    description: String

})


var Todo = mongoose.model("Todo", TodoSchema);

// var List = Todo.create({
//     todo: "Play Guitar"

// }, function(err, result){
//     if(err){
//         console.log(err)
//     } else{
//         console.log(result)
//     }
// })



app.get("/", function (req, res) {
    Todo.find({}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.render("todos", { todos: result })
        }

    })

})

app.post("/", function (req, res) {
    var newTodo = new Todo({
        todo: req.body.add,
        description: req.body.description
    })

    Todo.create(newTodo, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    })

});

app.get("/:id/edit", function (req, res) {
    Todo.findById(req.params.id, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            res.render("edit", { todo: result })
        }
    })
})

app.patch("/:id", function (req, res) {

    Todo.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            console.log(req.params.id)
            console.log(req.body)
            console.log(result)
            res.redirect("/")
        }
    });
});

app.delete("/:id", function (req, res) {
    Todo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    })
})



// Todo.deleteMany({}, function(err){
//     if(err){
//         console.log(err)
//     } else{
//         console.log("deleted")
//     }
// })







app.listen(3000, function () {
    console.log(chalk.red("==============================TODO APP STARTED=========================================================================================="))
})