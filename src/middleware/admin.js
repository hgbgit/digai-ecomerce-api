module.exports = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        const errObj = {error: 'Access denied', user: req.user};
        console.error(errObj);
        return res.status(403).json(errObj);
    }
    next();
};

