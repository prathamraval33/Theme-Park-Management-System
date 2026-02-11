import { useState } from 'react';
import { Link } from 'react-router';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function StaffPanel() {
  const [rideStatus, setRideStatus] = useState('ON');

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

      {/* Staff Menu */}
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
          <a href="#" style={{ color: '#155724', textDecoration: 'none', fontWeight: 'bold' }}>Scan Ticket</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#155724', textDecoration: 'none' }}>Ride Status</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#155724', textDecoration: 'none' }}>Food Orders</a>
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
          Staff Panel
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* QR Scanner */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            border: '2px solid #ddd'
          }}>
            <h3 style={{ marginTop: '0', color: '#333' }}>QR Ticket Scanner</h3>
            <div style={{
              backgroundColor: '#fff',
              padding: '50px',
              textAlign: 'center',
              border: '2px dashed #999',
              minHeight: '250px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div>
                <div style={{
                  width: '150px',
                  height: '150px',
                  backgroundColor: '#e9ecef',
                  margin: '0 auto 15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #999'
                }}>
                  <span style={{ color: '#666', fontSize: '14px' }}>SCAN AREA</span>
                </div>
                <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                  Place QR code here to scan
                </p>
              </div>
            </div>
            <button style={{
              width: '100%',
              backgroundColor: '#007bff',
              color: 'white',
              padding: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '15px',
              marginTop: '15px',
              borderRadius: '0'
            }}>
              Start Scanner
            </button>
          </div>

          {/* Ride Status Update */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '30px',
            border: '2px solid #ddd'
          }}>
            <h3 style={{ marginTop: '0', color: '#333' }}>Update Ride Status</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Ride status updated!'); }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Select Ride
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}>
                  <option>Roller Coaster Express</option>
                  <option>Water Splash</option>
                  <option>Giant Ferris Wheel</option>
                  <option>Haunted House</option>
                  <option>Bumper Cars</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Status
                </label>
                <select 
                  value={rideStatus}
                  onChange={(e) => setRideStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="ON">ON</option>
                  <option value="OFF">OFF</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Queue Count
                </label>
                <input
                  type="number"
                  placeholder="Enter queue count"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Waiting Time (mins)
                </label>
                <input
                  type="number"
                  placeholder="Enter waiting time"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
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
                  fontSize: '15px',
                  borderRadius: '0'
                }}
              >
                Update Status
              </button>
            </form>
          </div>
        </div>

        {/* Current Ride Status Table */}
        <h3 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>Current Ride Status</h3>
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
                Ride Name
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Status
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Queue Count
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Wait Time
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Roller Coaster Express</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>ON</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>45</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>25 mins</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Water Splash</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>ON</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>28</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>15 mins</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Giant Ferris Wheel</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>ON</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>15</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>10 mins</td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Haunted House</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'orange', fontWeight: 'bold' }}>Maintenance</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>0</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>N/A</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}
