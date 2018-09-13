const express = require('express');
const app = express();
const router = express.Router();

// Requirements for Optimizely Experiment
const axios = require('axios');
const datafile = 'https://cdn.optimizely.com/datafiles/HMVpmt3ks7ue5uam1t4FLz.json';

// Custom Services
const experimentSpecs = require('../services/experiment-specs');

const optimizely = require('@optimizely/optimizely-sdk'); // Optimizely SDK for client instantiation
const getRandomHash = require('../services/get-random-hash'); // Custom service

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("INDEX!");

  res.render('index', { title: 'Express', variation: res.locals.variation });
});

module.exports = router;
