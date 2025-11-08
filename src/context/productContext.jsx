import { createContext } from "react";
import { useEffect, useState } from "react";
import { db } from "../configDB/firebase";
import { getDocs, collection } from "firebase/firestore";

// Step 1: create context
export const ProductContext = createContext();

// Step 2: Create the Provider Component
export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]); // All products from Firestore
  const [filteredProducts, setFilteredProducts] = useState([]); // Search-filtered products
  const [searchTerm, setSearchTerm] = useState(""); // For search feature
  const [loading, setLoading] = useState(true); // Loading state for UI

  ///Fetch all products from google cloud firestore, mimic componentDidMount lifecycle method
  useEffect(() => {
    try {
      const fetchProducts = async () => {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        console.log(productsData);
        setProducts(productsData);
      };
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  }, [products, searchTerm]);

  //Step 3: Prepare value to pass to context consumers
  const contextValue = {
    products,
    filteredProducts,
    setFilteredProducts,
    searchTerm,
    setSearchTerm,
    loading,
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
