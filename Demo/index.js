const express = require('express');
const app = express();
const books = require('./books.js');
let config = require('./db/db.js');
var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(function (req, res, next) {
    MongoClient.connect(config.database, function (err, db) {
        if (err) {
            console.log(err);
        } else {
            req.db = db;
        }
        next();
    });
})


app.get('/books-json', function (req, res) {
    res.json(books);
})

app.get('/books', function (req, res) {
    req.db.collection('books').find().toArray(function (err, items) {
        if (err) {
            res.send(err);
        } else {
            res.json(items);
        }
        req.db.close();
    });

})

app.get('/books/:id', function (req, res) {
    var id = req.params.id;
    req.db.collection('books').find({'_id': new ObjectId(id)}).toArray(function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result)
        }
    })
})

app.del('/books/:id', function (req, res) {
    let id = req.params.id;
    req.db.collection('books').deleteOne({'_id': new ObjectId(id)}, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
    })
})

app.post('/books', function (req, res) {
    req.db.collection('books').insert(req.body, function (err, result) {
        if (err) {
            res.send(err);
        } else {
            res.json(result);
        }
        req.db.close();
    })
})

app.listen('3000', function () {
    console.log('app is listing on the port 3000')
})