require('dotenv').config(); 

var Express = require("express");
var Mongoclient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer");
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

var app = Express();
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
    origin: ["http://localhost:5038", "https://todoappturawa.onrender.com"]
}));

var CONNECTION_STRING = process.env.CONNECTION_STRING;
var DATABASE_NAME = process.env.DATABASE_NAME;
var database;

// get all connections
app.get('/api/todoapp/getAll', (request, response) => {
    database.collection('todoappcollection').find({}).toArray((error, result) => {
        response.send(result);
    })
});

// add notes
app.post('/api/todoapp/addNote', multer().none(), (request, response) => {
    database.collection("todoappcollection").count({}, function(error, numOfDucs){
        database.collection("todoappcollection").insertOne({
            id:(numOfDucs+1).toString(),
            description:request.body.newNotes
        });
        response.json("Added Succesfully");
    })
});

// delete note
app.delete('/api/todoapp/deleteNote', (request, response) => {
    database.collection("todoappcollection").deleteOne({
        id: request.query.id
    })
    .then(() => {
        response.json("Deleted Successfully");
    })
    .catch(error => {
        console.error('Error deleting note:', error);
        response.status(500).json({ error: 'Internal server error' });
    });
});

app.listen(5038, () => {
    Mongoclient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASE_NAME);
        console.log("Mother Fucker is Runing On 5038");
    })
});
