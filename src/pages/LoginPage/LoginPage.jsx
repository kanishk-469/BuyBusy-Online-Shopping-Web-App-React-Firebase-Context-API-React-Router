import { useState } from "react";
import style from "./LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";

//google cloud firestore
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app, db } from "../../configDB/firebase";
import { doc, getDoc } from "firebase/firestore";

const auth1 = getAuth(app);

function LoginPage({ setIsLoggedIn, users, setUsers }) {
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function validate() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  }

  async function handleFormSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      //firebase code
      const userCredential = await signInWithEmailAndPassword(
        auth1,
        formData.email,
        formData.password
      );

      console.log("Firebase user:", userCredential.user);

      // Fetch extra user data from Firestore
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        console.log("Full user data:", userData);

        // Set full user data in state
        setUsers([userData]);
        setIsLoggedIn(true);
        setFirebaseError("");
        Navigate("/cart");
      } else {
        console.error("No user document found in Firestore!");
        setFirebaseError("No user profile found. Please register again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setFirebaseError(error.message);
    }

    // ///Validate the user
    // const user = users.find(
    //   (user) =>
    //     user.email === formData.email && user.password === formData.password
    // );

    // if (user) {
    //   Navigate("/cart");
    //   setIsLoggedIn(true);
    // } else {
    //   alert("User not found");
    // }

    ///reset the form
    setFormData({ name: "", email: "", password: "" });
    setErrors({});
  }

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        <h2 className={style.signupHeading}>Sign In</h2>
        {firebaseError && <p className={style.error}>{firebaseError}</p>}

        <form onSubmit={handleFormSubmit} className={style.signupForm}>
          <div>
            <input
              type="email"
              name="email"
              className={style.formInput}
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className={style.error}>{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              className={style.formInput}
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className={style.error}>{errors.password}</p>
            )}
          </div>

          <button type="submit" className={style.signinBtn}>
            Sign In
          </button>
          <Link to="/signup">
            <p>Or Sign Up Instead</p>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
