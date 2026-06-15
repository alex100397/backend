import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';

export const authMiddleware = async (req, res, next) => {
    try {
        console.log("Auth Middleware");
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
            console.log(token, 'token');
        } else if (req?.cookies?.jwt) {
            token = req.cookies.jwt;
            console.log(token, 'token');
        }

        if (!token) return res.status(401).json({ message: "Unauthorized" })

        try {
            //Verify token and extract the user id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({ where: { id: decoded.id } })

            if (!user) return res.status(404).json({ message: "User not found" })
            req.user = user;
            next();
        } catch (err) {
            return res.status(401).json({ message: "Invalid token" });
        }

    } catch (error) {
        console.error("Error in authMiddleware:", error);
        res.status(500).json({ message: "Failed to authenticate" });
    }
}