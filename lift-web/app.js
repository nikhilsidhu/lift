const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const Workout = require('./models/workout');

mongoose.connect('mongodb://localhost:27017/lift');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {ft

    res.render('home');
})

app.get('/workouts', async (req, res) => {
    const workouts = await Workout.find({});
    res.render('workouts/idnex');

})



app.get('/addworkout', async (req, res) => {
    const workout = new Workout({workoutName: 'Upper #1', workoutDate: 01-01-2000, workoutTime: 2000});
    await workout.save();

    res.send(workout);
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})