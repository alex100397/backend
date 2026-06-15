import { prisma } from '../config/database.js';
import bcrypt from 'bcryptjs';

/**
 * Find a user by email.
 */
export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};

/**
 * Create a new user with a hashed password.
 * @returns the created user (without password)
 */
export const createUser = async ({ name, email, password }) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
        select: { id: true, name: true, email: true, createdAt: true },
    });

    return user;
};

/**
 * Validate a plaintext password against a hash.
 */
export const verifyPassword = async (plaintext, hash) => {
    return bcrypt.compare(plaintext, hash);
};
