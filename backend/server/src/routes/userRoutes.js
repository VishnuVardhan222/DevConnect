const express = require('express');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, skills, bio } = req.body;
        const user = new User({ name, email, skills, bio });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err);
        if(err.code === 11000) return res.status(409).json({ message: 'Email already exists'});
        res.status(500).json({message: 'Server Error'});
    }


});

router.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    }catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }

});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, skills, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, skills, bio },
            { new: true, runValidators: true }
        );
        if(!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch(err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error'});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;