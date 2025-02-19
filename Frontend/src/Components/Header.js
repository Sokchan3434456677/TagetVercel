
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './Cart/CartContext'; 
function Header() {
  const { cartItems } = useContext(CartContext);const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const handleSignOut = () => {
    localStorage.removeItem('token'); 
    setIsAuthenticated(false);
  };
  return (
    <div>
      <header>
        <div id="top-header">
          <div className="container">
            <ul className="header-links pull-left">
              <li>
                <a href="#">
                  <i className="fa fa-phone" /> +855-10-886-460
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa fa-envelope-o" /> hengsokthon00@email.com
                </a>
              </li>
              <li>
                <a href="#" />
              </li>
            </ul>
            <ul className="header-links pull-right">
              {isAuthenticated ? (
                <li>
                  <button onClick={handleSignOut} className="signout-btn">
                    <i className="fa fa-sign-out" /> Sign Out
                  </button>
                </li>
              ) : (
                <li>
                  <Link to="/account">
                    <i className="fa fa-user-o" /> Sign In
                  </Link>
                </li>
              )}
              <li>
                <a href="https://t.me/Target_clothe" target="_blank" rel="noopener noreferrer">
                  <i className="fa fa-user-o" /> Customer Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div id="header">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header-logo">
                  <a href="#" className="logo" />
                </div>
              </div> 
              <div className="col-md-6">
                <div className="header-search">
                  <form>
                    <select className="input-select" />
                    <input className="input" placeholder="Search here" />
                    <button className="search-btn">Search</button>
                  </form>
                </div>
              </div>
              <div className="col-md-3 clearfix">
                <div className="header-ctn">
                  <div className="dropdown">
                    <Link to="/cart" className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                      <span style={{ color: 'white' }}>Cart</span>
                      <i style={{ color: 'white' }} className="fa fa-shopping-cart" />
                      <div className="qty">{totalItems}</div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
export default Header;
