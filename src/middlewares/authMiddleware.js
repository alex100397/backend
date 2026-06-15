import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export const authMiddleware = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header first, then fall back to cookie
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req?.cookies?.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized — no token provided',
            });
        }

        // Verify token and extract user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Select only non-sensitive fields (never expose password hash)
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, name: true, email: true, createdAt: true },
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User belonging to this token no longer exists',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
            });
        }
        next(error);
    }
};