const express = require('express');
const { uploadDocument, getDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
