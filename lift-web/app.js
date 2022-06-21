const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');
const Set = require('./models/set')
const temporalDate = require('./utils/temporalDate.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const forms = require('./public/javascripts/forms.js');
const workout = require('./models/workout');
const { workoutSchema } = require('./schemas');


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

const validateWorkout = (req, res, next) => {
    const { error } = workoutSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/workouts', catchAsync(async (req, res) => {
    const workouts = await Workout.find({});
    res.render('workouts/index', { workouts, temporalDate, });

}))

app.post('/workouts', validateWorkout, catchAsync(async (req, res) => {
    // if (!req.body.workout) throw new ExpressError('Invalid Workout Data', 400);
    const workout = new Workout(req.body.workout);
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}))

app.get('/workouts/new', (req, res) => {
    res.render('workouts/new');
})

app.get('/workouts/:id', catchAsync(async (req, res) => {
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
}))

app.get('/workouts/:id/edit', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id)
    res.render('workouts/edit', { workout });
}))


app.put('/workouts/:id', validateWorkout, catchAsync(async (req, res) => {
    const { id } = req.params;
    const workout = await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    res.redirect(`/workouts/${workout._id}`);
}))

app.delete('/workouts/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Workout.findByIdAndDelete(id);
    res.redirect('/workouts');
}))

app.post('/workouts/:id/exercises', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = new Exercise(req.body.exercise);
    workout.exercises.push(exercise);
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}`);
}))

app.delete('/workouts/:id/exercises/:exerciseId', catchAsync(async (req, res) => {
    const { id, exerciseId } = req.params;
    await Exercise.findByIdAndDelete(exerciseId);
    res.redirect(`/workouts/${id}`);
}))

app.post('/workouts/:id/exercises/:eid/sets', catchAsync(async (req, res) => {
    const workout = await Workout.findById(req.params.id);
    const exercise = await Exercise.findById(req.params.eid);
    const set = new Set(req.body.set);
    exercise.sets.push(set);
    await set.save();
    await exercise.save();
    await workout.save();
    res.redirect(`/workouts/${workout._id}/?exercise=exercise`);
}))

app.put('/workouts/:id/exercises/:exerciseId/sets/:setId', catchAsync(async (req, res) => {
    const { id } = req.params;
    const { exerciseId } = req.params;
    const setId = req.params.setId;

    //await Exercise.findByIdAndUpdate(exerciseId, { $pull: })

    const set = Set.findById(setId);

    //await Workout.findByIdAndUpdate(id, { ...req.body.workout });
    await Set.findByIdAndUpdate(setId, { ...req.body.set });

    res.redirect(`/workouts/${id}`);
}))

app.delete('/workouts/:id/exercises/:exerciseId/sets/:setId', catchAsync(async (req, res) => {
    const workoutId = req.params.id;
    const exerciseId = req.params.exerciseId;
    const setId = req.params.setId;
    await Exercise.findByIdAndUpdate(exerciseId, { $pull: { sets: setId } })
    await Set.findByIdAndDelete(req.params.setId);
    res.redirect(`/workouts/${workoutId}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', { err });
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})