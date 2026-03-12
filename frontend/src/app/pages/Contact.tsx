import "../../styles/contact.css";
export function Contact() {
  return (
    <div className="contact-page">

      <div className="contact-container">

        <h2 className="contact-title">📞 Contact Us</h2>

        <p className="contact-subtitle">
          If you have any questions about rides, tickets, or food services,
          feel free to contact our support team.
        </p>

        <div className="contact-grid">

          {/* CONTACT INFO */}

          <div className="contact-card">

            <h3>Park Information</h3>

            <p>📍 <strong>Address:</strong> Adventure Theme Park, Mumbai</p>

            <p>📞 <strong>Phone:</strong> +91 98765 43210</p>

            <p>📧 <strong>Email:</strong> support@funfusion.com</p>

            <p>🕒 <strong>Park Timings:</strong> 9:00 AM – 8:00 PM</p>

          </div>


          {/* CONTACT FORM */}

          <div className="contact-card">

            <h3>Send us a Message</h3>

            <form className="contact-form">

              <input type="text" placeholder="Your Name" />

              <input type="email" placeholder="Your Email" />

              <textarea placeholder="Your Message"></textarea>

              <button type="submit" className="contact-btn">
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}