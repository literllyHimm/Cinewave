import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SharedContext } from "../../SharedContext";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import "./SelectGenres.scss";

const SelectGenres = () => {
  const { user, selectedGenres, setSelectedGenres } = useContext(SharedContext);
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/genre/movie/list?api_key=9e9ae8b4151b5a20e5c95911ff07c4e4&language=en-US"
        );
        const data = await response.json();
        setGenres(data.genres || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError("Failed to load genres. Please try again.");
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const toggleGenre = (genreId) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.includes(genreId) ? prevGenres.filter((id) => id !== genreId) : [...prevGenres, genreId]
    );
  };

  const handleSubmit = async () => {
    if (selectedGenres.length < 10) {
      setError("Please select at least 10 genres.");
      return;
    }

    try {
      if (!user) {
        setError("User not found. Please log in again.");
        return;
      }

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { selectedGenres }, { merge: true });

      navigate("/");
    } catch (err) {
      console.error("Error updating genres:", err);
      setError("An error occurred while saving your preferences.");
    }
  };

  return (
    <div className="select-genres-page">
      <div className="select-genres-container">
        <h1>Select Your Favorite Genres</h1>
        <p>Choose at least 10 genres to personalize your experience.</p>

        {error && <p className="error-message">{error}</p>}

        {loading ? (
          <p>Loading genres...</p>
        ) : (
          <div className="genres-list">
            {genres.map((genre) => (
              <div
                key={genre.id}
                className={`genre-item ${selectedGenres.includes(genre.id) ? "selected" : ""}`}
                onClick={() => toggleGenre(genre.id)}
              >
                {genre.name}
              </div>
            ))}
          </div>
        )}

        <button className="submit-button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default SelectGenres;
