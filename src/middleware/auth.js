const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = (req.headers.authorization || "").replace(/bearer */gi, "");

    if (!token) {
        const errObj = {error: 'Access denied, no token provided'};
        console.error(errObj);
        return res.status(401).json(errObj);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        console.error(ex);
        res.status(400).json({error: 'Invalid token'});
    }
};

