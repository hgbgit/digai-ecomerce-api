const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const {name, email, password} = req.body;
    let user = await User.findOne({email});

    if (user)
        return res.status(400).json({error: 'User already exists'});

    user = new User({name, email, password: await bcrypt.hash(password, 10)});
    await user.save();
    res.status(201).json({id: user._id, name: user.name, email: user.email});
};

exports.login = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({error: 'Invalid credentials'});

    const token = jwt.sign({
        id: user._id,
        name: user.name,
        email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '1h'});
    res.status(200).json({token});
};

