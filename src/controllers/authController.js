import * as authService from '../services/authService.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await authService.findUserByEmail(email);
        if (userExists) {
            return sendError(res, 'User already exists', 400);
        }

        // Create user (password is hashed inside the service)
        const user = await authService.createUser({ name, email, password });

        // Generate JWT and set cookie
        const token = generateToken(user.id, res);

        sendSuccess(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        }, 'User created successfully', 201);
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await authService.findUserByEmail(email);
        if (!user) {
            // Generic message to prevent user enumeration
            return sendError(res, 'Invalid email or password', 401);
        }

        // Verify password
        const isPasswordValid = await authService.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            return sendError(res, 'Invalid email or password', 401);
        }

        // Generate JWT and set cookie
        const token = generateToken(user.id, res);

        sendSuccess(res, {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        }, 'User logged in successfully');
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    sendSuccess(res, null, 'User logged out successfully');
};

export { signup, login, logout };