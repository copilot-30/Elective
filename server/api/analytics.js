const express = require('express');
const router = express.Router();
const { execFile } = require('child_process');
const path = require('path');

// GET /api/analytics/concerns?period=overall
router.get('/concerns', (req, res) => {
  const period = req.query.period || 'overall';
  const rScriptPath = path.join(__dirname, '../../client/R/concerns.R');
  execFile('Rscript', [rScriptPath, period], (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: stderr || error.message });
    }
    try {
      const result = JSON.parse(stdout);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: 'Failed to parse R output' });
    }
  });
});

module.exports = router;