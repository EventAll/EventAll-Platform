const express = require('express');
const router = express.Router();

// Healthcheck route
router.get('/healthcheck', (req, res) => {
  res.status(200).send('Ok');
});

module.exports = router;
