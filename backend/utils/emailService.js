// Email service utility
// Note: This is a basic implementation. For production, consider using services like SendGrid, Mailgun, etc.

const nodemailer = require("nodemailer");

// Create transporter (configure with your email service)
const createTransporter = () => {
    // For development, you can use ethereal.email (fake SMTP service)
    // For production, use real SMTP credentials from environment variables

    if (process.env.EMAIL_SERVICE === "gmail") {
        return nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    // Default: console log only (for development without email setup)
    return null;
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, resetToken) => {
    const transporter = createTransporter();

    // If no transporter configured, just log to console
    if (!transporter) {
        console.log("\n=== PASSWORD RESET EMAIL ===");
        console.log(`To: ${to}`);
        console.log(`Reset Link: ${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`);
        console.log("============================\n");
        return { success: true, message: "Email logged to console (no SMTP configured)" };
    }

    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

    const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@marketmakers.com",
        to,
        subject: "Password Reset Request - MarketMakers",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Password Reset Request</h2>
        <p>You requested to reset your password for your MarketMakers account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
        <p>Or copy and paste this link into your browser:</p>
        <p style="color: #6B7280; word-break: break-all;">${resetLink}</p>
        <p style="color: #EF4444; margin-top: 20px;"><strong>This link will expire in 1 hour.</strong></p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Password reset email sent" };
    } catch (error) {
        console.error("Email sending error:", error);
        throw new Error("Failed to send password reset email");
    }
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to, name) => {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`\n=== WELCOME EMAIL to ${name} (${to}) ===\n`);
        return { success: true, message: "Email logged to console" };
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || "noreply@marketmakers.com",
        to,
        subject: "Welcome to MarketMakers!",
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to MarketMakers, ${name}!</h2>
        <p>Thank you for joining our trading education platform.</p>
        <p>Start your learning journey today and master the markets!</p>
        <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/modules" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Start Learning</a>
      </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: "Welcome email sent" };
    } catch (error) {
        console.error("Email sending error:", error);
        // Don't throw error for welcome email - it's not critical
        return { success: false, message: "Failed to send welcome email" };
    }
};

module.exports = {
    sendPasswordResetEmail,
    sendWelcomeEmail,
};
