const express = require('express');
const router = express.Router();

const { createCard, getCard, getMyCards, updateCard, publishCard } = require('./controller');
const { protect } = require('../../middleware/authMiddleware');

router.post('/', protect, createCard);
router.post('/publish', protect, publishCard);
router.get('/my', protect, getMyCards);
router.put('/:id', protect, updateCard);

router.get('/:slug', getCard);

module.exports = router;