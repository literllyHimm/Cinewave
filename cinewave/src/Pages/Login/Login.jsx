import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";
import { auth, db, googleProvider } from "../../firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Login.scss";



const Login = () => {
  const { setUser } = useContext(SharedContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const { email, password } = formData;
    let formErrors = {};

    if (!email) formErrors.email = "Email is required.";
    if (!password) formErrors.password = "Password is required.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // 🔹 Handle Email/Password Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setLoading(true);
    setErrors({}); // Clear previous errors
  
    try {
      console.log("🟢 Attempting to login with:", formData.email);
  
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
  
      console.log("✅ Login successful:", user);
  
      // Fetch user data from Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        console.log("✅ User data found in Firestore:", userDoc.data());
  
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data(),
        });
  
        alert("Login Successful!");
        navigate("/");
      } else {
        console.warn("⚠️ User exists in Firebase Auth but not in Firestore.");
        setErrors((prev) => ({ ...prev, general: "User data missing in Firestore. Please register again." }));
      }
    } catch (error) {
      console.error("🔥 Login Error:", error.code, error.message);
      setErrors((prev) => ({ ...prev, general: error.message }));
    }
  
    setLoading(false);
  };
  
  // 🔹 Handle Google Login (Prevents Unregistered Users)
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // 🔹 Check if user exists in Firestore before allowing login
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        setErrors((prev) => ({ ...prev, general: "You must register first before logging in with Google." }));
        await auth.signOut(); // Force logout
        setLoading(false);
        return;
      }
  
      setUser({ uid: user.uid, email: user.email });
      alert("Google Sign-in Successful!");
      navigate("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
    }
    setLoading(false);
  };
  

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Sign In</h1>
        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleEmailLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <button className="google-login-button" onClick={handleGoogleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In with Google"}
        </button>

        <p className="signup-prompt">
          New to Netflix?{" "}
          <a href="/register" className="signup-link">
            Create an account.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
