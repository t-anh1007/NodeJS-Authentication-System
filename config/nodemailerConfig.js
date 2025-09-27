import nodemailer from 'nodemailer';  // Importing nodemailer for email sending functionality
import dotenv from 'dotenv';          // Importing dotenv to load environment variables

dotenv.config();  // Loading environment variables from .env file

// Creating a transporter using nodemailer
export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Test email connection
export const testEmailConnection = async () => {
    try {
        // Debug logging
        console.log('🔍 Email configuration check:');
        console.log('EMAIL:', process.env.EMAIL ? '✅ Set' : '❌ Missing');
        console.log('PASSWORD:', process.env.PASSWORD ? '✅ Set' : '❌ Missing');
        
        await transporter.verify();
        console.log('✅ Email server connection successful');
        return true;
    } catch (error) {
        console.error('❌ Email server connection failed:', error.message);
        console.error('Full error:', error);
        return false;
    }
};