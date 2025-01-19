import React, { useState, useContext, useEffect } from "react";
import { SharedContext } from "../../SharedContext";
import { auth, db } from "../../firebase";
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";
import "./SettingsView.scss";

const SettingsView = () => {
  const { user, updateUserPreferences, selectedGenres, setSelectedGenres } = useContext(SharedContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFirstName(userData.firstName || "");
            setLastName(userData.lastName || "");
            setPurchases(userData.purchases || []);
            setGenres(userData.selectedGenres || []);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleUpdate = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { firstName, lastName }, { merge: true });
      updateUserPreferences({ firstName, lastName });
      await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !password) return;
    try {
      await updatePassword(auth.currentUser, password);
      setSuccess("Password updated successfully.");
    } catch (err) {
      setError("Failed to update password. Try re-authenticating.");
    }
  };

  const handleGenreUpdate = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { selectedGenres: genres }, { merge: true });
      setSelectedGenres(genres);
      updateUserPreferences({ selectedGenres: genres });
      setSuccess("Genre preferences updated successfully.");
    } catch (err) {
      setError("Failed to update genre preferences.");
    }
  };

  if (!user || user.providerData[0]?.providerId !== "password") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="settings-view">
      <h1>Settings</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <div className="form-group">
        <label>First Name:</label>
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <button onClick={handleUpdate}>Update Profile</button>

      <div className="form-group">
        <label>New Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handlePasswordChange}>Change Password</button>

      <h2>Genre Preferences</h2>
      <div className="genre-list">
        {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Fantasy", "Thriller"].map((genre) => (
          <label key={genre}>
            <input
              type="checkbox"
              checked={genres.includes(genre)}
              onChange={() => {
                setGenres((prev) =>
                  prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
                );
              }}
            />
            {genre}
          </label>
        ))}
      </div>
      <button onClick={handleGenreUpdate}>Update Genres</button>

      <h2>Purchase History</h2>
      {purchases.length > 0 ? (
        <ul>
          {purchases.map((purchase, index) => (
            <li key={index}>{purchase.title}</li>
          ))}
        </ul>
      ) : (
        <p>No past purchases.</p>
      )}
    </div>
  );
};

export default SettingsView;
