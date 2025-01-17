import React, { useState, useEffect, useContext } from "react";
import "./Setting.scss";
import { SharedContext } from "../../SharedContext";
import { fetchGenres } from "../../Data/Data";

const SettingsPage = () => {
  const { user, setUser, selectedGenres, setSelectedGenres } = useContext(SharedContext);

  // State for editing user details
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [allGenres, setAllGenres] = useState([]); // All genres from API
  const [tempGenres, setTempGenres] = useState(selectedGenres || []); // Temporary state for selected genres

  // Fetch all available genres
  useEffect(() => {
    fetchGenres("movie").then((data) => {
      setAllGenres(data);
    });
  }, []);

  // Handle Genre Selection
  const toggleGenre = (genreId) => {
    setTempGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId) // Remove genre
        : [...prev, genreId] // Add genre
    );
  };

  // Save Changes
  const handleSave = () => {
    setUser({ ...user, firstName, lastName });
    setSelectedGenres(tempGenres);
    alert("Settings Updated!");
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      
      {/* Name Section */}
      <div className="name-section">
        <h2>Update Name</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Genre Selection */}
      <div className="genre-selection">
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
      </div>

      {/* Save Button */}
      <button className="save-button" onClick={handleSave} disabled={tempGenres.length < 10}>
        Save Changes
      </button>
    </div>
  );
};

export default SettingsPage;
