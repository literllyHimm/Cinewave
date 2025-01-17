import React, { useState, useEffect } from "react";
import "./GenrePage.scss";
import { fetchSingleGenreMovies, fetchGenres } from "../../Data/Data";
import { useContext } from "react";
import { SharedContext } from "../../SharedContext";

const GenrePage = () => {
  const { selectedGenres } = useContext(SharedContext); // Get genres from context
  const [movies, setMovies] = useState({});
  const [activeGenre, setActiveGenre] = useState(null);
  const [genreNames, setGenreNames] = useState({});

  useEffect(() => {
    console.log("Selected Genres:", selectedGenres);

    // Fetch all available genres from TMDB
    fetchGenres("movie").then((allGenres) => {
      const genreMap = {};
      allGenres.forEach((genre) => {
        genreMap[genre.id] = genre.name;
      });
      setGenreNames(genreMap);
    });
  }, [selectedGenres]);

  useEffect(() => {
    if (activeGenre && !movies[activeGenre]) {
      fetchSingleGenreMovies(activeGenre, "movie")
        .then((data) => {
          console.log(`Fetched Movies for Genre ${activeGenre}:`, data);

          // **Filter duplicate movies** before updating state
          const uniqueMovies = Array.from(new Map(data.map(movie => [movie.id, movie])).values());

          setMovies((prevMovies) => ({
            ...prevMovies,
            [activeGenre]: uniqueMovies,
          }));
        })
        .catch((err) => console.error("Error fetching movies:", err));
    }
  }, [activeGenre]);

  return (
    <div className="genre-page">
      {/* Left: Genres List */}
      <aside className="genre-list">
        {selectedGenres.length > 0 ? (
          selectedGenres.map((genreId) => (
            <div
              key={`genre-${genreId}`} // Ensures uniqueness
              className={`genre-item ${activeGenre === genreId ? "active" : ""}`}
              onClick={() => setActiveGenre(genreId)}
            >
              {genreNames[genreId] || "Unknown Genre"}
            </div>
          ))
        ) : (
          <p>No genres selected.</p>
        )}
      </aside>

      {/* Right: Movies List */}
      <main className="movie-list">
        {activeGenre ? (
          movies[activeGenre]?.length > 0 ? (
            movies[activeGenre].map((movie) => (
              <div key={`movie-${movie.id}-${activeGenre}`} className="movie-card">
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "https://via.placeholder.com/200x300"
                  }
                  alt={movie.title || "No Title"}
                />
                <h4>{movie.title || "No Title Available"}</h4>
              </div>
            ))
          ) : (
            <p>No movies found for this genre.</p>
          )
        ) : (
          <p>Select a genre to view movies.</p>
        )}
      </main>
    </div>
  );
};

export default GenrePage;
