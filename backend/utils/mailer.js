const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"FunFusion 🎢" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family:Arial; padding:20px; background:#0a0f2c; color:white;">
        <h2 style="color:#ff7a18;">🎢 Theme Park OTP Verification</h2>
        <p>Your OTP code is:</p>

        <h1 style="
          letter-spacing:5px;
          background:linear-gradient(90deg,#ff7a18,#ff3c8e);
          display:inline-block;
          padding:10px 20px;
          border-radius:10px;
          color:white;
        ">
          ${otp}
        </h1>

        <p>This OTP is valid for 5 minutes.</p>

        <hr style="opacity:0.2"/>

        <p style="font-size:12px; color:#bfc4ff;">
          If you didn't request this, ignore this email.
        </p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;