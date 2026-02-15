import { Link } from 'react-router';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function CustomerDashboard() {
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


      {/* Customer Menu */}
      <div style={{
        backgroundColor: '#d4edda',
        padding: '15px',
        borderBottom: '2px solid #c3e6cb',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <a href="#" style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>My Bookings</a>
          <span style={{ color: '#999' }}>|</span>
          <Link to="/tickets" style={{ color: '#155724', textDecoration: 'none' }}>Book Ticket</Link>
          <span style={{ color: '#999' }}>|</span>
          <Link to="/queue" style={{ color: '#155724', textDecoration: 'none' }}>Queue Status</Link>
          <span style={{ color: '#999' }}>|</span>
          <Link to="/food" style={{ color: '#155724', textDecoration: 'none' }}>Food Order</Link>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#155724', textDecoration: 'none' }}>Feedback</a>
          <span style={{ color: '#999' }}>|</span>
          <Link to="/login" style={{ color: '#155724', textDecoration: 'none' }}>Logout</Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Customer Dashboard
        </h2>

        {/* Info Boxes */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#d1ecf1',
            border: '2px solid #bee5eb',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0c5460' }}>
              My Tickets
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#0c5460' }}>
              4
            </p>
          </div>

          <div style={{
            backgroundColor: '#d4edda',
            border: '2px solid #c3e6cb',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#155724' }}>
              Upcoming Visit
            </h3>
            <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#155724' }}>
              25 Jan 2026
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            border: '2px solid #ffeaa7',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#856404' }}>
              Wallet Balance
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              ₹500
            </p>
          </div>
        </div>

        {/* Booking History */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>My Booking History</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Booking ID
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Visit Date
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Ticket Type
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Quantity
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Amount
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT1234</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>25/01/2026</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>2</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹2400</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Confirmed</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT1233</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>15/01/2026</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>VIP</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹2500</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'blue', fontWeight: 'bold' }}>Used</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT1232</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>10/01/2026</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Child</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>2</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹1600</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'blue', fontWeight: 'bold' }}>Used</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT1231</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>05/01/2026</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>3</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹3600</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'blue', fontWeight: 'bold' }}>Used</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}
