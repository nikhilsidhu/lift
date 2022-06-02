const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');
const Set = require('./models/set')
const temporalDate = require('./public/javascripts/temporalDate.js');
const forms = require('./public/javascripts/forms.js');
const workout = require('./models/workout');

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

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {


    res.render('home');
})

app.get('/workouts', async (req, res) => {
    const workouts = await Workout.find({});
    res.render('workouts/index', { workouts, temporalDate, });

})

app.post('/workouts', async (req, res) => {
    const workout = new Workout(req.body.workout);
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
})

app.get('/workouts/new', (req, res) => {
    res.render('workouts/new');
})

app.get('/workouts/:id', async (req, res) => {
    const workout = await Workout.findById(req.params.id)
        .populate({
            path: 'exercises',
            model: 'Exercise',
            populate: {
                path: 'sets',
                model: 'Set'
            }
        })
    res.render('workouts/show', { workout, temporalDate });
})

app.get('/workouts/:id/edit', async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
})


app.put('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    res.redirect(`/workouts/${workout._id}`);
})

app.delete('/workouts/:id', async (req, res) => {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.redirect('/workouts');
})

app.post('/workouts/:id/exercises', async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = new Exercise(req.body.exercise);
    workout.exercises.push(exercise);
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
})

app.delete('/workouts/:id/exercises/:exerciseId', async (req, res) => {
    const { id, exerciseId } = req.params;
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/workouts/${id}`);
})

app.post('/workouts/:id/exercises/:eid/sets', async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = await Exercise.findById(req.params.eid);
    const set = new Set(req.body.set);
    exercise.sets.push(set);
    await set.save();
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}/?exercise=exercise`);
})

app.put('/workouts/:id/exercises/:exerciseId/sets/:setId', async (req, res) => {
    const { id } = req.params;
    const { exerciseId } = req.params;
    const setId = req.params.setId;

    //await Exercise.findByIdAndUpdate(exerciseId, { $pull: })

    const set = Set.findById(setId);

    //await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    await Set.findByIdAndUpdate(setId, { ...req.body.set });

    res.redirect(`/workouts/${id}`);
})

app.delete('/workouts/:id/exercises/:exerciseId/sets/:setId', async (req, res) => {
    const workoutId = req.params.id;
    const exerciseId = req.params.exerciseId;
    const setId = req.params.setId;
    await Exercise.findByIdAndUpdate(exerciseId, { $pull: { sets: setId } })
    await Set.findByIdAndDelete(req.params.setId);
    res.redirect(`/workouts/${workoutId}`);
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})