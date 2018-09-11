var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/tester', function(req, res) {
  res.render('index', { title: 'FAKE CLIENT WEB APP', variation: res.locals.variation });
});

module.exports = router;
