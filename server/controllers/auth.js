const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
    const { firstName,lastName, email, password } = req.body;

    console.log('username:', firstName, lastName, email, password)

    try {
        
        const existingUser = await User.find({ email });
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
      

        console.log('user not exists')

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('password hashed:')
     
        const newUser = new User({
            firstName,
            lastName,
            email,  
            password: hashedPassword,
            isVerified: false
        });

        console.log('user created')
     

        const user = await newUser.save();


        console.log('user saved')


        // const token = jwt.sign({userId: user._id}, process.env.EMAIL_SECRET, {expiresIn: '1hr'})

        // console.log('token: ', token)

        res.status(201).json({
            message: 'User registered successfully',
            user
        })
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(400).json({ message: error.message,  });
    }        

}



async function loginUser(req, res) {
    const { email, password } = req.body;

    console.log(email, password)

    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', user)

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET , { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(400).json({ message: error.message });
    }
}


// async function verifyToken(req, res) {
//     const token = req.header('Authorization')?.split(' ')[1];

//     console.log('token:', token);

//     if (!token) {
//         return res.status(401).json({
//             message: 'Access Denied! Unauthorized user'
//         });
//     }

//     try {
//         const decoded = jwt.decode(token);

//         if (!decoded) {
//             return res.status(401).json({
//                 message: 'Invalid token.'
//             });
//         }

//         if (decoded.exp * 1000 < Date.now()) {
//             return res.status(401).json({
//                 message: 'Token Expired'
//             });
//         }

//         const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);

//         console.log('verified User', verifiedUser)

//         req.user = verifiedUser;

//         console.log('req.user:', req.user)

//         const userId = req.user.userId;
//         const user = await User.findOne({ _id: userId }); 

//         console.log('User:', user)

//         if (!user) {
//             return res.status(404).json({
//                 message: 'User not found!'
//             });
//         }

//         const { password: _, ...userInfo } = user.toObject();

//         return res.status(201).json({
//             user: userInfo
//         });

//     } catch (error) {
//         return res.status(400).json({
//             message: error.message
//         });
//     }
// }





module.exports = {
    registerUser,
    loginUser,
    // verifyToken,
   
};