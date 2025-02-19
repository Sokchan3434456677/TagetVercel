

import React from 'react';
import { CartProvider } from './Components/Cart/CartContext';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Navigation from './Components/Navigation';
import ProductAPI from './Components/ProductAPI'; // Hoodie Page
import TShirt from './Components/Product/T-Shirt'; // T-Shirt Page
import StussyCap from './Components/Product/Stussy-Cap';
import SweatShorts from './Components/Product/Sweat-Shorts';
import Cart from './Components/Cart/Cart';
import Footer from './Components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegisterAccount from './Components/LoginForm/RegisterAccount';
// import UserProfile from './Components/LoginForm/UserProfile';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';






function App() {
  return (
    <Router>
        <CartProvider>
        <ToastContainer />
      <div>
        <Header />
        <Navigation />
        <Routes>
          
          <Route path="/" element={<ProductAPI />} /> {/* Default route */}
          <Route path="/hoodies" element={<TShirt />} />
          <Route path="/new-arrivas" element={<ProductAPI />} />
          <Route path="/tees" element={<StussyCap />} />
          <Route path="/outfits" element={<SweatShorts />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/account" element={<RegisterAccount />} /> {/* Register Account */}
          {/* <Route path="/profile" element={<UserProfile />} /> */}
          {/* <Route path="/quick-view" element={<ViewProduct />} /> */}

          
        </Routes>
        
        
      </div>
      <Footer />
      </CartProvider>
      
    </Router>
  );
}

export default App;



// import React from 'react';
// import { CartProvider } from './Components/Cart/CartContext';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Header from './Components/Header';
// import Navigation from './Components/Navigation';
// import ProductAPI from './Components/ProductAPI'; // Hoodie Page
// import TShirt from './Components/Product/T-Shirt'; // T-Shirt Page
// import StussyCap from './Components/Product/Stussy-Cap';
// import SweatShorts from './Components/Product/Sweat-Shorts';
// import Cart from './Components/Cart/Cart';
// import Footer from './Components/Footer';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import RegisterAccount from './Components/LoginForm/RegisterAccount';
// import UserProfile from './Components/LoginForm/UserProfile';

// function App() {
//   // Function to check if the user is logged in
//   const isAuthenticated = () => {
//     return localStorage.getItem('user') !== null; // Check if "user" exists in localStorage
//   };

//   return (
//     <Router>
//       <CartProvider>
//         <ToastContainer />
//         <div>
//           <Header />
//           <Navigation />
//           <Routes>
//             <Route path="/" element={<ProductAPI />} /> {/* Default route */}
//             <Route path="/t-shirt" element={<TShirt />} />
//             <Route path="/hoodie" element={<ProductAPI />} />
//             <Route path="/stussy-cap" element={<StussyCap />} />
//             <Route path="/sweat-shorts" element={<SweatShorts />} />
//             <Route path="/cart" element={<Cart />} />
//             {/* Conditional navigation for /account */}
//             <Route
//               path="/account"
//               element={isAuthenticated() ? <Navigate to="/profile" /> : <RegisterAccount />}
//             />
//             <Route path="/profile" element={<UserProfile />} />
//           </Routes>
//         </div>
//         <Footer />
//       </CartProvider>
//     </Router>
//   );
// }

// export default App;
