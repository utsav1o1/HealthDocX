const User = require('../models/User');
const sendEmail = require('../utils/sendEmail'); 

exports.register = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    
    if (!name || !email || !password || !confirmPassword) {
        return res.render('signup', { title: 'Sign Up', error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.render('signup', { title: 'Sign Up', error: 'Passwords do not match' });
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('signup', { title: 'Sign Up', error: 'Email already registered' });
        }

        // Create new user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Create session
        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('signup', { title: 'Sign Up', error: 'Something went wrong. Please try again.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { title: 'Log In', error: 'All fields are required' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.render('login', { title: 'Log In', error: 'Invalid email or password' });
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('auth/login', { title: 'Log In', error: 'Something went wrong. Please try again.' });
    }
};

// exports.forgotPassword = async (req, res) => {
//     const { email } = req.body;

//     try {
//         // Find user by email
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(404).json({ message: 'No user found with that email' });
//         }

//         // Generate reset token
//         const resetToken = user.getResetPasswordToken();

//         // Save the user with the reset token and expiration
//         await user.save({ validateBeforeSave: false });

//         // Create reset URL
//         const resetUrl = `http://locahost/reset-password/${resetToken}`;

//         // Email message
//         const message = `You requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

//         // Send email
//         await sendEmail({
//             to: user.email,
//             subject: 'Password Reset Request',
//             text: message
//         });

//         res.status(200).json({ message: 'Password reset email sent' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// exports.resetPassword= async (req, res) => {
   
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

//     try {
//         // Find user by resetPasswordToken and check if token is not expired
//         const user = await User.findOne({
//             resetPasswordToken,
//             resetPasswordExpire: { $gt: Date.now() } // Check if token has not expired
//         });

//         if (!user) {
//             return res.status(400).json({ message: 'Invalid or expired reset token' });
//         }

//         // Set the new password
//         user.password = req.body.password;

//         // Clear resetPasswordToken and resetPasswordExpire
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;

//         // Save the updated user
//         await user.save();

//         res.status(200).json({ message: 'Password has been reset successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };