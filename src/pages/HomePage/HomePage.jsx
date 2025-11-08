import style from "./HomePage.module.css";
// import products from "../../data.js";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
import { db } from "../../configDB/firebase";
import {
  getDocs,
  collection,
  doc,
  query,
  where,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { ProductContext } from "../../context/productContext.jsx";

function HomePage(props) {
  // const [products, setProducts] = useState([]);
  // const [filteredProducts, setFilteredProducts] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const {
    products,
    filteredProducts,
    setFilteredProducts,
    searchTerm,
    setSearchTerm,
    loading,
  } = useContext(ProductContext);
  const { setCartItems, cartItems, users, isLoggedIn } = props;
  const Navigate = useNavigate();

  ///fetch all products from google cloud firestore, mimic componentDidMount lifecycle method
  // useEffect(() => {
  //   try {
  //     const fetchProducts = async () => {
  //       const querySnapshot = await getDocs(collection(db, "products"));
  //       const productsData = querySnapshot.docs.map((doc) => {
  //         return { ...doc.data(), id: doc.id };
  //       });
  //       // console.log(productsData);
  //       setProducts(productsData);
  //     };
  //     fetchProducts();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  // useEffect(() => {
  //   const filteredProducts = products.filter((product) =>
  //     product.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredProducts(filteredProducts);
  // }, [products, searchTerm]);

  // Add to Cart with Firestore
  async function handleAddToCart(productId) {
    if (!isLoggedIn) {
      Navigate("/signin");
      return;
    }

    try {
      const product = products.find((p) => p.id === productId);
      if (!product) {
        console.error("Product not found!");
        return;
      }

      const userId = users[0].id; //replace with auth.currentUser.uid later
      console.log("Current userId:", userId);

      const cartRef = collection(db, "cartItems");

      //Query Firestore to check if item already exists for this user
      const q = query(
        cartRef,
        where("userId", "==", userId),
        where("productId", "==", productId)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Item exists → update quantity
        const existingDoc = querySnapshot.docs[0];
        const existingData = existingDoc.data();

        await updateDoc(doc(db, "cartItems", existingDoc.id), {
          quantity: existingData.quantity + 1,
        });

        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item.userId === userId && item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );

        // ✅ Show success toast
        toast.success("🛒 Product added successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        //Item doesn’t exist → create new doc with auto-ID
        const newCartItem = {
          userId,
          productId: product.id,
          price: product.price,
          quantity: 1,
        };

        const newDocRef = await addDoc(cartRef, newCartItem);

        // ✅ Update local state (include Firestore-generated ID for consistency)
        setCartItems((prev) => [...prev, { ...newCartItem, id: newDocRef.id }]);

        // ✅ Show success toast
        toast.success("🛒 Product added successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("🛒 Error adding to cart!");
    }
  }

  return (
    <>
      <div className={style.container}>
        <div className={style.searchContainer}>
          <input
            type="text"
            placeholder="Search By Name"
            className={style.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={style.productContainer}>
          {filteredProducts.map((product) => {
            return (
              //Put key here (outermost element of map return)
              <div className={style.productCardContainer} key={product.id}>
                <div className={style.productCard}>
                  <img
                    src={product.image}
                    alt="product-image"
                    className={style.productImage}
                  />
                  <div className={style.productName} key={product.id}>
                    {product.title}
                  </div>
                  <div className={style.productPrice}>{product.price}</div>
                  <button
                    className={style.addToCartButton}
                    onClick={() => handleAddToCart(product.id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* ✅ Toast Container for notifications */}
      <ToastContainer />

      <Outlet context={{ products, setFilteredProducts }} />
    </>
  );
}

export default HomePage;

// export default class HomePage extends React.Component {
//   render() {
//     return <div>HomePage</div>;
//   }
// }
