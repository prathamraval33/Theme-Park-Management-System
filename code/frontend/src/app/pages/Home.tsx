import { Link } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function Home() {
  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
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
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Banner Section */}
        <div style={{
          marginBottom: '30px',
          border: '2px solid #ddd'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1761242606389-0a45db29fdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVtZSUyMHBhcmslMjByaWRlc3xlbnwxfHx8fDE3NjkxNTkxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Theme Park"
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover'
            }}
          />
        </div>

        
       

        {/* Rides Preview */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Popular Rides</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ border: '2px solid #ddd', backgroundColor: '#fff' }}>
            <img 
              src="https://images.unsplash.com/photo-1759955074363-5b3bd723f37f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsZXIlMjBjb2FzdGVyJTIwYW11c2VtZW50JTIwcGFya3xlbnwxfHx8fDE3NjkxNTkxNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Roller Coaster"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Roller Coaster Express</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Status:</strong> <span style={{ color: 'green' }}>Active</span>
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                <strong>Wait Time:</strong> 25 mins
              </p>
            </div>
          </div>

          <div style={{ border: '2px solid #ddd', backgroundColor: '#fff' }}>
            <img 
              src="https://images.unsplash.com/photo-1725961502893-0aebc64a9f5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMHNsaWRlJTIwcGFya3xlbnwxfHx8fDE3NjkxNTkxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Water Slide"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Water Splash</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Status:</strong> <span style={{ color: 'green' }}>Active</span>
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                <strong>Wait Time:</strong> 15 mins
              </p>
            </div>
          </div>

          <div style={{ border: '2px solid #ddd', backgroundColor: '#fff' }}>
            <img 
              src="https://images.unsplash.com/photo-1716478569520-aaaa1bf9f3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZXJyaXMlMjB3aGVlbCUyMHRoZW1lJTIwcGFya3xlbnwxfHx8fDE3NjkxNTkxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Ferris Wheel"
              style={{ width: '100%', height: '180px', objectFit: 'cover' }}
            />
            <div style={{ padding: '15px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>Giant Ferris Wheel</h4>
              <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                <strong>Status:</strong> <span style={{ color: 'green' }}>Active</span>
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
                <strong>Wait Time:</strong> 10 mins
              </p>
            </div>
          </div>
        </div>

        {/* Rides List */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Current Rides Status</h3>
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
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Ride Name
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Status
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Waiting Time
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Roller Coaster Express
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>25 mins</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Water Splash
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>15 mins</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Giant Ferris Wheel
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>10 mins</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Haunted House
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'orange', fontWeight: 'bold' }}>Maintenance</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>N/A</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Bumper Cars
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>5 mins</td>
            </tr>
          </tbody>
        </table>

        {/* Ticket Prices */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Ticket Prices</h3>
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
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Ticket Type
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Adult Ticket
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                ₹1200
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Child Ticket
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                ₹800
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                VIP Ticket
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                ₹2500
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
