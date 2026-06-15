import { prisma } from "../config/database.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
const signup = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        return res
            .status(400)
            .json({ 'message': 'User already exists' });
    }

    //Hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Create user
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    });

    const token = generateToken(user.id, res);


    res
        .status(201)
        .json({
            message: 'User created successfully',
            status: "Success",
            data: {
                user: {
                    name: name,
                    email: email,
                    id: user.id
                },
                token
            }
        });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 'message': 'All fields are required' });
    }

    //Check user email exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (!userExists) {
        return res
            .status(400)
            .json({ 'message': 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (!isPasswordValid) {
        return res
            .status(400)
            .json({ 'message': 'Invalid password' });
    }

    //Generate JWT Token
    const token = generateToken(userExists.id, res);

    res
        .status(200)
        .json({
            message: 'User logged in successfully',
            status: "Success",
            data: {
                user: {
                    email: userExists.email,
                    id: userExists.id
                },
                token
            }
        });
}

const logout = async (req, res) => {
    // res.clearCookie('jwt');
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res
        .status(200)
        .json({
            message: 'User logged out successfully',
            status: "Success",
        });
}
export { signup, login, logout };