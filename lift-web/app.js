const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {ft

    res.render('home');
})

app.get('/workouts', async (req, res) => {
    const workouts = await Workout.find({});
    res.render('workouts/index', { workouts });

})

app.get('/workouts/new', (req, res) => {
    res.render('workouts/new');
})

app.post('/workouts', async (req, res) => {
    const workout = new Workout(req.body.workout);
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
})

app.get('/workouts/:id', async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/show', { workout });
})

app.get('/workouts/:id/edit', async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
})


app.put('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, {...req.body.workout});
    res.redirect(`/workouts/${workout._id}`);
})

app.delete('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.redirect('/workouts');
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})