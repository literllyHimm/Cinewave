import React, { useEffect, useState, useContext } from "react";
import { BiLibrary } from "react-icons/bi";
import { fetchFavorites, fetchBookmarks } from "../../Data/Data";
import MovieSection from "../../components/MovieSection/MovieSection";
import Movie from "../../components/Movie/Movie";
import "./Library.scss";
import { SharedContext } from "../../SharedContext";

const Library = () => {
  const { mobileView } = useContext(SharedContext);
  const [favorites, setFavorites] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLibraryData = async () => {
      setLoading(true);
      try {
        const favData = await fetchFavorites();
        const bookmarkData = await fetchBookmarks();
        setFavorites(favData);
        setBookmarks(bookmarkData);
      } catch (error) {
        console.error("🔥 Error fetching library data:", error);
      }
      setLoading(false);
    };

    getLibraryData();
  }, []);

  if (loading) return <div className="loading-screen">Loading Library...</div>;

  return (
    <div className="page library">
      {favorites.length > 0 && (
        <MovieSection sectionTitle="✨ Favorites">
          {favorites.map((movie) => {
            const mediaType =
              movie.media_type ?? (movie.first_air_date ? "tv" : "movie");

            return (
              <Movie
                key={movie.id}
                movie_banner={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                    : "https://via.placeholder.com/200x300"
                }
                type={mobileView ? "small" : "medium"}
                link={`/${mediaType}/${movie.id}`}
                content={movie}
                toggle
                mode="favorites"
                onRemoved={() =>
                  setFavorites((prev) => prev.filter((m) => m.id !== movie.id))
                }
              />
            );
          })}
        </MovieSection>
      )}

      {bookmarks.length > 0 && (
        <MovieSection sectionTitle="💫 Bookmarks">
          {bookmarks.map((movie) => {
            const mediaType =
              movie.media_type ?? (movie.first_air_date ? "tv" : "movie");

            return (
              <Movie
                key={movie.id}
                movie_banner={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                    : "https://via.placeholder.com/200x300"
                }
                type={mobileView ? "small" : "medium"}
                link={`/${mediaType}/${movie.id}`}
                content={movie}
                toggle
                mode="bookmarks"
                onRemoved={() =>
                  setBookmarks((prev) => prev.filter((m) => m.id !== movie.id))
                }
              />
            );
          })}
        </MovieSection>
      )}

      {favorites.length === 0 && bookmarks.length === 0 && (
        <div className="placeholder">
          <BiLibrary className="placeholder_illustration" />
          <span className="placeholder_txt">Library is empty</span>
        </div>
      )}
    </div>
  );
};

export default Library;
