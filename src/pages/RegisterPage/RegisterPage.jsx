import { useEffect, useState } from "react";
import style from "./RegisterPage.module.css";
import { useNavigate } from "react-router-dom";

///Google cloud firestore
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { app, db } from "../../configDB/firebase";

const auth = getAuth(app);

function RegisterPage({ setUsers }) {
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [firebaseError, setFirebaseError] = useState("");

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        Navigate("/signin");
      }, 3000);
    }
  }, [success]);
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      id: Math.floor(Math.random() * 10) + Date.now(),
    }));
  }

  function validate() {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
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
    console.log(formData);

    try {
      //// Register with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      console.log(user);

      //save user data to firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        createdAt: new Date().toISOString(),
      });

      //setUsers((prev) => [...prev, formData]);
      setFormData({ name: "", email: "", password: "" });
      setErrors({});
      setFirebaseError("");
      setSuccess(true);
    } catch (error) {
      console.error("Firebase Error:", error);
      setFirebaseError(error.message);
    }
  }

  return (
    <div className={style.container}>
      <div className={style.formContainer}>
        {success && (
          <p style={{ color: "green" }}>User Registered Successfully</p>
        )}
        {firebaseError && <p style={{ color: "red" }}>{firebaseError}</p>}
        <h2 className={style.signupHeading}>Sign Up</h2>

        <form onSubmit={handleFormSubmit} className={style.signupForm}>
          <div>
            <input
              type="text"
              name="name"
              className={style.formInput}
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className={style.error}>{errors.name}</p>}
          </div>

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

          <button type="submit" className={style.signupBtn}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
