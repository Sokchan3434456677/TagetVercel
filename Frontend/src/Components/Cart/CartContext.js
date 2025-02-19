import React, { createContext, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

// Create the CartContext
export const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const toastShown = useRef(false); // Track if toast has been shown

  // Function to add items to the cart
  const addToCart = (product, size = 'M', quantity = 1) => {
    const token = localStorage.getItem("token"); // Check if the user is signed in

    if (!token) {
      // If the user is not signed in, show a toast and return early
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    // Ensure quantity is a valid number and at least 1
    const validQuantity = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    setCartItems((prevCartItems) => {
      // Check if the item already exists in the cart
      const existingItem = prevCartItems.find(
        (item) =>
          item._id === product._id &&
          item.size === size // Removed color comparison
      );

      if (existingItem) {
        // Show toast only if it hasn't been shown yet
        if (!toastShown.current) {
          toast.info(`${product.name} (${size}) quantity increased!`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          toastShown.current = true; // Mark toast as shown
        }

        // Update the quantity of the existing item
        return prevCartItems.map((item) =>
          item._id === product._id && item.size === size // Removed color comparison
            ? { ...item, quantity: item.quantity + validQuantity }
            : item
        );
      } else {
        // Show toast only if it hasn't been shown yet
        if (!toastShown.current) {
          toast.success(`${product.name} (${size}) added to cart!`, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          toastShown.current = true; // Mark toast as shown
        }

        // Add the new item to the cart
        return [
          ...prevCartItems,
          { ...product, size, quantity: validQuantity }, // Removed color
        ];
      }
    });

    // Reset the toastShown flag after the toast is displayed
    setTimeout(() => {
      toastShown.current = false;
    }, 2000); // Match the autoClose duration
  };

  // Function to remove items from the cart
  const removeFromCart = (productId) => {
    setCartItems((prevCartItems) => {
      // Find the item being removed
      const removedItem = prevCartItems.find((item) => item._id === productId);

      // Show a toast notification only if it hasn't been shown yet
      if (removedItem && !toastShown.current) {
        toast.warning(`${removedItem.name} (${removedItem.size}) removed from cart!`, {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        toastShown.current = true; // Mark toast as shown
      }

      // Reset the toastShown flag after the toast is displayed
      setTimeout(() => {
        toastShown.current = false;
      }, 2000); // Match the autoClose duration

      // Filter out the removed item
      return prevCartItems.filter((item) => item._id !== productId);
    });
  };

  // Function to update the size and quantity of an item in the cart
  const updateCartItem = (productId, updates) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) =>
        item._id === productId ? { ...item, ...updates } : item
      )
    );
  };

  // Provide the cart state and functions to the children
  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateCartItem }}
    >
      {children}
    </CartContext.Provider>
  );
};