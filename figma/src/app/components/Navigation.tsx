import { Link } from 'react-router';

export function Navigation() {
  return (
    <nav style={{
      backgroundColor: '#f8f9fa',
      padding: '10px 0',
      borderBottom: '2px solid #ddd',
      marginBottom: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        gap: '30px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <Link to="/" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px',
          fontWeight: 'normal'
        }}>
          Home
        </Link>
        <span style={{ color: '#999' }}>|</span>
        <Link to="/tickets" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px'
        }}>
          Tickets
        </Link>
        <span style={{ color: '#999' }}>|</span>
        <Link to="/queue" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px'
        }}>
          Queue
        </Link>
        <span style={{ color: '#999' }}>|</span>
        <Link to="/food" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px'
        }}>
          Food
        </Link>
        <span style={{ color: '#999' }}>|</span>
        <Link to="" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px'
        }}>
          Contact
        </Link>
        <span style={{ color: '#999' }}>|</span>
        <Link to="/login" style={{
          color: '#333',
          textDecoration: 'none',
          padding: '5px 15px'
        }}>
          Login
        </Link>
      </div>
    </nav>
  );
}