import { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function TicketBooking() {
  const [visitDate, setVisitDate] = useState('');
  const [ticketType, setTicketType] = useState('Adult');
  const [quantity, setQuantity] = useState(1);

  const prices = {
    Adult: 1200,
    Child: 800,
    VIP: 2500
  };

  const totalPrice = prices[ticketType as keyof typeof prices] * quantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ticket booked successfully! (Demo)');
  };

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
        maxWidth: '800px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Book Your Tickets
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginTop: '0', color: '#333' }}>Ticket Details</h3>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Visit Date
                </label>
                <input
                  type="date"
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
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
                  Ticket Type
                </label>
                <select
                  value={ticketType}
                  onChange={(e) => setTicketType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Adult">Adult - ₹1200</option>
                  <option value="Child">Child - ₹800</option>
                  <option value="VIP">VIP - ₹2500</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
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

              <div style={{
                backgroundColor: '#fff',
                padding: '15px',
                border: '1px solid #ddd',
                marginBottom: '20px'
              }}>
                <strong style={{ fontSize: '18px', color: '#333' }}>
                  Total Price: ₹{totalPrice}
                </strong>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Book Ticket
              </button>
            </form>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginTop: '0', color: '#333' }}>QR Code Ticket</h3>
            <div style={{
              backgroundColor: '#fff',
              padding: '30px',
              textAlign: 'center',
              border: '1px solid #ddd',
              minHeight: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div>
                <div style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#ddd',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #999'
                }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>QR CODE</span>
                </div>
                <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>
                  Your QR ticket will appear here after booking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
