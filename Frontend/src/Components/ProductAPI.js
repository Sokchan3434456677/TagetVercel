import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Style/style.css';
import Section from './Section';
import Newletter from './Newletter';
import { CartContext } from './Cart/CartContext';
function ProductAPI() {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_PRODUCT_API_BASE_URL}/api/products/NEW ARRIVALS`);
        const productsWithSizes = response.data.map((product) => ({
          ...product,
          size: product.size ? product.size.split(', ') : [],
        }));
        setProducts(productsWithSizes);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: size,
    }));
  };
  return (
    <div className="section">
      <Section />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
          </div>
          <div className="col-md-12">
            <div className="row product-grid">
              {products.map((product) => {
                const selectedSize = selectedSizes[product._id] || (product.size[0] || '');
                return (
                  <div key={product._id} className="col-lg-3 col-md-4 col-sm-6 col-6">
                    <div className="product">
                      <div className="product-img">
                        <img src={product.image} alt={product.name} />
                        {product.stock === 0 && (
                          <span className="out-of-stock">Out of Stock</span>
                        )}
                      </div>
                      <div className="product-body">
                        <p className="product-category">{product.category || 'Uncategorized'}</p>
                        <h3 className="product-name">
                          <a href="#">{product.name}</a>
                        </h3>
                        <h4 className="product-price">${product.price.toFixed(2)}</h4>
                        <div className="product-sizes">
                          <p>Sizes:</p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {product.size.map((size) => (
                              <button
                                key={size}
                                onClick={() => handleSizeSelect(product._id, size)}
                                style={{
                                  padding: '5px 10px',
                                  border: selectedSize === size ? '2px solid #D10024' : '1px solid #ccc',
                                  backgroundColor: selectedSize === size ? '#FDD' : '#FFF',
                                  cursor: 'pointer',
                                }}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="add-to-cart">
                        <button
                          className="add-to-cart-btn"
                          onClick={() => {
                            if (!selectedSize) {
                              alert('Please select a size before adding to cart');
                              return;
                            }
                            addToCart(product, selectedSize, 1);
                          }}
                          disabled={product.stock === 0}
                          style={{
                            backgroundColor: product.stock === 0 ? '#ccc' : '#D10024',
                            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <i className="fa fa-shopping-cart" />
                          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <Newletter />
    </div>
  );
}
export default ProductAPI;