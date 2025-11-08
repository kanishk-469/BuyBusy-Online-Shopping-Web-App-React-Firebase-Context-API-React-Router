import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar/Navbar.jsx";
import ErrorPage from "./pages/NotFoundPage/ErrorPage.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import FilterSidebar from "./components/FilterSidebar/FilterSidebar.jsx";
import CartPage from "./pages/CartPage/CartPage.jsx";
import { useEffect, useState } from "react";
import OrdersPage from "./pages/OrdersPage/OrdersPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./configDB/firebase.js";

function App() {
  const [cartItems, setCartItems] = useState([]);
  // const [orderedItems, setOrderedItems] = useState([
  //   {
  //     id: 1, // order id
  //     userId: 1, // reference to user
  //     productId: 1, // reference to product
  //     quantity: 2,
  //     status: "Pending", // Pending / Shipped / Delivered
  //     orderedAt: new Date().toISOString(),
  //   },
  // ]);
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Define Protected Route wrapper outside router
  const ProtectedRoutes = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/signin" replace />;
  };

  // const PrivateRoute = ({ children }) => {
  //   if (!isLoggedIn) return <Navigate to="/" replace={true} />;
  //   return children;
  // };

  ////retrieve all cart items from firestore
  useEffect(() => {
    try {
      const fetchCartItems = async () => {
        const querySnapshot = await getDocs(collection(db, "cartItems"));
        const cartItemsData = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setCartItems(cartItemsData);
      };
      fetchCartItems();
    } catch (err) {
      console.log(err);
    }
  }, []);

  // console.log(cartItems);
  // console.log(users);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Navbar
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          users={users}
        />
      ),
      errorElement: <ErrorPage />,
      children: [
        //we define individual routes, parent and child relationship
        //1st children of Navbar
        {
          path: "/",
          element: (
            <HomePage
              setCartItems={setCartItems}
              cartItems={cartItems}
              users={users}
              isLoggedIn={isLoggedIn}
            />
          ),
          children: [
            {
              path: "",
              element: <FilterSidebar />,
            },
          ],
        },

        //2nd children of Navbar
        {
          path: "/cart",
          element: (
            // <ProtectedRoutes>
            <CartPage
              cartItems={cartItems}
              users={users}
              isLoggedIn={isLoggedIn}
              setCartItems={setCartItems}
              // setOrderedItems={setOrderedItems}
            />
            // </ProtectedRoutes>
          ),
          children: [
            {
              path: "",
              element: <FilterSidebar />,
            },
          ],
        },

        //3rd children of Navbar
        {
          path: "/myorders/:userId",
          element: (
            // <ProtectedRoutes>
            <OrdersPage />
            // </ProtectedRoutes>
          ),
        },

        //4th children of Navbar
        {
          path: "/signup",
          element: <RegisterPage setUsers={setUsers} />,
        },
        {
          path: "/signin",
          element: (
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              users={users}
              setUsers={setUsers}
            />
          ),
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
