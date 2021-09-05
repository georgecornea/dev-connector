const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
    res.json({
        message: 'Profile route'
    });
});

module.exports = router;