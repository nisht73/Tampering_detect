const express = require('express');
const { createScreening, getScreenings, getScreening } = require('../controllers/screeningController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createScreening);
router.get('/', getScreenings);
router.get('/:id', getScreening);

module.exports = router;
