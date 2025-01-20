import React, { useState, useEffect, useContext } from "react";
import { SharedContext } from "../../SharedContext";
import { auth, db } from "../../firebase";
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./Setting.scss";

const SettingsView = () => {
  const { user, setUser, selectedGenres, setSelectedGenres, updateUserPreferences } = useContext(SharedContext);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [password, setPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // Required for password change
  const [allGenres, setAllGenres] = useState([]);
  const [tempGenres, setTempGenres] = useState(selectedGenres || []);
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData(user.uid);
      fetchGenres();
    }
  }, [user]);

  // 🔹 Fetch user details (including past purchases)
  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
        setPurchases(userData.purchases || []);
        setSelectedGenres(userData.selectedGenres || []);
      }
    } catch (error) {
      console.error("🔥 Error fetching user data:", error);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch genres from API
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?api_key=9e9ae8b4151b5a20e5c95911ff07c4e4"
      );
      const data = await response.json();
      setAllGenres(data.genres || []);
    } catch (error) {
      console.error("🔥 Error fetching genres:", error);
    }
  };

  // 🔹 Toggle genre selection
  const toggleGenre = (genreId) => {
    setTempGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  // 🔹 Update name in Firebase Authentication and Firestore
  const updateProfileInfo = async () => {
    if (!user || !user.email) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { firstName, lastName }, { merge: true });

      await updateProfile(auth.currentUser, {
        displayName: `${firstName} ${lastName}`,
      });

      setUser({ ...user, firstName, lastName });
      updateUserPreferences({ firstName, lastName });

      setSuccess("Profile updated successfully.");
    } catch (error) {
      setError("🔥 Error updating profile.");
    }
  };

  // 🔹 Reauthenticate user before updating password
  const reauthenticateUser = async () => {
    if (!user || !currentPassword) {
      setError("⚠️ Please enter your current password.");
      return false;
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    try {
      await reauthenticateWithCredential(auth.currentUser, credential);
      return true;
    } catch (error) {
      setError("⚠️ Incorrect password. Please try again.");
      return false;
    }
  };

  // 🔹 Update password (only for email-authenticated users)
  const updateUserPassword = async () => {
    if (!user || !password) return;
    if (user.providerData[0]?.providerId !== "password") {
      setError("⚠️ Password updates are only available for email-registered users.");
      return;
    }

    const isReauthenticated = await reauthenticateUser();
    if (!isReauthenticated) return;

    try {
      await updatePassword(auth.currentUser, password);
      setSuccess("Password updated successfully.");
    } catch (error) {
      setError("🔥 Error updating password. Try again.");
    }
  };

  // 🔹 Update genres in Firestore and Context
  const updateGenrePreferences = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { selectedGenres: tempGenres }, { merge: true });

      setSelectedGenres(tempGenres);
      updateUserPreferences({ selectedGenres: tempGenres });

      setSuccess("Genres updated successfully.");
    } catch (error) {
      setError("🔥 Error updating genres.");
    }
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="input-group">
            <label>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <button onClick={updateProfileInfo} className="save-button">
            Update Profile
          </button>

          {user?.providerData[0]?.providerId === "password" && (
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <label>New Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <button onClick={updateUserPassword} className="save-button">
                Change Password
              </button>
            </div>
          )}

          <div className="genres-section">
            <h2>Update Favorite Genres</h2>
            <p>Select at least 10 genres.</p>
            <div className="genres-list">
              {allGenres.map((genre) => (
                <div
                  key={genre.id}
                  className={`genre-item ${tempGenres.includes(genre.id) ? "selected" : ""}`}
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </div>
              ))}
            </div>
            <button className="save-button" onClick={updateGenrePreferences} disabled={tempGenres.length < 10}>
              Save Genre Preferences
            </button>
          </div>

          <h2>Purchase History</h2>
          {purchases.length > 0 ? (
            <ul className="purchase-list">
              {purchases.map((purchase, index) => (
                <li key={index}>
                  {purchase.title} - Purchased on{" "}
                  {purchase.purchasedAt?.toDate
                    ? new Date(purchase.purchasedAt.toDate()).toLocaleDateString()
                    : "Unknown Date"}
                </li>
              ))}
            </ul>
          ) : (
            <p>No past purchases.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SettingsView;
