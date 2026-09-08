const express = require('express');
const { uploadDocument, getDocument, deleteDocument } = require('../controllers/documentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect);

// The client sends the binary in the `file` multipart field.
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);

module.exports = router;
