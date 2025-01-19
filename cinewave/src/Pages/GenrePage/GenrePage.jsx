import React, { useState, useEffect, useContext } from "react";
import "./GenrePage.scss";
import { fetchSingleGenreMovies, fetchGenres } from "../../Data/Data";
import { SharedContext } from "../../SharedContext";
import { useCart } from "../../context/CartContext";

const GenrePage = () => {
  const { selectedGenres } = useContext(SharedContext);
  const { addToCart, cart } = useCart();
  const [movies, setMovies] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [genreNames, setGenreNames] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const moviesPerPage = 10;

  useEffect(() => {
    console.log("Selected Genres:", selectedGenres);

    fetchGenres("movie")
      .then((allGenres) => {
        if (!allGenres || !Array.isArray(allGenres)) {
          setError("Invalid genre data received.");
          return;
        }
        const genreMap = {};
        allGenres.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        setGenreNames(genreMap);
      })
      .catch((err) => {
        console.error("Error fetching genres:", err);
        setError("Failed to load genres.");
      });
  }, [selectedGenres]);

  useEffect(() => {
    if (activeGenre) {
      setMovies([]); // Reset movies when changing genre
      setError(null);
      fetchSingleGenreMovies(activeGenre, "movie", currentPage)
        .then((data) => {
          console.log(`Fetched Movies for Genre ${activeGenre}:`, data);

          if (!data || !data.results || !Array.isArray(data.results)) {
            setError("Invalid movie data received.");
            return;
          }

          setMovies(data.results); // Extract results array
          setTotalPages(data.totalPages || 1); // Store total pages
        })
        .catch((err) => {
          console.error("Error fetching movies:", err);
          setError("Failed to fetch movies. Please try again.");
        });
    }
  }, [activeGenre, currentPage]);

  return (
    <div className="genre-page">
      {/* Left: Genre List */}
      <aside className="genre-list">
        {selectedGenres.length > 0 ? (
          selectedGenres.map((genreId) => (
            <div
              key={`genre-${genreId}`}
              className={`genre-item ${activeGenre === genreId ? "active" : ""}`}
              onClick={() => {
                setActiveGenre(genreId);
                setCurrentPage(1);
                setError(null);
              }}
            >
              {genreNames[genreId] || "Unknown Genre"}
            </div>
          ))
        ) : (
          <p>No genres selected.</p>
        )}
      </aside>

      {/* Right: Movie List */}
      <main className="movie-list">
        {error ? (
          <p className="error-message">{error}</p>
        ) : activeGenre ? (
          movies.length > 0 ? (
            <>
              <div className="movies-container">
                {movies.map((movie) => (
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
                    <button
                      className={`add-to-cart-btn ${
                        cart.some((item) => item.id === movie.id) ? "in-cart" : ""
                      }`}
                      onClick={() => addToCart(movie)}
                      disabled={cart.some((item) => item.id === movie.id)}
                    >
                      {cart.some((item) => item.id === movie.id) ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination-controls">
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ⬅ Prev
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    className="page-button"
                    onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                    disabled={currentPage >= totalPages}
                  >
                    Next ➡
                  </button>
                </div>
              )}
            </>
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
