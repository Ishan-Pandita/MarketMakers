const nodemailer = require("nodemailer");
const logger = require("../config/logger");

const isProduction = process.env.NODE_ENV === "production";

const getFrontendUrl = () =>
  process.env.FRONTEND_URL ||
  process.env.CORS_ORIGINS?.split(",").map((value) => value.trim()).find(Boolean) ||
  "http://localhost:5173";

const logEmailPreview = ({ subject, to, actionUrl }) => {
  logger.warn(
    `[email:fallback] ${subject} could not be delivered. Recipient: ${to}. Action URL: ${actionUrl}`
  );
};

const createTransporter = () => {
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  ) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  if (
    process.env.EMAIL_SERVICE === "gmail" &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASSWORD
  ) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  return null;
};

const deliverEmail = async ({ transporter, mailOptions, fallbackUrl }) => {
  if (!transporter) {
    if (isProduction) {
      throw new Error("Email transporter is not configured");
    }

    logEmailPreview({
      subject: mailOptions.subject,
      to: mailOptions.to,
      actionUrl: fallbackUrl,
    });
    return { success: false, degraded: true, message: "Email delivery not configured" };
  }

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, degraded: false, message: "Email sent" };
  } catch (error) {
    logger.error(`Email sending error: ${error.message}`);

    if (isProduction) {
      throw new Error("Failed to deliver email");
    }

    logEmailPreview({
      subject: mailOptions.subject,
      to: mailOptions.to,
      actionUrl: fallbackUrl,
    });
    return { success: false, degraded: true, message: "Email delivery failed; action URL logged" };
  }
};

/**
 * Send password reset email
 * @param {string} to - Recipient email
 * @param {string} resetToken - Password reset token
 * @returns {Promise}
 */
const sendPasswordResetEmail = async (to, resetToken) => {
  const transporter = createTransporter();
  const resetLink = `${getFrontendUrl()}/reset-password/${resetToken}`;

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
        <p style="color: #EF4444; margin-top: 20px;"><strong>This link will expire in 10 minutes.</strong></p>
        <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return deliverEmail({
    transporter,
    mailOptions,
    fallbackUrl: resetLink,
  });
};

/**
 * Send welcome email
 * @param {string} to - Recipient email
 * @param {string} name - User name
 * @returns {Promise}
 */
const sendWelcomeEmail = async (to, name) => {
  const transporter = createTransporter();
  const welcomeLink = `${getFrontendUrl()}/modules`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@marketmakers.com",
    to,
    subject: "Welcome to MarketMakers!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">Welcome to MarketMakers, ${name}!</h2>
        <p>Thank you for joining our trading education platform.</p>
        <p>Start your learning journey today and master the markets!</p>
        <a href="${welcomeLink}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Start Learning</a>
      </div>
    `,
  };

  return deliverEmail({
    transporter,
    mailOptions,
    fallbackUrl: welcomeLink,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail,
};
