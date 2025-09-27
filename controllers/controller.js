import mongoose from "mongoose";  // Importing mongoose for MongoDB interactions
import User from "../models/userModel.js";  // Importing User model
import bcrypt from "bcrypt";  // Importing bcrypt for password hashing
import { transporter, testEmailConnection } from "../config/nodemailerConfig.js";  // Importing nodemailer transporter
import axios from "axios";  // Importing axios for HTTP requests
import dotenv from "dotenv";  // Importing dotenv to load environment variables

dotenv.config();  // Loading environment variables from .env file

export  class UserGetController {
    getSignUpPage = (req, res) => {
        res.render("signup",{ message: "", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    getSignInPage = (req, res) => {
        res.render("signin", { message: "", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    homePage = (req, res) => {
        const email = req.session.userEmail;
        if (!email) {
            return res.status(404).render("signin",{message:"Please sign in to view the homepage", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        res.render("homepage");
    }

    getForgotPassword = (req, res) => {
        res.render("forgot-password", { message: "", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    getChangePassword = (req, res) => {
        const email = req.session.userEmail;
        if (!email) {
            return res.status(404).render("signin",{message:"Please sign in to change the password", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        res.render("change-password", { message: "", siteKey: process.env.RECAPTCHA_SITE_KEY });
    }

    logoutUser = (req, res) => {
        // req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.error('Error signing out:', err);
                res.status(500).send('Error signing out');
            } else {
                res.status(201).render('signin',{message:"user logout", siteKey: process.env.RECAPTCHA_SITE_KEY}); // Redirect to the sign-in page after signing out
            }
        });
    }

}

export  class UserPostController {
    
    //sign up
    createUser = async (req, res) => {
        const { username, email, password,cpassword } = req.body;
        
        // Verify reCAPTCHA
        const recaptcha = req.body['g-recaptcha-response'];
        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(400).render("signup",{message:"Please complete the captcha", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
                `secret=${secretKey}&response=${recaptcha}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            if (!response.data.success) {
                return res.status(400).render("signup",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
            }
        } catch (error) {
            return res.status(400).render("signup",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        if (password !== cpassword) {
            return res.status(400).render("signup",{message:"Passwords don't match", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        // Password strength validation
        if (password.length < 8) {
            return res.status(400).render("signup",{message:"Password must be at least 8 characters long", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(password)) {
            return res.status(400).render("signup",{message:"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        //check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).render("signup",{message:"User already exists", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email,password:hashedPassword });
        try {
            await newUser.save();
            res.status(201).render("signin",{message:"User created successfully", siteKey: process.env.RECAPTCHA_SITE_KEY});
        } catch (error) {
            res.status(409).render("signup",{message: error.message, siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
    };

    //sign in
    signInUser = async (req, res) => {
        const { email, password } = req.body;
        //Recaptcha
        const recaptcha = req.body['g-recaptcha-response'];

        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(404).render("signin",{message:"Please select captcha", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        // Verify reCAPTCHA
        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
                `secret=${secretKey}&response=${recaptcha}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            if (!response.data.success) {
                return res.status(400).render("signin",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
            }
        } catch (error) {
            return res.status(400).render("signin",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }

        try {
            const existingUser = await User.findOne({ email: email});
            
            if (!existingUser) 
            return res.status(404).render("signin",{message:"User doesn't exist", siteKey: process.env.RECAPTCHA_SITE_KEY});
        
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            
            if (!isPasswordCorrect)
                return res.status(400).render("signin",{message:"Invalid credentials || Incorrect Password", siteKey: process.env.RECAPTCHA_SITE_KEY});
            req.session.userEmail = email;
            res.redirect('/user/homepage');
            
        }
        catch (error) {
            res.status(500).render("signin",{message:error.message, siteKey: process.env.RECAPTCHA_SITE_KEY});
            
        }
    }

    //forgot password
    forgotPassword = async (req, res) => {
        const { email } = req.body;
        
        // Verify reCAPTCHA
        const recaptcha = req.body['g-recaptcha-response'];
        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(400).render("forgot-password",{message:"Please complete the captcha", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
                `secret=${secretKey}&response=${recaptcha}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            if (!response.data.success) {
                return res.status(400).render("forgot-password",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
            }
        } catch (error) {
            return res.status(400).render("forgot-password",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        try {
            const existingUser = await User.findOne({ email: email });
            if (!existingUser) 
                return res.status(404).render("forgot-password",{message:"User doesn't exist", siteKey: process.env.RECAPTCHA_SITE_KEY});

            // Generate random password
            const newPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            try{
                const mailOptions = {
                    from: `"NodeJS Auth System" <${process.env.EMAIL}>`,
                    to: email,
                    subject: 'Password Reset - NodeJS Authentication System',
                    text: `Your new password is: ${newPassword}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Password Reset</h2>
                            <p>Hello,</p>
                            <p>You have requested a password reset for your account.</p>
                            <p><strong>Your new password is: <span style="background-color: #f0f0f0; padding: 5px; font-family: monospace;">${newPassword}</span></strong></p>
                            <p>Please login with this new password and change it immediately for security reasons.</p>
                            <p>If you did not request this password reset, please contact support immediately.</p>
                            <hr>
                            <p style="color: #666; font-size: 12px;">This email was sent from NodeJS Authentication System</p>
                        </div>
                    `
                };
                
                await transporter.sendMail(mailOptions);
                console.log('✅ Password reset email sent successfully to:', email);
            }catch(error){
                console.error('❌ Email sending failed:', error);
                return res.status(500).render("forgot-password",{
                    message: "Failed to send email. Please check your email configuration or try again later.", 
                    siteKey: process.env.RECAPTCHA_SITE_KEY
                });
            }

            existingUser.password = hashedPassword;
            await existingUser.save();
            
            res.status(201).render("signin",{message:"New Password sent to your email", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        catch (error) {
            res.status(500).render("forgot-password",{message:error.message, siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
    }

    //change password
    changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        
        // Verify reCAPTCHA
        const recaptcha = req.body['g-recaptcha-response'];
        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(400).render("change-password",{message:"Please complete the captcha", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        try {
            const secretKey = process.env.RECAPTCHA_SECRET_KEY;
            const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', 
                `secret=${secretKey}&response=${recaptcha}`,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );
            
            if (!response.data.success) {
                return res.status(400).render("change-password",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
            }
        } catch (error) {
            return res.status(400).render("change-password",{message:"reCAPTCHA verification failed. Please try again.", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        
        try {
            const email = req.session.userEmail;
            const existingUser = await User.findOne({ email: email });
            if (!existingUser) 
                return res.status(404).render("change-password",{message:"User doesn't exist", siteKey: process.env.RECAPTCHA_SITE_KEY});

            const isPasswordCorrect = await bcrypt.compare(oldPassword, existingUser.password);
            if (!isPasswordCorrect)
                return res.status(400).render("change-password",{message:"Invalid credentials", siteKey: process.env.RECAPTCHA_SITE_KEY});

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingUser.password = hashedPassword;
            await existingUser.save();
            res.status(201).render("signin",{message:"Password changed successfully", siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
        catch (error) {
            res.status(500).render("change-password",{message:error.message, siteKey: process.env.RECAPTCHA_SITE_KEY});
        }
    }


}
