import { useState } from 'react';
import { Navigation } from '@/app/components/Navigation';
import { Footer } from '@/app/components/Footer';

type FoodItem = {
  name: string;
  price: number;
  quantity: number;
};

export function FoodOrdering() {
  const [orderItems, setOrderItems] = useState<FoodItem[]>([]);

  const foodMenu = [
    { name: 'Burger', price: 150, image: 'https://images.unsplash.com/photo-1688246780164-00c01647e78c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmb29kfGVufDF8fHx8MTc2OTA4MDAyN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Pizza', price: 250, image: 'https://images.unsplash.com/photo-1703073186021-021fb5a0bde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGZvb2R8ZW58MXx8fHwxNzY5MDY2MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Ice Cream', price: 80, image: 'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBjcmVhbSUyMGNvbmV8ZW58MXx8fHwxNzY5MDk1NDA2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Cold Drink', price: 50, image: 'https://images.unsplash.com/photo-1619719304580-c6f308e5315a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xkJTIwZHJpbmslMjBzb2RhfGVufDF8fHx8MTc2OTE1OTE2OHww&ixlib=rb-4.1.0&q=80&w=1080' }
  ];

  const handleOrder = (itemName: string, itemPrice: number) => {
    const existingItem = orderItems.find(item => item.name === itemName);
    
    if (existingItem) {
      setOrderItems(orderItems.map(item =>
        item.name === itemName
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { name: itemName, price: itemPrice, quantity: 1 }]);
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

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


      <div style={{
        maxWidth: '1200px',
        margin: '40px auto',
        padding: '20px'
      }}>
        <h2 style={{ color: '#333', marginBottom: '20px' }}>
          Food Ordering
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Menu</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '15px'
            }}>
              {foodMenu.map((item) => (
                <div key={item.name} style={{
                  border: '2px solid #ddd',
                  backgroundColor: '#fff'
                }}>
                  <img 
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ padding: '15px' }}>
                    <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>{item.name}</h4>
                    <p style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                      ₹{item.price}
                    </p>
                    <button
                      onClick={() => handleOrder(item.name, item.price)}
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '8px 20px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: '100%',
                        borderRadius: '0'
                      }}
                    >
                      Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Order Summary</h3>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              border: '2px solid #ddd',
              minHeight: '300px'
            }}>
              {orderItems.length === 0 ? (
                <p style={{ color: '#666', fontSize: '14px' }}>
                  Your cart is empty. Add items to place an order.
                </p>
              ) : (
                <>
                  <table style={{ width: '100%', marginBottom: '15px' }}>
                    <tbody>
                      {orderItems.map(item => (
                        <tr key={item.name}>
                          <td style={{ padding: '5px 0', fontSize: '14px' }}>
                            {item.name}
                          </td>
                          <td style={{ padding: '5px 0', fontSize: '14px', textAlign: 'right' }}>
                            x{item.quantity}
                          </td>
                          <td style={{ padding: '5px 0', fontSize: '14px', textAlign: 'right' }}>
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{
                    borderTop: '2px solid #ddd',
                    paddingTop: '10px',
                    marginTop: '10px'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '15px'
                    }}>
                      <strong style={{ fontSize: '16px' }}>Total:</strong>
                      <strong style={{ fontSize: '16px' }}>₹{totalAmount}</strong>
                    </div>
                    <button
                      onClick={() => {
                        alert('Order placed successfully! (Demo)');
                        setOrderItems([]);
                      }}
                      style={{
                        width: '100%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '15px',
                        borderRadius: '0'
                      }}
                    >
                      Place Order
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
