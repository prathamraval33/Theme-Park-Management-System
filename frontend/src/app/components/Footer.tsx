import "../../styles/Footer.css";
import { FaInstagram, FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="footer-container">

        {/* 🔥 BRAND */}
        <div className="footer-section">
          <div className="footer-logo-box">
            <img
              src="/assets/logo.png"
              alt="FunFusion Logo"
              className="footer-logo-img"
            />
            <h2>FunFusion</h2>
          </div>

          <p>
            Smart theme park management system with real-time ride booking,
            queue tracking, and seamless food ordering.
          </p>

          {/* SOCIAL */}
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaGithub /></a>
            <a href="#"><FaEnvelope /></a>
          </div>
        </div>

        {/* LINKS */}
        <div className="footer-section">
          <h3>Explore</h3>
          <a href="/">Home</a>
          <a href="/rides">Rides</a>
          <a href="/tickets">Tickets</a>
          <a href="/queue">Queue</a>
          <a href="/food">Food</a>
        </div>

        {/* SUPPORT */}
        <div className="footer-section">
          <h3>Support</h3>
          <a href="/contact">Contact</a>
          <a href="#">Help Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
        </div>

        {/* NEWSLETTER */}
        <div className="footer-section">
          <h3>Stay Updated</h3>
          <p>Get updates and offers</p>

          <div className="newsletter">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      {/* GLOW LINE */}
      <div className="footer-glow"></div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        <p>© 2026 Theme Park Management System</p>
        <p>Developed by 23IT438, 23IT447, 23IT449</p>
      </div>
    </motion.footer>
  );
}