import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple routing based on role (demo only)
    if (role === 'Customer') {
      navigate('/customer');
    } else if (role === 'Staff') {
      navigate('/staff');
    } else if (role === 'Admin') {
      navigate('/admin');
    } 
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
        maxWidth: '1000px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
          {/* Side Image */}
          <div style={{
            border: '2px solid #ddd',
            borderRight: 'none'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1761242606389-0a45db29fdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVtZSUyMHBhcmslMjByaWRlc3xlbnwxfHx8fDE3NjkxNTkxNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Theme Park"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                minHeight: '400px'
              }}
            />
          </div>

          {/* Login Form */}
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '40px',
            border: '2px solid #ddd'
          }}>
            <h2 style={{
              textAlign: 'center',
              color: '#333',
              marginTop: '0',
              marginBottom: '25px'
            }}>
              Login
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  color: '#333',
                  fontSize: '14px'
                }}>
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Customer">Customer</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                  
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  borderRadius: '0'
                }}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
