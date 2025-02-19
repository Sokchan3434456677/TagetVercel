import React, { useContext, useState } from 'react';
import './Cart.css';
import { CartContext } from './CartContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import khqrImage from '../KHQR/KHQR.png';
import Swal from 'sweetalert2';
import CategoryMenu from "../CategoryMenu";

function Cart() {
  const { cartItems, removeFromCart, updateCartItem } = useContext(CartContext);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [province, setProvince] = useState('');
  const [image, setImage] = useState(null);
  const [isImageSubmitted, setIsImageSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = 1.5;
  const total = subtotal + shipping;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setIsImageSubmitted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImage = () => {
    if (!image) {
      toast.error('Please upload an image before submitting.');
      return;
    }
    setIsImageSubmitted(true);
    toast.success('Image submitted successfully!');
  };

  const handleCheckout = async () => {
    if (!name || !address || !phoneNumber || !gender || !province) {
      toast.error('Please fill in your name, address, phone number, gender, and province before proceeding.');
      return;
    }

    if (!image || !isImageSubmitted) {
      toast.error('Please upload and submit an image before proceeding.');
      return;
    }

    setIsLoading(true);

    try {
      const invoiceData = {
        name,
        address,
        phoneNumber,
        gender,
        province,
        image,
        subtotal,
        shipping,
        total,
        items: cartItems.map(item => ({
          ...item,
          productImage: item.image, // Removed color
        })),
      };

      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/invoice`, invoiceData);
      if (response.status === 201) {
        toast.success('Order processed successfully!');

        for (const item of cartItems) {
          await axios.post(`${process.env.REACT_APP_PRODUCT_API_BASE_URL}/api/products/purchase/${item._id}`, {
            quantity: item.quantity,
            size: item.size,
          });
        }

        Swal.fire({
          title: "Thank You",
          text: "Your order has been successfully placed!",
          icon: "success",
        }).then(() => {
          window.location.href = process.env.REACT_APP_FRONTEND_BASE_URL;
        });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error('Failed to process order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeChange = (id, size) => {
    updateCartItem(id, { size });
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    updateCartItem(id, { quantity });
  };

  const incrementQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item) {
      handleQuantityChange(id, item.quantity + 1);
    }
  };

  const decrementQuantity = (id) => {
    const item = cartItems.find((item) => item._id === id);
    if (item && item.quantity > 1) {
      handleQuantityChange(id, item.quantity - 1);
    }
  };

  return (
    <div className="cart-page">
      <CategoryMenu /> {/* Add CategoryMenu here */}
      <h1>Shoping Cart</h1>
      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <div className="size-selection">
                  <label>Size:</label>
                  <div className="size-buttons">
                    {['S', 'M', 'L', 'XL', 'XXL'].map((size, index) => (
                      <React.Fragment key={size}>
                        <button
                          className={`size-button ${item.size === size ? 'active' : ''}`}
                          onClick={() => handleSizeChange(item._id, size)}
                        >
                          {size}
                        </button>
                        {index === 2 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="quantity-selection">
                  <label>Quantity:</label>
                  <div className="quantity-control">
                    <button onClick={() => decrementQuantity(item._id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item._id)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
              <div className="item-total">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-details">
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <p>Delivery: $1.50</p>
            <hr />
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>

          <div className="khqr-payment">
            <h3>KHQR Payment</h3>
            <img src={khqrImage} alt="KHQR" style={{ maxWidth: '200px', height: 'auto' }} />
          </div>

          <div className="checkout-form">
            <h3>Shipping Details</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="province">Province (Required)</label>
              <select
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              >
                <option value="">Select Province</option>
                <option value="Banteay Meanchey">Banteay Meanchey</option>
                <option value="Battambang">Battambang</option>
                <option value="Kampong Cham">Kampong Cham</option>
                <option value="Kampong Chhnang">Kampong Chhnang</option>
                <option value="Kampong Speu">Kampong Speu</option>
                <option value="Kampong Thom">Kampong Thom</option>
                <option value="Kampot">Kampot</option>
                <option value="Kandal">Kandal</option>
                <option value="Kep">Kep</option>
                <option value="Koh Kong">Koh Kong</option>
                <option value="Kratie">Kratie</option>
                <option value="Mondulkiri">Mondulkiri</option>
                <option value="Oddar Meanchey">Oddar Meanchey</option>
                <option value="Pailin">Pailin</option>
                <option value="Phnom Penh">Phnom Penh</option>
                <option value="Preah Sihanouk">Preah Sihanouk</option>
                <option value="Preah Vihear">Preah Vihear</option>
                <option value="Prey Veng">Prey Veng</option>
                <option value="Pursat">Pursat</option>
                <option value="Ratanakiri">Ratanakiri</option>
                <option value="Siem Reap">Siem Reap</option>
                <option value="Stung Treng">Stung Treng</option>
                <option value="Svay Rieng">Svay Rieng</option>
                <option value="Takeo">Takeo</option>
                <option value="Tboung Khmum">Tboung Khmum</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender (Required)</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="image">Please Upload Image Payment</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {image && (
                <div className="image-preview">
                  <img src={image} alt="Uploaded" style={{ width: '100px', height: '100px', marginTop: '10px' }} />
                </div>
              )}
              <button
                className="submit-image-button"
                onClick={handleSubmitImage}
                disabled={!image || isImageSubmitted}
              >
                {isImageSubmitted ? 'Image Submitted' : 'Submit Image'}
              </button>
            </div>
          </div>

          <div className="cart-actions">
            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={!name || !address || !phoneNumber || !gender || !province || !image || !isImageSubmitted || isLoading}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;