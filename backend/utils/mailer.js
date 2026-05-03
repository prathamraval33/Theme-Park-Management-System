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






const sendRefundEmail = async (booking) => {
  const visitDate = new Date(booking.visit_date).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric"
  });

  const mailOptions = {
    from: `"FunFusion Park" <${process.env.EMAIL_USER}>`,
    to: booking.email,
    subject: "Your Refund has been Processed — FunFusion",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { margin: 0; padding: 0; background: #f4f4f4; font-family: 'Segoe UI', Arial, sans-serif; }
          .wrapper { max-width: 580px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #050816, #0a0f2c); padding: 36px 40px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
          .header p { color: rgba(255,255,255,0.5); margin: 6px 0 0; font-size: 13px; }
          .badge { display: inline-block; background: rgba(255,193,7,0.15); color: #ffc107; border: 1px solid rgba(255,193,7,0.3); border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; margin-top: 14px; }
          .body { padding: 36px 40px; }
          .greeting { font-size: 16px; color: #1a1a2e; font-weight: 600; margin-bottom: 12px; }
          .message { font-size: 14px; color: #555; line-height: 1.7; margin-bottom: 28px; }
          .detail-box { background: #f8f9ff; border-radius: 12px; border: 1px solid #e8eaf6; padding: 20px 24px; margin-bottom: 24px; }
          .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
          .detail-row:last-child { border-bottom: none; }
          .detail-key { font-size: 12px; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-val { font-size: 14px; color: #1a1a2e; font-weight: 700; }
          .amount-row .detail-val { color: #e65100; font-size: 18px; }
          .note { background: #fff8e1; border-left: 4px solid #ffc107; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #7c5c00; margin-bottom: 24px; line-height: 1.6; }
          .footer { background: #f8f9ff; padding: 24px 40px; text-align: center; border-top: 1px solid #eee; }
          .footer p { font-size: 12px; color: #aaa; margin: 0; line-height: 1.7; }
        </style>
      </head>
      <body>
        <div class="wrapper">

          <div class="header">
            <h1>🎡 FunFusion Park</h1>
            <p>Theme Park Management System</p>
            <div class="badge">↩ Refund Processed</div>
          </div>

          <div class="body">
            <div class="greeting">Hi ${booking.customer_name || booking.email.split("@")[0]},</div>

            <div class="message">
              Your refund request has been successfully processed by our ticket staff.
              The amount will be credited back to your original payment method within
              <strong>5–7 business days</strong> depending on your bank.
            </div>

            <div class="detail-box">
              <div class="detail-row">
                <span class="detail-key">Booking ID</span>
                <span class="detail-val">${booking.booking_id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Customer</span>
                <span class="detail-val">${booking.customer_name || "—"}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Email</span>
                <span class="detail-val">${booking.email}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Ticket Type</span>
                <span class="detail-val">${booking.ticket_type}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Quantity</span>
                <span class="detail-val">${booking.quantity} ticket${booking.quantity > 1 ? "s" : ""}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Visit Date</span>
                <span class="detail-val">${visitDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Payment Method</span>
                <span class="detail-val">${booking.payment_method}</span>
              </div>
              <div class="detail-row amount-row">
                <span class="detail-key">Refund Amount</span>
                <span class="detail-val">₹${booking.total_amount}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Refund Status</span>
                <span class="detail-val" style="color:#e65100;">Processed ✓</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Processed On</span>
                <span class="detail-val">${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
              </div>
            </div>

            <div class="note">
              ⚠️ If you do not receive your refund within 7 business days, please contact
              us at <strong>${process.env.EMAIL_USER}</strong> with your Booking ID
              <strong>${booking.booking_id}</strong>.
            </div>
          </div>

          <div class="footer">
            <p>This is an automated email from FunFusion Park.<br/>
            Please do not reply directly to this email.<br/>
            © ${new Date().getFullYear()} FunFusion. All rights reserved.</p>
          </div>

        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendRefundEmail
};