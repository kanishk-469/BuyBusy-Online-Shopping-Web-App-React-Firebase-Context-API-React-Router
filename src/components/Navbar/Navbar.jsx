import { NavLink, Outlet, Link } from "react-router-dom";
import style from "./Navbar.module.css";

function Navbar({ isLoggedIn, setIsLoggedIn, users }) {
  function handleLogout() {
    setIsLoggedIn(false);
  }
  return (
    <>
      <div className={style.container}>
        <div className={style.brandName}>Busy Buy</div>

        <ul className={style.navItems}>
          <NavLink to="/">
            <li className={style.navItem}>
              <img
                src={`${import.meta.env.BASE_URL}icons/home.png`}
                alt="home"
              />
              <span>Home</span>
            </li>
          </NavLink>
          {isLoggedIn ? (
            <NavLink to={`/myorders/${users[0].id}`}>
              <li className={style.navItem}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/myOrder.png`}
                  alt="myorder"
                />
                <span>My orders</span>
              </li>
            </NavLink>
          ) : null}
          {isLoggedIn && (
            <NavLink to="/cart">
              <li className={style.navItem}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/cart.png`}
                  alt="cart"
                />
                <span>Cart</span>
              </li>
            </NavLink>
          )}

          {isLoggedIn ? (
            <NavLink to="/signin">
              <li className={style.navItem} onClick={handleLogout}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/logout.png`}
                  alt="logout"
                />
                <span>Logout</span>
              </li>
            </NavLink>
          ) : (
            <NavLink to="/signin">
              <li className={style.navItem}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/login.png`}
                  alt="login"
                />
                <span>Login</span>
              </li>
            </NavLink>
          )}
        </ul>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
