import "./Profile.scss";
import profile_src from "../../assets/others/profile.jpg";
import { FiEdit3 } from "react-icons/fi";
import { RiUser3Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { IoLogOutOutline } from "react-icons/io5";

import { useContext, useState, useEffect } from "react";
import { SharedContext } from "../../SharedContext";
import { fetchGenres } from "../../Data/Data";
import { Link } from "react-router-dom";

const Profile = () => {
  const { ShowProfile, mobileView, user, setUser, selectedGenres, setSelectedGenres } =
    useContext(SharedContext);

  const [editing, setEditing] = useState(false); // Toggle for settings
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [allGenres, setAllGenres] = useState([]); // List of all genres
  const [tempGenres, setTempGenres] = useState(selectedGenres || []); // Temporary state for selected genres

  useEffect(() => {
    fetchGenres("movie").then((data) => {
      setAllGenres(data);
    });
  }, []);

  const handleLogout = () => {
    setUser(null);
    alert("Logged out successfully!");
  };

  const toggleGenre = (genreId) => {
    setTempGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId) // Remove genre
        : [...prev, genreId] // Add genre
    );
  };

  const saveChanges = () => {
    setUser({ ...user, firstName, lastName });
    setSelectedGenres(tempGenres);
    alert("Profile updated!");
    setEditing(false); // Close settings
  };

  if (!mobileView) {
    return (
      <div className={`profile_info ${ShowProfile && "show"}`}>
        <header>
          <img src={profile_src} alt="Profile" />

          <div className="username">
            <span>{user?.firstName || "Guest"} {user?.lastName || ""}</span>
            <span className="email">{user?.email || "guest@example.com"}</span>
          </div>

          <FiEdit3 className="action_icon" onClick={() => setEditing(!editing)} />
        </header>

        {!editing ? (
          <ul>
            {user ? (
              <>
                <li>
                  <RiUser3Line className="icon" /> Account
                </li>
                <li onClick={() => setEditing(true)}>
                  <VscSettings className="icon" />
                  Preferences
                </li>
                <li className="logout" onClick={handleLogout}>
                  <IoLogOutOutline className="icon" />
                  Logout
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="default-login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        ) : (
          <div className="profile-settings">
            <h2>Edit Profile</h2>

            <div className="input-group">
              <label>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h2>Update Genres</h2>
            <p>Select at least 10 genres.</p>
            <div className="genres-list">
              {allGenres.length > 0 ? (
                allGenres.map((genre) => (
                  <div
                    key={genre.id}
                    className={`genre-item ${tempGenres.includes(genre.id) ? "selected" : ""}`}
                    onClick={() => toggleGenre(genre.id)}
                  >
                    {genre.name}
                  </div>
                ))
              ) : (
                <p>Loading genres...</p>
              )}
            </div>

            <button className="save-button" onClick={saveChanges} disabled={tempGenres.length < 10}>
              Save Changes
            </button>
            <button className="cancel-button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default Profile;
