# Node.js Authentication System

This project contains a complete authentication system using Node.js, Express, and MongoDB. It includes features like sign up, sign in, sign out, password reset, and social authentication (Google). The project is structured to be scalable with separate components for models, controllers, and routes.

## Live Site
[Click here](https://nodejs-authentication-system-l2pu.onrender.com/user/signin) to visit the live site.

## Features Implemented
- **Sign-up with Email**: Create an account using your email and password.
- **Sign-in**: Log into your account securely.
- **Sign Out**: Log out of your session.
- **Reset Password**: You can reset your passwords after signing in.
- **Encrypted Passwords**: Passwords are securely stored using encryption.
- **Google Login/Signup**: Sign in or sign up using your Google account.
- **Forgot Password**: Reset your password via email.
- **Password Strength Validation**: Notifications are displayed for unmatching passwords during sign up and incorrect passwords during sign in.
- **reCAPTCHA Integration**: Protects against bot traffic on sign up and login pages.

## Environment Variables

Before running the application locally, ensure you have set up the following environment variables in a .env file located at the root of your project:

1. **PORT**: Specifies the port number the application listens on.
2. **DB_URL**: MongoDB database connection URL.
3. **CLIENT_ID**: Google OAuth client ID.
4. **CLIENT_SECRET**: Google OAuth client secret (sign in with Google).
5. **EMAIL**: Email address for sending emails.
6. **PASSWORD**: App-specific password or regular password for the Gmail account.
7. **RECAPTCHA_SECRET_KEY**: Google reCAPTCHA secret key.
8. **CLIENT_URL**: URL to redirect after signing in with Google, e.g., "http://localhost:3000/auth/login/success".

Ensure that you have the appropriate values for each variable before running the application.

## Email Configuration Setup (Important!)

**For Gmail users, you MUST use App Password instead of regular password:**

1. **Enable 2-Step Verification:**
   - Go to: https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Create App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)" → Enter "NodeJS Auth"
   - Copy the 16-character password generated

3. **Use App Password in .env:**
   ```plaintext
   EMAIL=your_email@gmail.com
   PASSWORD=your_16_character_app_password
   ```

**Note:** Regular Gmail passwords will NOT work due to Google security policies.

Example `.env` file:

```plaintext
PORT=3000
DB_URL=mongodb://localhost:27017/authdatabase
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
EMAIL=your_email@gmail.com
PASSWORD=your_gmail_app_password_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
CLIENT_URL=http://localhost:3000/auth/login/success
```

## Folder
  ```csharp
node-authentication/
├── config/                  # Configuration files
│   └── mongodb.js           # MongoDB configuration
│
├── controllers/             # Controller logic
├── models/                  # Database models
├── routes/                  # Route definitions
├── views/                   # EJS views
├── app.js                   # Express application setup
│
├── public/                  # Static assets
│
├── package.json             # NPM package configuration
├── README.md                # Project README file
├── .gitignore               # Git ignore configuration
└── .env                     # Environment variables file

```

## Installation and Setup

Follow these steps to run the project locally:


1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/your-username/nodejs-authentication-system.git
  
2. Navigate into the project directory:
   ```bash
   cd node-authentication-system
    ```
3. Install dependencies:
   ```bash
   npm install

4. Start the server:
   ```bash
   npm start
5. Open your web browser and visit http://localhost:3000 to access the application.

## Hướng Dẫn Test Các Chức Năng (Localhost)

### 1. Kiểm Tra Kết Nối và Trang Chủ
- Mở trình duyệt và truy cập: `http://localhost:3000`
- Bạn sẽ thấy thông báo: "Hey Ninja ! Go to /user/signin for the login page."
- Truy cập: `http://localhost:3000/user/signin` để vào trang đăng nhập

### 2. Test Chức Năng Đăng Ký (Sign Up)
**Bước 1:** Truy cập `http://localhost:3000/user/signup`

**Bước 2:** Test validation:
- Thử đăng ký mà không điền đầy đủ thông tin → Kiểm tra thông báo lỗi [IMG](./public/non_input.png)
- Thử mật khẩu không khớp → Kiểm tra thông báo "Passwords don't match" [IMG](./public/wrong_pass.png)
- Thử mật khẩu yếu (dưới 8 ký tự) → Kiểm tra validation mật khẩu mạnh [IMG](./public/weak_pass.png)
- Thử không tick reCAPTCHA → Kiểm tra thông báo "Please complete the captcha" [IMG](./public/fault_capc.png)

**Bước 3:** Đăng ký thành công:
- Điền thông tin hợp lệ:
  - Username: `testuser`
  - Email: `test@gmail.com`
  - Password: `TestPass123!`
  - Confirm Password: `TestPass123!`
- Hoàn thành reCAPTCHA
- Click "Sign Up" → Nếu thành công sẽ chuyển về trang đăng nhập với thông báo "User created successfully"
- [Demo](./public/signup.png)
### 3. Test Chức Năng Đăng Nhập (Sign In)
**Bước 1:** Tại trang `http://localhost:3000/user/signin`

**Bước 2:** Test validation:
- Thử đăng nhập với email không tồn tại → "User doesn't exist" [IMG](./public/us_notexist.png)
- Thử đăng nhập với mật khẩu sai → "Invalid credentials || Incorrect Password" [IMG](./public/incorrectpass.png)
- Thử không tick reCAPTCHA → "Please select captcha"

**Bước 3:** Đăng nhập thành công:
- Email: `test@gmail.com`
- Password: `TestPass123!`
- Hoàn thành reCAPTCHA
- Click "Sign In" → Chuyển đến trang homepage
- [Demo](./public/sigin.png)
### 4. Test Chức Năng Homepage và Đăng Xuất
- Sau khi đăng nhập thành công, bạn sẽ ở trang: `http://localhost:3000/user/homepage`
- Trang này chỉ hiển thị khi đã đăng nhập
- Test đăng xuất: Click nút "Sign Out" → Chuyển về trang đăng nhập với thông báo "user logout"
- [Demo](./public/logout.png)
### 5. Test Chức Năng Quên Mật Khẩu (Forgot Password)
**Bước 1:** Tại trang đăng nhập, click "Forgot Password?"

**Bước 2:** Truy cập `http://localhost:3000/user/forgot-password`

**Bước 3:** Test validation:
- Thử email không tồn tại → "User doesn't exist" [IMG](./public/email_notexist.png)
- Thử email không hợp lệ → Kiểm tra validation

**Bước 4:** Reset mật khẩu thành công:
- Nhập email đã đăng ký: `test@gmail.com`
- Click "Reset Password"
- Kiểm tra email để nhận mật khẩu mới
- Thông báo thành công: "New Password sent to your email"

### 6. Test Chức Năng Đổi Mật Khẩu (Change Password)
**Bước 1:** Đăng nhập và truy cập `http://localhost:3000/user/change-password`

**Bước 2:** Test validation:
- Thử mật khẩu cũ sai → "Invalid credentials"
- Test truy cập khi chưa đăng nhập → Chuyển về trang đăng nhập

**Bước 3:** Đổi mật khẩu thành công:
- Old Password: Nhập mật khẩu hiện tại
- New Password: `NewPass456!`
- Click "Change Password" → Thông báo "Password changed successfully"
- [Demo](./public/changepass.png)
### 7. Test Chức Năng Đăng Nhập Google OAuth
**Bước 1:** Tại trang đăng nhập hoặc đăng ký, click "Sign In with Google"

**Bước 2:** Sẽ chuyển đến trang xác thực Google

**Bước 3:** Sau khi xác thực thành công, sẽ tự động:
- Tạo tài khoản mới (nếu lần đầu)
- Hoặc đăng nhập (nếu đã có tài khoản)
- Chuyển đến homepage
- [Demo](./public/signin_google.png)
### 8. Test Bảo Mật và Phiên Làm Việc
**Test session security:**
- Thử truy cập `http://localhost:3000/user/homepage` khi chưa đăng nhập [IMG](./public/not_loggin.png)
- Thử truy cập `http://localhost:3000/user/change-password` khi chưa đăng nhập
- Đóng trình duyệt và mở lại → Kiểm tra session có còn hay không

### 9. Kiểm Tra Database
**Database:**
- Sử dụng MongoDB Compass hoặc CLI để kiểm tra:
  - Database: `authdatabase`
  - Collection: `users`
  - Xem user đã được tạo với mật khẩu đã hash [IMG](./public/mongo.png)
### 10. Test Email Functionality
**Cấu hình email test:**
- Đảm bảo đã cấu hình đúng EMAIL và PASSWORD trong `.env`
- Test gửi email forgot password [IMG](./public/forgot_pass.png)
- Kiểm tra email nhận được có chứa mật khẩu mới [IMG](./public/mail_pass.png)
### Lưu Ý Khi Test:
- Đảm bảo MongoDB đang chạy
- Kiểm tra console cho các lỗi
- Test trên các trình duyệt khác nhau
- Kiểm tra responsive design trên mobile
- Test với dữ liệu edge cases (email dài, ký tự đặc biệt, etc.)

## Dependencies required

- Express.js
- MongoDB
- Passport.js
- bcrypt
- express-session
- express-ejs-layouts
- dotenv
- nodemailer

## Credits

This project was created by [Ravikant Singh](https://github.com/ravikantsingh12). Contributions via issues or pull requests are welcome!

## Sửa đổi và hiệu chỉnh
Tuấn Anh - 22707991
