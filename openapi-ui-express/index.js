const path = require('path');
const express = require('express');
const { Router } = express;
const router = Router();

const buildPath = path.join(__dirname, 'build');

function openapiUI(spec) {
  router.get('/spec.json', function (req, res) {
    res.json(spec);
  });

  router.use(express.static(buildPath));

  router.get('/', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  return router;
}

module.exports = openapiUI;
