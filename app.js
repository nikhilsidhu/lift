require('dotenv').config();
const express = require('express');
const engine = require('ejs-mate');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const workoutRoutes = require('./routes/workouts');
const exerciseRoutes = require('./routes/exercises');
const userRoutes = require('./routes/users');
const setRoutes = require('./routes/sets');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');

// const dbUrl = 'mongodb://localhost:27017/lift';

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

const store = new MongoDBStore({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60
});

store.on('error', function(error) {
    console.log('SESSION STORE ERROR', error);
});

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/workouts', workoutRoutes);
app.use('/workouts/:id/exercises', exerciseRoutes);
app.use('/workouts/:id/exercises/:exerciseId/sets', setRoutes);

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found.', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no, something went wrong!';
    res.status(statusCode).render('error', {
        err
    });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})