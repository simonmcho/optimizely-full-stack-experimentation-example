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

// Custom Services
const experimentSpecs = require('./services/experiment-specs');

const optimizely = require('@optimizely/optimizely-sdk'); // Optimizely SDK for client instantiation
const getRandomHash = require('./services/get-random-hash'); // Custom service


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// HOW TO DEFINE ROUTES, BUT ALSO HAVE DATA FILE AND VARIATION PREPPED SO THAT ANY ROUTE IN APP HAVE ACCESS TO THE OPT CLIENT?

// VARIATION PREP
app.use((req, res, next) => {
  console.log("SHOULD SHOW")
  axios.get(datafile)
    .then(res => {
      
        const optimizelyClientInstance = optimizely.createInstance({ datafile });
        
        const experimentKey = 'simon-fullstack-example';
        const optimizely_user_id = req.cookies.optimizely_user_id || getRandomHash(); // If cookie doesn't exist, generate random hash.
        const attributes = {
            url: req.originalUrl
        }
        

     
      //res.cookie('optimizely_user_id', optimizely_user_id);  // Set cookie value with generated value
      // // req.optimizely_bucket_id = optimizely_bucket_id; // Set cookie value to request object ?? Need this??

      // const variation = optimizelyClientInstance.activate(experimentKey, optimizely_user_id, attributes); // Activate A/B test for user
      // res.locals.variation = variation; // Initialize to locals object for res object so middleware functions can access it
      
      // next();

      //optimizelyClientInstance.track('added-to-cart', req.optimizely_user_id);
  });
});


// ROUTE
app.use('/', indexRouter);


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

//const testerRouter = require('./routes/tester');

// app.use('/test', testerRouter);

// axios.get(datafile)
//   .then(res => {
    
//     experimentSpecs(app, res.data); // Get and store variation to server to user

//    // app.use('/test', testerRouter);

//     errorHandler(); // Handle Errors
//   });


const port = process.env.PORT || 8080;

app.listen(port, ()=> console.log(`SERVER RUNNNING ON ${port}!`));

module.exports = app;
