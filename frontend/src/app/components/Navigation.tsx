import { Link } from "react-router-dom";

export function Navigation() {
  const user = localStorage.getItem("user");

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
        <Link to="/" style={linkStyle}>Home</Link>
        <span>|</span>

        <Link to="/rides" style={linkStyle}>Rides</Link>
        <span>|</span>

        <Link to="/tickets" style={linkStyle}>Tickets</Link>
        <span>|</span>

        <Link to="/queue" style={linkStyle}>Queue</Link>
        <span>|</span>

        <Link to="/food" style={linkStyle}>Food</Link>
        <span>|</span>

        <Link to="/contact" style={linkStyle}>Contact</Link>
        <span>|</span>

        {user ? (
  <Link to="/profile" style={linkStyle}>Profile</Link>
) : (
  <Link to="/login" style={linkStyle}>Login</Link>
)}

      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#333',
  textDecoration: 'none',
  padding: '5px 15px'
};
