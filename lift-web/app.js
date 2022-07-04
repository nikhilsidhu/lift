const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Workout = require('./models/workout');
const Exercise = require('./models/exercise');
const Set = require('./models/set')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const workout = require('./models/workout');
const { workoutSchema } = require('./schemas');
const workouts = require('./routes/workouts');
const exercises = require('./routes/exercises');

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

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/workouts', workouts);
app.use('/workouts/:id/exercises', exercises);

app.get('/', (req, res) => {
    res.render('home');
})

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