import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function AdminDashboard() {
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
          Admin Dashboard
        </h2>

        {/* Menu */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          border: '1px solid #ddd',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Dashboard</a>
            <span style={{ color: '#999' }}>|</span>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Manage Rides</a>
            <span style={{ color: '#999' }}>|</span>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Tickets</a>
            <span style={{ color: '#999' }}>|</span>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Food Orders</a>
            <span style={{ color: '#999' }}>|</span>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Staff</a>
            <span style={{ color: '#999' }}>|</span>
            <a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>Reports</a>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: '#d1ecf1',
            border: '1px solid #bee5eb',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0c5460' }}>
              Total Visitors
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#0c5460' }}>
              1,247
            </p>
          </div>

          <div style={{
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#155724' }}>
              Total Revenue
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#155724' }}>
              ₹14,96,400
            </p>
          </div>

          <div style={{
            backgroundColor: '#fff3cd',
            border: '1px solid #ffeaa7',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#856404' }}>
              Active Rides
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#856404' }}>
              12 / 15
            </p>
          </div>

          <div style={{
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '20px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#721c24' }}>
              Crowd Count
            </h3>
            <p style={{ margin: '0', fontSize: '28px', fontWeight: 'bold', color: '#721c24' }}>
              856
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Recent Ticket Bookings</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginBottom: '30px',
          border: '1px solid #ddd'
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
                Customer Name
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
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT001</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rahul Sharma</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>2</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹2400</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>23/01/2026</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT002</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Priya Patel</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Child</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>3</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹2400</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>23/01/2026</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT003</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Amit Kumar</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>VIP</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>1</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹2500</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>23/01/2026</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>TKT004</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Sneha Singh</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Adult</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>4</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹4800</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>23/01/2026</td>
            </tr>
          </tbody>
        </table>

        {/* Recent Food Orders */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Recent Food Orders</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Order ID
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Customer Name
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Items
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
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>FD001</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Vikas Mehta</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Burger x2, Cold Drink x2</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹400</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>FD002</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Neha Gupta</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Pizza x1, Ice Cream x3</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹490</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'orange', fontWeight: 'bold' }}>Preparing</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>FD003</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Arjun Reddy</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Sandwich x1, French Fries x1</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>₹220</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Completed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
