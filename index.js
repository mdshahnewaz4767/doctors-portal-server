const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
const port = 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mkcgo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const appointmentCollection = client.db("doctorsPortal").collection("appointments");
  

    //insert data to the database
    app.post('/addAppointment', (req, res) => {
        const appointment = req.body;
        appointmentCollection.insertOne(appointment)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    //load specific data from the database
    app.post('/appointmentsByDate', (req, res) => {
        const date = req.body;
        console.log(date.date);
        appointmentCollection.find({date: date.date})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    //load all data
    app.get('/appointments', (req, res) => {
        appointmentCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })


});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port);