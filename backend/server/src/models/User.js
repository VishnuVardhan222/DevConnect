const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, requires: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        skills: {type: [String], default: []},
        bio: { type: String, default: '' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);