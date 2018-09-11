// Necessities
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express(); // App

// Requirements for Optimizely Experiment
const axios = require('axios');
const datafile = 'https://cdn.optimizely.com/datafiles/HMVpmt3ks7ue5uam1t4FLz.json';

const optimizely = require('@optimizely/optimizely-sdk'); // Optimizely SDK for client instantiation
const getRandomHash = require('./services/get-random-hash'); // Custom service

// Custom Services
const getVariation = require('./services/get-variation');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE
app.use('/', indexRouter);

// FUNCTION TO RUN ERROR HANDLERS
const errorHandler = () => {
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
}

const testerRouter = require('./routes/tester');

axios.get(datafile)
  .then(res => {
    
    getVariation(app, res.data); // Get and store variation to server to user
    app.use('/test', testerRouter);

    errorHandler(); // Handle Errors
  });


const port = process.env.PORT || 8080;

app.listen(port, ()=> console.log(`SERVER RUNNNING ON ${port}!`));

module.exports = app;
