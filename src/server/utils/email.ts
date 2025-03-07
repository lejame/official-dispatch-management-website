import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendResetPasswordEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const resetLink = `http://localhost:3000/new-password?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Đặt lại mật khẩu',
        text: `Nhấn vào link sau để đặt lại mật khẩu: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);
};
