import {User} from '../models/user.model.js';

const registerUser = async (req, res) => {
    try {
        const {username, password, email} = req.body;
        if(!username || !password || !email) {
            return res.status(400).json({message: 'All fields are required'});
        }
        const existing = await User.findOne({email: email.toLowerCase()});
        if(existing) {
            return res.status(400).json({message: 'User with this email already exists'});
        }

        const user = await User.create({
            username,
            password,
            email: email.toLowerCase(),
            loggedIn: false
        });
        return res.status(201).json({message: 'User registered successfully', data: {id: user._id, username: user.username, email: user.email }});
    }
        catch (error) {
            console.log(error, 'err');
            res.status(500).json({message: 'Server error', error: error.message});
        }    
}

export {registerUser};