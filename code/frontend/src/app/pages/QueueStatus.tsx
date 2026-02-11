import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function QueueStatus() {
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
          Live Queue Status
        </h2>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
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
                Queue Length
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Estimated Time
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '12px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Roller Coaster Express
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                45 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                25 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Water Splash
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                28 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                15 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Giant Ferris Wheel
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                15 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                10 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Haunted House
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                0 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                N/A
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'orange', fontWeight: 'bold' }}>Maintenance</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Bumper Cars
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                12 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                5 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Sky Drop Tower
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                32 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                18 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                Carousel
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                8 people
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                3 minutes
              </td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          border: '1px solid #ddd',
          marginTop: '20px'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
            <strong>Note:</strong> Queue status is updated in real-time. Waiting times are approximate
            and may vary based on operational conditions.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
