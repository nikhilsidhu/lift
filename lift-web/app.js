const express = require('express');
const engine = require('ejs-mate');
const port = 3000;
const path = require('path');
const app = express();

app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(port, () => {
    console.log(`Listening on Port ${port}.`);
})