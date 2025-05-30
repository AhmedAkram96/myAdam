// middlewares/identityMiddleware.js

const verifyClient = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (req.user.isPainter) {
            return res.status(403).json({ message: 'Access denied. Client account required' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying client status' });
    }
};

const verifyPainter = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        if (!req.user.isPainter) {
            return res.status(403).json({ message: 'Access denied. Painter account required' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying painter status' });
    }
};

module.exports = {
    verifyClient,
    verifyPainter
}; 