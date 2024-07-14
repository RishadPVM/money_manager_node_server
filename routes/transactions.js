const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Add Transaction
router.post('/', authMiddleware, async (req, res) => {
    const { type, amount, description } = req.body;
    try {
        const transaction = new Transaction({
            userId: req.user.id,
            type,
            amount,
            description
        });
        await transaction.save();
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Transactions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id });
        res.json(transactions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get one Transactions
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.findOne({ _id: req.params.id, userId: req.user.id });
        res.json(transactions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete Transaction
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Update Transaction
router.put('/:id', authMiddleware, async (req, res) => {
    const { type, amount, description } = req.body;
    try {
        const transaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { type, amount, description },
            { new: true, runValidators: true }
        );
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(transaction);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
