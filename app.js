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
const getVariation = require('./services/get-variation');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   res.locals.variation = 'varA!';
//   console.log(res.locals)
//   next();
// });

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/test', (req, res) => {
  res.render('index.ejs', { title: 'title', variation: 'hi'})
}); // this works but not in the promise resolve


// axios.get(datafile) // Get data file
//   .then((res)=> {
//     app.use((req, res, next) => {
//       res.locals.variation = 'varA!';
//       console.log(res.locals)
//       next();
//     });

//       app.get('/products', (req, res) => {  
//         res.render('index.ejs', { variation: res.locals.variation })
//       });

//   });

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

const port = process.env.PORT || 8080;

app.listen(port, ()=> console.log(`SERVER RUNNNING ON ${port}!`));

module.exports = app;
