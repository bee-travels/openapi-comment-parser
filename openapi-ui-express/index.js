const path = require('path');
const express = require('express');
const { Router } = express;
const router = Router();

const buildPath = path.join(__dirname, 'build');

function openapiUI(spec, { logo }) {
  spec.info['x-logo'] = './logo';

  router.get('/spec.json', function (req, res) {
    res.json(spec);
  });

  router.use(express.static(buildPath));

  router.get('/logo', function (req, res) {
    res.sendFile(logo);
  });

  router.get('/', function (req, res) {
    res.sendFile(path.join(buildPath, 'index.html'));
  });

  return router;
}

module.exports = openapiUI;
