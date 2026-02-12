import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function Contact() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: '#e9ecef',
        padding: '20px',
        textAlign: 'center',
        borderBottom: '3px solid #007bff'
      }}>
        <h1 style={{
          margin: '0',
          fontSize: '32px',
          color: '#333',
          fontWeight: 'bold'
        }}>
          Theme Park Management System
        </h1>
      </div>

      <Navigation />

      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Contact Us
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Contact Form */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            border: '2px solid #ddd'
          }}>
            <h3 style={{ marginTop: '0', color: '#333' }}>Send us a Message</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Your Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Message
                </label>
                <textarea
                  placeholder="Enter your message"
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'Arial, sans-serif'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '15px',
                  borderRadius: '0'
                }}
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div style={{
              backgroundColor: '#d1ecf1',
              padding: '25px',
              border: '2px solid #bee5eb',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: '0', color: '#0c5460' }}>Park Address</h3>
              <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.6', color: '#0c5460' }}>
                <strong>Adventure Theme Park</strong><br />
                123, Park Road, Entertainment City<br />
                Mumbai, Maharashtra - 400001<br />
                India
              </p>
            </div>

            <div style={{
              backgroundColor: '#d4edda',
              padding: '25px',
              border: '2px solid #c3e6cb',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: '0', color: '#155724' }}>Contact Details</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#155724' }}>
                <strong>Phone:</strong> +91 98765 43210
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#155724' }}>
                <strong>Email:</strong> info@themeparkms.com
              </p>
              <p style={{ margin: '0', fontSize: '15px', color: '#155724' }}>
                <strong>Support:</strong> support@themeparkms.com
              </p>
            </div>

            <div style={{
              backgroundColor: '#fff3cd',
              padding: '25px',
              border: '2px solid #ffeaa7'
            }}>
              <h3 style={{ marginTop: '0', color: '#856404' }}>Park Timings</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#856404' }}>
                <strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM
              </p>
              <p style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#856404' }}>
                <strong>Saturday - Sunday:</strong> 9:00 AM - 10:00 PM
              </p>
              <p style={{ margin: '0', fontSize: '15px', color: '#856404' }}>
                <strong>Holidays:</strong> 9:00 AM - 10:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <h3 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>
          Frequently Asked Questions
        </h3>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '25px',
          border: '2px solid #ddd'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
              Q: How do I book tickets online?
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              A: You can book tickets through our Ticket Booking page. Select your visit date, 
              ticket type, and quantity, then proceed with payment.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
              Q: Can I cancel or reschedule my booking?
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              A: Yes, you can cancel or reschedule your booking up to 24 hours before your visit date 
              through the customer dashboard.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
              Q: Is food available inside the park?
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              A: Yes, we have multiple food courts inside the park. You can also pre-order food 
              through our Food Ordering page.
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
              Q: What safety measures are in place?
            </h4>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              A: All rides undergo regular safety inspections. We have trained staff, first-aid facilities, 
              and emergency response teams available at all times.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
