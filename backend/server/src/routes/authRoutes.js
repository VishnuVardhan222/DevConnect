const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

router.get('/test', (req, res) => {
    res.json({ message: 'Auth route working!' });
});

router.post('/register', async(req, res) => {
 
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email});
        if ( existing ) return res.status(409).json({ message: 'Email already exists'});

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({name, email, password: hashed});
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
}
);



router.post('/login', async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            {id : user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, user: { id: user._id, name: user.name, email: user.email }    });
    }catch ( err ){
        console.log(err);
        res.status(500).json({ message: 'Server Error' }); 
    }

});

module.exports = router;