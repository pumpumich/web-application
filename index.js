import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

function Post(postHeader, postText, id){
    this.postHeader = postHeader;
    this.postText = postText;
    this.date = `${day}/${month}/${year}`;
    this.id = id;
};

var postsWall = new Map();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", {
        postsWall: postsWall
    });
});

app.get("/post", (req, res) => {
    res.render("post.ejs", {
        postsWall: postsWall
    });
});

app.post("/post", (req, res) => {
    var newPost = new Post(req.body['header'], req.body['textPost'], req.body['id']);
    postsWall.set(req.body['id'], newPost);
    res.render("post.ejs", {
        postsWall : postsWall});
});

app.post("/deletePost", (req, res) => {

    console.log(req.headers.referer);
    postsWall.delete(req.body.id);
    if(req.headers.referer.includes("/post")){
    res.render("post.ejs", {
        postsWall : postsWall});
    } else{
        res.render("index.ejs", {
            postsWall: postsWall
        });
    }   
});

app.post("/editPost", (req, res) => {
    
    console.log(postsWall.get(req.body.id));
    var editedPost = postsWall.get(req.body.id);
    res.render("edit.ejs", {
        postsWall: postsWall,
        editedPost: editedPost
    });
});

app.post("/saveChanges", (req, res) => {
    var newPost = new Post(req.body['header'], req.body['textPost'], req.body['id']);
    postsWall.set(req.body['id'], newPost);
    res.render("post.ejs", {
        postsWall : postsWall});
});

app.post("/discardChanges", (req, res) => {
    res.render("post.ejs", {
        postsWall : postsWall});
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
  