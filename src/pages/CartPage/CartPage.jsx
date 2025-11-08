import { useEffect, useState } from "react";
import style from "./CartPage.module.css";
import { Outlet } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../configDB/firebase";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CartPage({ cartItems = [], setCartItems, users }) {
  // Prevent rendering errors when data not yet loaded
  if (!cartItems || cartItems.length === 0) {
    return (
      <p style={{ color: "red", textAlign: "center", fontSize: "25px" }}>
        No Items found.
      </p>
    );
  }

  const [cartItemsWithProductDetails, setCartItemsWithProductDetails] =
    useState([]);

  // 🔹 Helper → fetch cart items with product details
  async function fetchCartItemsWithDetails(userId) {
    try {
      const cartRef = collection(db, "cartItems");
      const q = query(cartRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setCartItems([]);
        setCartItemsWithProductDetails([]);
        return;
      }

      const cartItemsData = querySnapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
      }));
      setCartItems(cartItemsData);

      // fetch product details
      const cartWithDetails = await Promise.all(
        cartItemsData.map(async (item) => {
          const productRef = doc(db, "products", item.productId);
          const productSnap = await getDoc(productRef);

          if (productSnap.exists()) {
            return {
              ...item,
              ...productSnap.data(),
              productDocId: productSnap.id,
            };
          }
          return item;
        })
      );

      setCartItemsWithProductDetails(cartWithDetails);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }

  // 🔹 Remove item
  async function handleRemoveFromCart(id) {
    try {
      await deleteDoc(doc(db, "cartItems", id));
      await fetchCartItemsWithDetails(users[0].id); // refresh UI
      toast.warning("Item removed from cart!");
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  }

  // 🔹 Increase quantity
  async function increaseQuantity(id) {
    try {
      const product = cartItems.find((item) => item.id === id);
      if (!product) return;

      const newQuantity = product.quantity + 1;
      await updateDoc(doc(db, "cartItems", id), { quantity: newQuantity });

      await fetchCartItemsWithDetails(users[0].id); // refresh UI
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error increasing quantity:", err);
    }
  }

  // 🔹 Decrease quantity
  async function decreaseQuantity(id) {
    try {
      const product = cartItems.find((item) => item.id === id);
      if (!product) return;

      if (product.quantity > 1) {
        const newQuantity = product.quantity - 1;
        await updateDoc(doc(db, "cartItems", id), { quantity: newQuantity });
        toast.warning("Item removed from cart!");
      } else {
        await handleRemoveFromCart(id);
        return;
      }

      await fetchCartItemsWithDetails(users[0].id); // refresh UI
    } catch (err) {
      console.error("Error decreasing quantity:", err);
    }
  }

  // 🔹 Initial fetch on mount
  useEffect(() => {
    if (!users || users.length === 0) return;
    fetchCartItemsWithDetails(users[0].id);
  }, [users]);

  return (
    <>
      <div className={style.container}>
        <div className={style.productContainer}>
          {cartItemsWithProductDetails.map((product) => (
            <div className={style.productCardContainer} key={product.id}>
              <div className={style.productCard}>
                <img
                  src={product.image}
                  alt="product"
                  className={style.productImage}
                />
                <div className={style.productName}>{product.title}</div>
                <div className={style.productPrice}>
                  ₹{product.price}
                  <span className={style.productQuantity}>
                    <span onClick={() => decreaseQuantity(product.id)}>
                      {" "}
                      -{" "}
                    </span>
                    <span>{product.quantity}</span>
                    <span onClick={() => increaseQuantity(product.id)}>
                      {" "}
                      +{" "}
                    </span>
                  </span>
                </div>
                <button
                  className={style.removeFromCartBtn}
                  onClick={() => handleRemoveFromCart(product.id)}
                >
                  Remove From Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />

      <Outlet
        context={{
          cartItems: cartItemsWithProductDetails,
          setCartItems,
          // setOrderedItems,
        }}
      />
    </>
  );
}

export default CartPage;
