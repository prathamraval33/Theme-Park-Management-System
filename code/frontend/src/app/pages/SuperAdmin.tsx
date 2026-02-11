import { Link } from 'react-router';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

export function SuperAdmin() {
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

      {/* Super Admin Menu */}
      <div style={{
        backgroundColor: '#f8d7da',
        padding: '15px',
        borderBottom: '2px solid #f5c6cb',
        marginBottom: '20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          gap: '20px',
          justifyContent: 'center'
        }}>
          <a href="#" style={{ color: '#721c24', textDecoration: 'none', fontWeight: 'bold' }}>Manage Admins</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#721c24', textDecoration: 'none' }}>System Settings</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#721c24', textDecoration: 'none' }}>Database Backup</a>
          <span style={{ color: '#999' }}>|</span>
          <a href="#" style={{ color: '#721c24', textDecoration: 'none' }}>Logs</a>
          <span style={{ color: '#999' }}>|</span>
          <Link to="/login" style={{ color: '#721c24', textDecoration: 'none' }}>Logout</Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Super Admin Panel
        </h2>

        {/* Add New Admin Form */}
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '25px',
          border: '2px solid #ddd',
          marginBottom: '30px'
        }}>
          <h3 style={{ marginTop: '0', color: '#333' }}>Add New Admin</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert('Admin added!'); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Admin Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Username
                </label>
                <input
                  type="text"
                  placeholder="Enter username"
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
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

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Role
                </label>
                <select style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}>
                  <option>Admin</option>
                  <option>Staff</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#007bff',
                    color: 'white',
                    padding: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '15px',
                    borderRadius: '0'
                  }}
                >
                  Add Admin
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Admin Accounts Table */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>Manage Admin Accounts</h3>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '2px solid #ddd',
          marginBottom: '30px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Admin ID
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Admin Name
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Email
              </th>
              <th style={{
                border: '1px solid #ddd',
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                Role
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
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>ADM001</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Rajesh Kumar</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>rajesh@tpms.com</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Admin</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button style={{
                  backgroundColor: '#ffc107',
                  color: '#333',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginRight: '5px',
                  borderRadius: '0'
                }}>
                  Edit
                </button>
                <button style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '0'
                }}>
                  Delete
                </button>
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>ADM002</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Priya Singh</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>priya@tpms.com</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Admin</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button style={{
                  backgroundColor: '#ffc107',
                  color: '#333',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginRight: '5px',
                  borderRadius: '0'
                }}>
                  Edit
                </button>
                <button style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '0'
                }}>
                  Delete
                </button>
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>STF001</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Amit Sharma</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>amit@tpms.com</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>Staff</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{ color: 'green', fontWeight: 'bold' }}>Active</span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button style={{
                  backgroundColor: '#ffc107',
                  color: '#333',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  marginRight: '5px',
                  borderRadius: '0'
                }}>
                  Edit
                </button>
                <button style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  borderRadius: '0'
                }}>
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* System Settings */}
        <h3 style={{ color: '#333', marginBottom: '15px' }}>System Settings</h3>
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '25px',
          border: '2px solid #ddd'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Park Opening Time
            </label>
            <input
              type="time"
              defaultValue="09:00"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Park Closing Time
            </label>
            <input
              type="time"
              defaultValue="20:00"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#333',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Max Daily Visitors
            </label>
            <input
              type="number"
              defaultValue="2000"
              style={{
                padding: '8px',
                border: '1px solid #ddd',
                fontSize: '14px',
                width: '200px'
              }}
            />
          </div>

          <button style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 25px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '15px',
            borderRadius: '0'
          }}>
            Save Settings
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
