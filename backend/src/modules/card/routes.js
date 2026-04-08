const express = require('express');
const router = express.Router();

const { createCard, getCard, getMyCards, updateCard } = require('./controller');
const { protect } = require('../../middleware/authMiddleware');

router.post('/', protect, createCard);
router.get('/my', protect, getMyCards);
router.put('/:id', protect, updateCard);

router.get('/:slug', getCard);

module.exports = router;