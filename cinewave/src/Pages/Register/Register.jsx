import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";
import { auth, db, googleProvider } from "../../firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  fetchSignInMethodsForEmail 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./Register.scss";

const Register = () => {
  const { setUser, selectedGenres, setSelectedGenres } = useContext(SharedContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [genres, setGenres] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?api_key=9e9ae8b4151b5a20e5c95911ff07c4e4"
        );
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error("Error fetching genres:", error);
        setErrors((prev) => ({ ...prev, genres: "Failed to load genres." }));
      }
    };

    fetchGenres();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId) ? prevGenres.filter((id) => id !== genreId) : [...prevGenres, genreId]
    );
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
    let formErrors = {};

    if (!firstName) formErrors.firstName = "First name is required.";
    if (!lastName) formErrors.lastName = "Last name is required.";
    if (!email) formErrors.email = "Email is required.";
    if (!password) formErrors.password = "Password is required.";
    if (password !== confirmPassword) formErrors.passwordMatch = "Passwords do not match.";
    if (selectedGenres.length < 10) formErrors.genres = "Please select at least 10 genres.";

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return alert("Please fix the errors before submitting.");

    setLoading(true);
    try {
      // Check if email is already registered
      const signInMethods = await fetchSignInMethodsForEmail(auth, formData.email);
      if (signInMethods.length > 0) {
        setErrors((prev) => ({ ...prev, general: "Email is already registered. Please log in." }));
        setLoading(false);
        return;
      }

      // Create User in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Save User Data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        selectedGenres,
      });

      // Update Context State
      setUser({ uid: user.uid, ...formData, selectedGenres });
      alert("Registration Successful!");
      navigate("/genres"); // Redirect to GenrePage
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
    }
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          email: user.email,
          selectedGenres: [],
        });
      }

      setUser({ uid: user.uid, email: user.email, selectedGenres: [] });
      alert("Google Sign-in Successful!");
      navigate("/genres");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      setErrors((prev) => ({ ...prev, general: error.message }));
    }
    setLoading(false);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Register</h1>
        {errors.general && <p className="error-message">{errors.general}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="register-input"
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="register-input"
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-input"
          />
          {errors.passwordMatch && <p className="error">{errors.passwordMatch}</p>}

          {/* Genre Selection */}
          <div className="genre-selection">
            <h3>Select Your Favorite Genres (Min: 10)</h3>
            <div className="genres-list">
              {genres.length > 0 ? (
                genres.map((genre) => (
                  <div
                    key={genre.id}
                    className={`genre-item ${selectedGenres.includes(genre.id) ? "selected" : ""}`}
                    onClick={() => toggleGenre(genre.id)}
                  >
                    {genre.name}
                  </div>
                ))
              ) : (
                <p>Loading genres...</p>
              )}
            </div>
            {errors.genres && <p className="error">{errors.genres}</p>}
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <button className="google-signup-button" onClick={handleGoogleSignUp} disabled={loading}>
          {loading ? "Signing in..." : "Sign Up with Google"}
        </button>
      </div>
    </div>
  );
};

export default Register;
